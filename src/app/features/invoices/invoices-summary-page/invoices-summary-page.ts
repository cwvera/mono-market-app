import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject, debounceTime, distinctUntilChanged, map, merge, startWith, switchMap, tap } from 'rxjs';

import { InvoiceDto, InvoiceFilter, InvoiceStatus, SendMailDto } from '@shared/models';
import { InvoiceApiService } from '../data-access/invoice-api.service';
import { InvoiceSelectionStore } from '../data-access/invoice-selection.store';
import { InvoiceTable } from '../invoice-table/invoice-table';
import { SummaryCards } from '../summary-cards/summary-cards';
import { SentEmailsPanel } from '../sent-emails-panel/sent-emails-panel';
import { EmailAttemptsPanel } from '../email-attempts-panel/email-attempts-panel';

/** Valor crudo expuesto por `filterForm.valueChanges` / `getRawValue()`. */
type InvoiceFilterFormValue = {
  clientIdentification?: string | null;
  status?: InvoiceStatus | null;
};

/**
 * Página de resumen de facturas: filtros, listado y el flujo guiado de
 * detalle (correos enviados -> intentos de envío) en pestañas.
 * @summary Contenedor "inteligente" de la feature de facturas. Provee
 * {@link InvoiceSelectionStore} a nivel de componente para que la misma
 * instancia llegue, vía inyección jerárquica, a {@link SentEmailsPanel} y a
 * {@link EmailAttemptsPanel} —hermanos en el DOM, cada uno en su propia
 * pestaña— sin necesidad de pasar la selección por @Input/@Output entre ellos.
 */
@Component({
  selector: 'app-invoices-summary-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    InvoiceTable,
    SummaryCards,
    SentEmailsPanel,
    EmailAttemptsPanel,
  ],
  providers: [InvoiceSelectionStore],
  templateUrl: './invoices-summary-page.html',
  styleUrl: './invoices-summary-page.scss',
})
export class InvoicesSummaryPage {
  private readonly fb = inject(FormBuilder);
  private readonly invoiceApi = inject(InvoiceApiService);
  private readonly selectionStore = inject(InvoiceSelectionStore);

  /** Opciones del filtro de estado, en el mismo orden del flujo de recordatorios. */
  protected readonly statusOptions = [
    { value: null, label: 'Todos los estados' },
    { value: InvoiceStatus.Pending, label: 'Pendiente' },
    { value: InvoiceStatus.FirstReminder, label: 'Primer recordatorio' },
    { value: InvoiceStatus.SecondReminder, label: 'Segundo recordatorio' },
    { value: InvoiceStatus.Deactivated, label: 'Desactivada' },
    { value: InvoiceStatus.Paid, label: 'Pagada' },
  ];

  /** Formulario reactivo de filtros (cliente + estado) que alimenta {@link invoices$}. */
  protected readonly filterForm = this.fb.group({
    clientIdentification: [''],
    status: [null as InvoiceStatus | null],
  });

  /**
   * Disparador manual del botón "Refrescar".
   * @summary Emite el valor del formulario tal cual está en el momento del
   * clic, sin pasar por el debounce de {@link formFilters$}. Evitar
   * `combineLatest` aquí es deliberado: combinarlo con un stream debounced
   * arrastraría el último filtro *cacheado* (que puede estar desactualizado
   * justo después de un `reset()`) en lugar del valor recién limpiado.
   */
  private readonly refresh$ = new Subject<InvoiceFilterFormValue>();

  /**
   * Reinicia la suscripción interna de {@link formFilters$}.
   * @summary Sin esto, un debounce de 300ms disparado por una tecla justo
   * antes de un clic en "Refrescar" seguiría en curso y, al resolver,
   * pisaría silenciosamente el resultado del refresh con un filtro viejo.
   * Emitir aquí fuerza un `switchMap` que cancela esa suscripción (y su
   * timer pendiente) antes de que el refresh dispare su propio fetch.
   */
  private readonly restartFormFiltersDebounce$ = new Subject<void>();

