import { IFechaDto } from 'src/interfaces/fecha-dto'

export interface RhReporteNominaResumenResponseDto {
  id: number
  codigoTipoNomina: number
  codigoPeriodo: number
  periodo: number
  fechaNomina: Date
  fechaNominaString: string
  fechaNominaObj: IFechaDto | null
  codigoIcpConcat: string
  codigoIcp: number
  denominacion: string
  codigoPersona: number
  nombre: string
  descripcionPeriodo: string
}

export interface RhListOficinaDto {
  codigoIcpConcat: string
  codigoIcp: number
  denominacion: string
}
