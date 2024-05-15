import { IFechaDto } from 'src/interfaces/fecha-dto'

export interface IPreSolModificacionResponseDto {
  codigoSolModificacion: number
  tipoModificacionId: number
  descripcionTipoModificacion: string
  fechaSolicitud: Date | null
  fechaSolicitudString: string
  fechaSolicitudObj: IFechaDto | null
  ano: number
  numeroSolModificacion: string
  codigoOficio: string
  codigoSolicitante: number
  motivo: string
  status: string
  descripcionEstatus: string
  numeroCorrelativo: number
  codigoPresupuesto: number
  searchText: string
  statusProceso: string
  aportar: boolean
  descontar: boolean
  OrigenPreSaldo: boolean
  totalAportar: number
  totalDescontar: number
}
