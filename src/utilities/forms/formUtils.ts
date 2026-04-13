import { FieldValues, UseFormSetError, Path } from 'react-hook-form';

/**
 * Establece un error dinámico en un formulario de React Hook Form.
 * @param setError - La función setError retornada por el hook useForm.
 * @param field - El nombre del campo (tipado automáticamente).
 * @param messageCustom - Mensaje opcional.
 */
export const setErrorDynamic = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  field: Path<T>,
  messageCustom?: string
) => {
  setError(field, {
    type: 'manual',
    message: messageCustom ?? `El ${String(field)} es requerido, ingrese un ${String(field)} válido.`
  }, { shouldFocus: true })
}