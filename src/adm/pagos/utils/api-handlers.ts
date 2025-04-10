import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

// Tipo genérico para las funciones de setter
type SetterFunction<T> = (value: T) => void

/**
 * Interfaz para las opciones de manejo de API
 */
interface ApiHandlerOptions {
    setError?: SetterFunction<string>
    setMessage?: SetterFunction<IAlertMessageDto>
    logErrors?: boolean
}

/**
 * Maneja errores de API de forma consistente
 * @param error El error capturado
 * @param options Opciones de configuración
 * @returns null para indicar que ocurrió un error
 */
export const handleApiError = (error: any, options?: ApiHandlerOptions) => {
    const errorMessage = error?.message || 'Error desconocido'

    // Establecer el mensaje de error si se proporciona la función setter
    if (options?.setError) {
        options.setError(errorMessage)
    }

    // Establecer el mensaje de alerta si se proporciona la función setter
    if (options?.setMessage) {
        options.setMessage({
            text: errorMessage,
            timestamp: Date.now(),
            isValid: false
        })
    }

    // Registrar el error en la consola si se habilita el registro
    if (options?.logErrors !== false) {
        console.error(error)
    }

    return null
}

/**
 * Procesa respuestas de API de forma consistente
 * @param response La respuesta de la API
 * @param options Opciones de configuración
 * @param successMessage Mensaje opcional de éxito
 * @returns Los datos de la respuesta o null
 */
export const handleApiResponse = <T>(
  response: { data: T },
  options?: ApiHandlerOptions,
  successMessage?: string
): T | null => {
    if (response && response.data) {
        // Establecer el mensaje de éxito si se proporciona
        if (successMessage && options?.setMessage) {
            options.setMessage({
                text: successMessage,
                timestamp: Date.now(),
                isValid: true
            })
        }

        return response.data
    }

    return null
}

/**
 * Hook personalizado para crear manejadores de API con estado local
 * @param setError Función para establecer el error
 * @param setMessage Función para establecer el mensaje
 * @returns Objeto con funciones de manejo de API
 */
export const createApiHandlers = (
    setError?: SetterFunction<string>,
    setMessage?: SetterFunction<IAlertMessageDto>
) => {
    const options: ApiHandlerOptions = {
        setError,
        setMessage,
        logErrors: true
    }

    return {
        handleApiError: (error: any) => handleApiError(error, options),
        handleApiResponse: <T>(response: { data: T }, successMessage?: string) => handleApiResponse<T>(response, options, successMessage)
    }
}