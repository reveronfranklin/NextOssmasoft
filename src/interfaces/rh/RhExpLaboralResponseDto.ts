import { IFechaDto } from "../fecha-dto";

export interface IRhExpLaboralResponseDto{
  codigoExpLaboral: number;
  codigoPersona :number;
  nombreEmpresa :string;
  tipoEmpresa :string;
  ramoId :number;
  cargo:string;
  fechaDesde:Date;
  fechaHasta :Date;
  fechaDesdeString:string;
  fechaHastaString:string;
  fechaDesdeObj:IFechaDto;
  fechaHastaObj :IFechaDto;
  ultimoSueldo:number;
  supervisor :string;
  cargoSupervisor  :string;
  telefono: string;
  descripcion  :string;
}
