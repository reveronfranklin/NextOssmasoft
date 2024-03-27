import { IPreAsignacionesGetDto } from "./PreAsignacionesGetDto";

export interface IPreAsignacionesExcelUpdateDto {

  codigoPresupuesto:number;
  asignaciones?:IPreAsignacionesGetDto[]
}
