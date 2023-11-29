import { IFechaDto } from "../fecha-dto";

export interface IRhFamiliarUpdateDto{

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
  sexo :string;
  nivelEducativo:number;
  grado:number;


}
