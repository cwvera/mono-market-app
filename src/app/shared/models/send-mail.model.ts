import { SendMailStatus } from './send-mail-status.enum';
import { SendMailTemplateType } from './send-mail-template-type.enum';

/**
 * Representación de la cabecera de un correo de recordatorio, tal como la expone la API.
 * @summary Espejo de `MonoMarket.Application.SendMails.Dtos.SendMailDto` (backend).
 */
export interface SendMailDto {
  /** Identificador del documento en MongoDB. */
  id: string;
  /** Número de la factura a la que pertenece este correo. */
  invoiceNumber: string;
  /** Correo electrónico del destinatario. */
  toEmail: string;
  /** Nombre del destinatario. */
  toName: string;
  /** Tipo de plantilla usada para el correo. */
  templateType: SendMailTemplateType;
  /** Asunto del correo. */
  subject: string;
  /** Estado del envío. */
  status: SendMailStatus;
  /** Número total de intentos realizados. */
  totalAttempts: number;
  /** Fecha del último intento de envío, o `null` si aún no se ha intentado. */
  lastAttemptAt: string | null;
  /** Información contextual del envío (cliente, factura, cambio de estado), como JSON serializado. */
  data: string;
  /** Fecha de creación del registro. */
  createdAt: string;
  /** Fecha de última actualización del registro. */
  updatedAt: string;
}
