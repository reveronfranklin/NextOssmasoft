export interface IPreRelacionCargosGetDto {
  codigoRelacionCargo: number
  ano: number
  escenario: number
  codigoIcp: number
  denominacionIcp: string
  codigoCargo: number
  denominacionCargo: string
  descripcionTipoCargo: string
  descripcionTipoPersonal: string
  cantidad: number
  sueldo: number
  compensacion: number
  prima: number
  otro: number
  extra1?: string
  extra2?: string
  extra3?: string
  codigoPresupuesto: number
  totalMensual: string
  totalAnual: string
  icpConcat:string
  searchText:string
}
