export interface ResultDto<T> {
  data: T | null
  isValid: boolean
  message: string
  cantidadRegistros?: number
  page?: number
  linkData?: string
  linkDataArlternative?: string
}
