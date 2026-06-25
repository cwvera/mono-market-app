import { InvoiceStatus } from './invoice-status.enum';

/**
 * Representación de una factura tal como la expone la API.
 * @summary Espejo de `MonoMarket.Application.Invoices.Dtos.InvoiceDto` (backend).
 */
export interface InvoiceDto {
  /** Identificador del documento en MongoDB. */
  id: string;
  /** Número de factura, p. ej. "FAC-001-2025". */
  invoiceNumber: string;
  /** Identificación (NIT/Cédula) del cliente. */
  clientIdentification: string;
  /** Monto de la factura. */
  amount: number;
  /** Fecha de emisión, en formato ISO. */
  issueDate: string;
  /** Estado actual de la factura. */
  status: InvoiceStatus;
  /** Fecha del último recordatorio enviado, o `null` si no se ha enviado ninguno. */
  lastReminderSentAt: string | null;
  /** Número de recordatorios enviados. */
  reminderCount: number;
}

/**
 * Filtros opcionales para listar facturas.
 * @summary Mapea 1:1 a los query params de `GET /api/invoices` (ambos opcionales).
 */
export interface InvoiceFilter {
  /** Coincidencia parcial sobre la identificación del cliente, o `null` para no filtrar. */
  clientIdentification: string | null;
  /** Estado exacto a filtrar, o `null` para incluir todos los estados. */
  status: InvoiceStatus | null;
}
