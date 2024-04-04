import { ThemeColor } from "src/@core/layouts/types";
import { ITiempoServicioResponseDto } from "./TiempoServicioResponseDto";
import { IFechaDto } from "../fecha-dto";


export interface IListSimplePersonaDto{


  codigoPersona :number;
  cedula:number;
  nombre :string;
  apellido :string;
  nombreCompleto :string;
  avatar:string;
  avatarColor?: ThemeColor;
  descripcionStatus:string;
  nacionalidad:string;
  sexo:string;
  fechaNacimiento?:Date;
  fechaNacimientoString?:string;
  fechaNacimientoObj?:IFechaDto;

  edad:number
  paisNacimientoId:number;
  estadoNacimientoId:number;
  paisNacimiento:string;
  email:string;
  descripcionEstadoCivil:string;
  codigoCargo?:number;
  descripcionCargo?:string;
  codigoIcp?:number;
  descripcionIcp?:string;
  sueldo?:number;
  manoHabil:string;
  status:string;
  fechaGacetaNacional:string;
  estadoCivilId:number;
  estatura:number;
  peso:number;
  identificacionId:number;
  numeroIdentificacion:number;
  numeroGacetaNacional:number;
  tiempoServicio?:ITiempoServicioResponseDto;
  searchText?:string;
}
