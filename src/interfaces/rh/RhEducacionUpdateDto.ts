export interface IRhEducacionUpdateDto{
  codigoEducacion :number;
  codigoPersona :number;
  nivelId:number;
  nombreInstituto :string;
  localidadInstituto :string;
  profesionID:number;
  fechaIni :Date;
  fechaIniString :string;
  fechaFin :Date;
  fechaFinString :string;
  ultimoAñoAprobado:number
  graduado :string;
  tituloId :number;
  mencionEspecialidadId:number;
}
