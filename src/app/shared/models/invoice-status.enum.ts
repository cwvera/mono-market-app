/**
 * Valores conocidos para `InvoiceDto.status`.
 * @summary Espejo de `MonoMarket.Commons.Enums.InvoiceStatus` (backend). El
 * campo es un `int` abierto más allá de `FourthReminder`, por eso este enum
 * solo cubre los valores que la UI necesita reconocer explícitamente.
 */
export enum InvoiceStatus {
  /** Factura desactivada. */
  Deactivated = -2,
  /** Factura pendiente de pago. */
  Pending = -1,
  /** Factura pagada. */
  Paid = 0,
  /** Primer recordatorio enviado. */
  FirstReminder = 1,
  /** Segundo recordatorio enviado. */
  SecondReminder = 2,
  /** Tercer recordatorio enviado. */
  ThirdReminder = 3,
  /** Cuarto recordatorio enviado. */
  FourthReminder = 4,
}
