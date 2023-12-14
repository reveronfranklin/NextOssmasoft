export interface IRhPersonaUpdateDto{
  codigoPersona :number;
  cedula :number;
  nombre:string;
  apellido:string;
  nacionalidad:string;
  sexo:string;
  edad:number;
  fechaNacimiento:string;
  paisNacimientoId:number;
  estadoNacimientoId:number;
  numeroGacetaNacional:string;
  fechaGacetaNacional:string;
  estadoCivilId:number;
  estatura:number;
  peso:number;
  manoHabil :string;
  status :string;
  identificacionId :number;
  numeroIdentificacion :number;
  data?:string;
  nombreArchivo?:string;

}
