export interface DTOCreateParametro {
  variableId: number;
  code: string;
  orden: number;
  usuarioConectado: string;
}

export type ICreateParametroResponse = {
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