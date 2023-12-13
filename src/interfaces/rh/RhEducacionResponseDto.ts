import { IFechaDto } from "../fecha-dto";

export interface IRhEducacionResponseDto{
  codigoEducacion :number;
  codigoPersona :number;
  nivelId:number;
  descripcionNivel:string
  nombreInstituto :string;
  localidadInstituto :string;
  profesionID:number;
  fechaIni :Date;
  fechaIniString :string;
  fechaFin :Date;
  fechaFinString :string;
  fechaIniObj:IFechaDto;
  fechaFinObj:IFechaDto;
  ultimoAñoAprobado:number
  graduado :string;
  tituloId :number;
  mencionEspecialidadId:number;
}
