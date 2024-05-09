import { IFechaDto } from 'src/interfaces/fecha-dto'

export interface IPreSolModificacionUpdateDto {
  codigoSolModificacion: number
  tipoModificacionId: number
  fechaSolicitud: Date | null
  fechaSolicitudString: string
  fechaSolicitudObj: IFechaDto | null
  numeroSolModificacion: string
  codigoSolicitante: number
  motivo: string
  numeroCorrelativo: number
  codigoPresupuesto: number
}
