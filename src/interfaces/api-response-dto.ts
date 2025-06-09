
export interface IApiResponseBase {
  isValid?: boolean;
  linkData?: string | null;
  linkDataAlternative?: string | null;
  message: string;
  page?: number;
  totalPage?: number;
  cantidadRegistros?: number;
  total1?: number;
  total2?: number;
  total3?: number;
  total4?: number;
  success: boolean;
  error?: string;
  statusCode?: number;
}
export interface IApiResponse<T> extends IApiResponseBase {
  data?: T[]
}

export interface IApiFlexibleResponse<T> extends IApiResponseBase {
  data?: T | T[] | null
}

export interface ISingleResponse<T> extends IApiResponseBase {
  data?: T | null
}
