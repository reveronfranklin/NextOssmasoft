export interface DTOUpdateParametro {
  id: number;
  variableId: number;
  orden: number;
  code: string;
  usuarioConectado: string;
}

export type IUpdateParametroResponse = {
  id: number;
  variableId: number;
  orden: number;
  descripcionVariable: string;
  code: string;
  searchText: string;
};

export interface ErrorResponse {
  status: number;
  message: ErrorMessage;
}

export interface ErrorMessage {
  isValid: boolean;
  linkData: string;
  linkDataAlternative: string;
  message: string;
  statusCode: number;
  error: string;
  success: boolean;
  page: number;
  totalPage: number;
  cantidadRegistros: number;
  total1: number;
  total2: number;
  total3: number;
  total4: number;
  data: null;
}
