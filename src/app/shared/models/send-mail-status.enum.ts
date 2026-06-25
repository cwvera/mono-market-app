/**
 * Estado del envío de un correo (cabecera `SendMails`).
 * @summary Espejo de `MonoMarket.Commons.Enums.SendMailStatus` (backend).
 */
export enum SendMailStatus {
  /** Pendiente de envío. */
  Pending = 0,
  /** Enviado correctamente. */
  Sent = 1,
  /** Falló el envío. */
  Failed = 2,
  /** Se alcanzó el máximo de reintentos. */
  MaxRetries = 3,
}
