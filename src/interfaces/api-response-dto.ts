export interface IApiResponse<T> {
  success: boolean
  message: string,
  isValid?: boolean,
  cantidadRegistros?: number
  data?: T[]
  error?: string
  statusCode?: number,
}