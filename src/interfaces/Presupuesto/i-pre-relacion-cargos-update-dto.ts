export interface IPreRelacionCargosUpdateDto {
  codigoRelacionCargo: number
  ano: number
  escenario: number
  codigoIcp: number
  denominacionIcp: string
  codigoCargo: number
  cantidad: number
  sueldo: number
  compensacion: number
  prima: number
  otro: number

  codigoPresupuesto: number
}
