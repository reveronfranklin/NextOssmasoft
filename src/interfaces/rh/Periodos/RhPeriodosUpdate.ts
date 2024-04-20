import { IFechaDto } from 'src/interfaces/fecha-dto'

export interface IRhPeriodosUpdate {
  codigoPeriodo: number
  descripcion: string
  codigoTipoNomina: number
  fechaNomina: Date
  fechaNominaString: string
  fechaNominaObj: IFechaDto | null
  periodo: number
  tipoNomina: string
}
