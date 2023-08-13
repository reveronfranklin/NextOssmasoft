import { IListConceptosDto } from "./i-list-conceptos";

export interface IRhProcesoGetDto{


  codigoProceso:number;
  descripcion :string;
  conceptos:IListConceptosDto[]
}
