# MonoMarket — Resumen de facturas

Frontend Angular 21 (standalone, Angular Material) para el flujo de recordatorios de facturas de MonoMarket. Consume la API en [`mono-market-api`](../mono-market-api) y muestra, por cada factura, los correos de recordatorio enviados y los intentos de envío de cada correo.

La URL del backend se configura en `src/environments/environment.ts` (y `environment.development.ts`), `apiBaseUrl`. Por defecto: `http://localhost:8080/api`.

## Requisitos

- El backend (`MonoMarket.WebApi`) corriendo y accesible en `http://localhost:8080` (con CORS habilitado).
- Node 20+ / npm, **o** Docker + Docker Compose.

## Desarrollo local

```bash
npm install
npm start        # ng serve, http://localhost:4200/invoices
```

## Docker

```bash
docker compose up -d --build   # http://localhost:4200/invoices
docker compose down
```

`WEB_PORT` cambia el puerto del host si 4200 ya está en uso:

```bash
WEB_PORT=8088 docker compose up -d --build
```

## Arquitectura

```
src/app/
├── core/                 # transversal: interceptors HTTP, LoadingService
├── shared/
│   ├── models/           # DTOs y enums, espejo 1:1 de los DTOs/enums del backend (C#)
│   ├── pipes/            # *-status-label.pipe.ts: traducen un enum a texto
│   └── utils/            # switchMapWhenSelected: operador RxJs reutilizable
└── features/invoices/
    ├── data-access/      # InvoiceApiService, SendMailApiService, SendMailLogApiService,
    │                        InvoiceSelectionStore (un servicio HTTP por recurso del backend)
    ├── invoices-summary-page/   # smart component: filtros + listado + pestañas
    ├── invoice-table/           # presentacional: tabla de facturas
    ├── summary-cards/           # presentacional: conteos por estado
    ├── sent-emails-panel/       # correos de la factura seleccionada
    └── email-attempts-panel/    # intentos del correo seleccionado
```

### Flujo de selección (factura → correos → intentos)

`InvoicesSummaryPage` muestra 3 pestañas (Material `mat-tab-group`): **Facturas**, **Correos** e **Intentos**. Las pestañas 2 y 3 solo existen una vez que hay selección; seleccionar una fila **no** cambia de pestaña automáticamente — el usuario decide cuándo entrar a ver el detalle.

La factura y el correo seleccionados viven en `InvoiceSelectionStore` (un `BehaviorSubject` por cada uno), provisto a nivel de `InvoicesSummaryPage`. `SentEmailsPanel` y `EmailAttemptsPanel` son hermanos en el DOM (cada uno en su propia pestaña) y leen el store directamente vía inyección jerárquica, en vez de recibir la selección por `@Input` a través de varios niveles.

### Técnicas usadas, y por qué cada una vive donde vive

- **Reactive Forms**: filtro de facturas (cliente + estado) en `invoices-summary-page`.
- **RxJs**: cada `*-api.service.ts` devuelve `Observable`; `invoices-summary-page` combina edición del formulario (debounced) y el botón "Refrescar" con `merge` (no `combineLatest`, para evitar arrastrar un filtro cacheado/desactualizado en el refresh — ver el doc del código).
- **Signals**: `computed()` para los conteos derivados (`summary-cards`) y para `LoadingService`; los componentes presentacionales usan `input()`/`output()` en vez de decoradores.
- **BehaviorSubject**: `InvoiceSelectionStore`, mecanismo explícito de comunicación entre `sent-emails-panel` y `email-attempts-panel`.
- **async pipe**: en los paneles de correos/intentos, cuyos observables nacen de un `switchMap` sobre el store.

## Comandos

```bash
npm start       # ng serve
npm run build   # ng build (producción)
npm test        # ng test (Vitest)
```
