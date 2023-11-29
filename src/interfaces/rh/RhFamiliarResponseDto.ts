import { IFechaDto } from "../fecha-dto";

export interface IRhFamiliarResponseDto{

  codigoPersona :number;
  codigoFamiliar :number;
  cedulaFamiliar:number;
  nacionalidad :string;
  nombre :string;
  apellido :string;
  fechaNacimiento:Date;
  edad :string;
 fechaNacimientoObj:IFechaDto;
  fechaNacimientoString:string;
  parienteId:number;
  parienteDescripcion:string;
  sexo :string;
  nivelEducativo:number;
  grado:number;


}
