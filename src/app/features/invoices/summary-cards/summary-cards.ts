import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { InvoiceDto, InvoiceStatus } from '@shared/models';

/**
 * Tarjetas de resumen (total y conteo por estado) del listado de facturas.
 * @summary Puramente presentacional: recibe el listado ya filtrado por
 * `input()` y deriva los conteos con `computed()`, sin llamadas HTTP propias.
 */
@Component({
  selector: 'app-summary-cards',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.scss',
})
export class SummaryCards {
  /** Facturas sobre las que se calculan los conteos (ya filtradas). */
  readonly invoices = input<InvoiceDto[]>([]);

  /** Conteos derivados: total y por cada estado relevante para el negocio. */
  protected readonly summary = computed(() => {
    const items = this.invoices();
    const countByStatus = (status: InvoiceStatus) => items.filter((item) => item.status === status).length;

    return {
      total: items.length,
      firstReminder: countByStatus(InvoiceStatus.FirstReminder),
      secondReminder: countByStatus(InvoiceStatus.SecondReminder),
      deactivated: countByStatus(InvoiceStatus.Deactivated),
      paid: countByStatus(InvoiceStatus.Paid),
    };
  });
}
