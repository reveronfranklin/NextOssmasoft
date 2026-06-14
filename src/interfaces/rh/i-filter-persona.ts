export interface IPersonaFilterDto{
  codigoPersona:number;
  desde?:Date;
  hasta?:Date;
  codigoTipoNomina?: { codigoTipoNomina: number }[];
  sinRestriccionFecha?: boolean;
}
