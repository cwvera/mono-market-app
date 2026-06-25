import { Observable, OperatorFunction, of, switchMap } from 'rxjs';

/**
 * Encadena un Observable de selección (factura, correo, etc.) con la
 * petición HTTP que depende de ella.
 * @summary Operador RxJs reutilizable: cuando la selección es null emite un
 * arreglo vacío sin llamar a la API; cuando cambia, cancela la petición en
 * curso (switchMap) y dispara la nueva. Evita repetir el mismo patrón
 * "selección nula -> []" en cada panel que depende de InvoiceSelectionStore.
 * @template TSelection Tipo del valor seleccionado (p. ej. InvoiceDto).
 * @template TResult Tipo de cada elemento del arreglo resultante.
 * @param fetch Función que construye el Observable de datos a partir de la selección.
 * @returns Operador para usar dentro de un `.pipe(...)`.
 */
export function switchMapWhenSelected<TSelection, TResult>(
  fetch: (selection: TSelection) => Observable<TResult[]>
): OperatorFunction<TSelection | null, TResult[]> {
  return (source: Observable<TSelection | null>) =>
    source.pipe(switchMap((selection) => (selection ? fetch(selection) : of<TResult[]>([]))));
}
