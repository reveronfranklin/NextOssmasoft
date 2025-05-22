export interface IApiResponse<T> {
  data?: T[] | T | null;
  isValid?: boolean,
  linkData?: string | null,
  linkDataArlternative?: string | null,
  message: string,
  page?: number,
  totalPage?: number,
  cantidadRegistros?: number,
  total1?: number,
  total2?: number,
  total3?: number,
  total4?: number,
  success: boolean
  error?: string
  statusCode?: number,
}