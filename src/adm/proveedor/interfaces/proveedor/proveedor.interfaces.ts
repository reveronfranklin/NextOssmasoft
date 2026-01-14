export interface IProveedor {
  codigoProveedor: number
  nombreProveedor: string
  tipoProveedorId: number
  nacionalidad: string | null
  cedula: number | null
  rif: string | null
  fechaRif: Date | null
  fechaNit: Date | null
  fechaRegistroContraloria: Date | null
  fechaRegistroContraloriaString?: string | null
  fechaRegistroContraloriaObj?: Date | null
  nit: string | null
  numeroRegistroContraloria: string | null
  capitalPagado: number
  capitalSuscrito: number
  status: string
  estatusFisicoId: number
  numeroCuenta: string | null
  activo: boolean
}
