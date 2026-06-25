import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoices',
    pathMatch: 'full',
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/invoices/invoices-summary-page/invoices-summary-page').then(
        (c) => c.InvoicesSummaryPage
      ),
  },
  {
    path: '**',
    redirectTo: 'invoices',
  },
];
