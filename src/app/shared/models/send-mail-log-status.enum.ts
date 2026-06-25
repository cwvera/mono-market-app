/**
 * Estado de un intento individual de envío de correo (detalle `SendMailsLog`).
 * @summary Espejo de `MonoMarket.Commons.Enums.SendMailLogStatus` (backend).
 */
export enum SendMailLogStatus {
  /** El intento se envió correctamente. */
  Sent = 0,
  /** El intento falló. */
  Failed = 1,
}