  /**
   * Filtros que cambian por edición del usuario, con debounce y deduplicados.
   * @summary Evita disparar una petición por cada tecla y evita refetch si
   * el valor no cambió realmente. Envuelto en `switchMap` sobre
   * {@link restartFormFiltersDebounce$} para poder cancelar un debounce en
   * curso (ver el doc de ese subject).
   */
  private readonly formFilters$ = this.restartFormFiltersDebounce$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.filterForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
    )
  );

  /**
   * Listado de facturas vigente según los filtros activos.
   * @summary Pipeline principal de la página. Se recalcula ante dos fuentes
   * independientes —edición del formulario ({@link formFilters$}) o clic en
   * "Refrescar" ({@link refresh$})— fusionadas con `merge` en vez de
   * `combineLatest`, así cada una dispara su propio fetch con su propio
   * valor sin depender de qué tenga cacheada la otra. Cada emisión limpia la
   * selección anterior (`selectInvoice(null)`) porque la factura/correo
   * seleccionados pueden ya no pertenecer al resultado filtrado.
   */
  private readonly invoices$ = merge(this.formFilters$, this.refresh$).pipe(
    startWith(this.filterForm.getRawValue()),
    map((value) => this.toInvoiceFilter(value)),
    tap(() => this.selectionStore.selectInvoice(null)),
    switchMap((filters) => this.invoiceApi.getAll(filters))
  );

  /** Listado de facturas como signal, para uso directo en el template. */
  protected readonly invoices = toSignal(this.invoices$, { initialValue: [] as InvoiceDto[] });

  /** Factura seleccionada actualmente (o `null`), reflejo del store como signal. */
  protected readonly selectedInvoice = toSignal(this.selectionStore.selectedInvoice$, {
    initialValue: null as InvoiceDto | null,
  });

  /** Correo seleccionado actualmente (o `null`), reflejo del store como signal. */
  protected readonly selectedSendMail = toSignal(this.selectionStore.selectedSendMail$, {
    initialValue: null as SendMailDto | null,
  });

  /** Id de la factura seleccionada, usado solo para resaltar la fila en la tabla. */
  protected readonly selectedInvoiceId = toSignal(
    this.selectionStore.selectedInvoice$.pipe(map((invoice) => invoice?.id ?? null)),
    { initialValue: null }
  );

  /** Pestaña activa del flujo guiado (0 = Facturas, 1 = Correos, 2 = Intentos). */
  protected readonly activeTab = signal(0);

  /** Cantidad de pestañas visibles dado el estado actual de la selección. */
  private readonly visibleTabCount = computed(() => {
    if (this.selectedSendMail()) return 3;
    if (this.selectedInvoice()) return 2;
    return 1;
  });

  constructor() {
    // Salvaguarda, no navegación automática: si la pestaña activa deja de
    // existir (la selección se limpió al filtrar/refrescar), la regresamos a
    // la última pestaña válida. Nunca avanzamos la pestaña al seleccionar
    // una factura o un correo: el usuario decide cuándo mirar "Correos" o
    // "Intentos" haciendo clic él mismo.
    effect(() => {
      const lastValidIndex = this.visibleTabCount() - 1;
      if (this.activeTab() > lastValidIndex) {
        this.activeTab.set(lastValidIndex);
      }
    });
  }

  /**
   * Normaliza el valor crudo del formulario al contrato {@link InvoiceFilter} de la API.
   * @summary Convierte strings vacíos/blancos en `null` para no enviar filtros inútiles.
   */
  private toInvoiceFilter(value: InvoiceFilterFormValue): InvoiceFilter {
    return {
      clientIdentification: value.clientIdentification?.trim() || null,
      status: value.status ?? null,
    };
  }

  /**
   * Selecciona una factura en el store compartido.
   * @summary No cambia de pestaña; solo habilita que aparezca "Correos".
   */
  protected onSelectInvoice(invoice: InvoiceDto): void {
    this.selectionStore.selectInvoice(invoice);
  }

  /**
   * Refresca el listado de facturas limpiando los filtros.
   * @summary El `reset` no emite por sí mismo (`emitEvent: false`, para no
   * disparar también el camino debounced de {@link formFilters$}). Antes de
   * pedir el fetch, cancela cualquier debounce pendiente de una tecla
   * anterior ({@link restartFormFiltersDebounce$}) y solo entonces empuja el
   * valor ya limpio a {@link refresh$}.
   */
  protected refresh(): void {
    this.filterForm.reset({ clientIdentification: '', status: null }, { emitEvent: false });
    this.restartFormFiltersDebounce$.next();
    this.refresh$.next(this.filterForm.getRawValue());
  }

  /**
   * Sincroniza la pestaña activa cuando el usuario hace clic manualmente.
   * @summary Único punto de escritura de {@link activeTab} fuera de la
   * salvaguarda del constructor.
   */
  protected onTabChange(index: number): void {
    this.activeTab.set(index);
  }
}
