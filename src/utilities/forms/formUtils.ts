import { FieldValues, UseFormSetError, Path } from 'react-hook-form';

export interface FormFieldValidation<T> {
  name: keyof T;
  value: any;
  message?: string;
  isMonto?: boolean;
}

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

export const validateFields = <T extends FieldValues>(
  fields: FormFieldValidation<T>[],
  setError: UseFormSetError<T>
): boolean => {
  const firstError = fields.find(field => {
    if (field.isMonto) {
      const amount = Number(field.value)

      return field.value === '' || isNaN(amount) || amount === 0
    }

    return !field.value
  })

  if (firstError) {
    setErrorDynamic(setError, firstError.name as any, firstError.message)

    return false
  }

  return true
}