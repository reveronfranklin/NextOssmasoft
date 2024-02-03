import { ThemeColor } from "src/@core/layouts/types";
import { ITiempoServicioResponseDto } from "./TiempoServicioResponseDto";
import { IFechaDto } from "../fecha-dto";

export interface IPersonaDto{


  codigoPersona :number;
  cedula:number;
  nombre :string;
  apellido :string;
  nombreCompleto :string;
  nacionalidad:string;
  sexo:string;
  edad:number;
  fechaNacimiento?:Date;
  fechaNacimientoString?:string;
  fechaNacimientoObj?:IFechaDto;
  paisNacimientoId :number;
  estadoNacimientoId:number;
  numeroGacetaNacional:string;
  estadoCivilId:number;
  descripcionEstadoCivil:string;
  estatura :number;
  peso :number;
  manoHabil:string;
  extra1:string
  extra2:string
  extra3:string
  status:string;
  identificacionId :number;
  numeroIdentificacion:number;
  descripcionStatus :string;
  codigoCargo:number;
  descripcionCargo:string;
  codigoIcp:number;
  descripcionIcp:string;
  avatar:string;
  avatarColor?: ThemeColor;
  tiempoServicio?:ITiempoServicioResponseDto;
  sueldo:number;
  fechaGacetaNacional:string;
  fechaGacetaNacionalObj?:IFechaDto;

}
