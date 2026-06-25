import { SendMailLogStatus } from './send-mail-log-status.enum';

/**
 * Representación del detalle de un intento de envío, tal como la expone la API.
 * @summary Espejo de `MonoMarket.Application.SendMails.Dtos.SendMailLogDto` (backend).
 */
export interface SendMailLogDto {
  /** Identificador del documento en MongoDB. */
  id: string;
  /** Identificador del `SendMail` (cabecera) al que pertenece este intento. */
  sendMailId: string;
  /** Número del intento (1, 2, 3...). */
  attemptNumber: number;
  /** Estado de este intento puntual. */
  status: SendMailLogStatus;
  /** Mensaje de error si el intento falló, o `null` si fue exitoso. */
  errorMessage: string | null;
  /** Duración del intento en milisegundos. */
  durationMs: number;
  /** Fecha en la que se realizó este intento. */
  sentAt: string;
  /** Fecha de creación del registro de este intento. */
  createdAt: string;
}
