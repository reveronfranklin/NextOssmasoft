import { IFechaDto } from '../fecha-dto'

export interface IRhVTitularBeneficiariosResponseDto {
  id: number
  cedulaTitular: string
  cedulaBeneficiario: string
  nombreTituBene: string
  apellidosTituBene: string
  fechaNacimientoFamiliar: Date
  fechaNacimientoFamiliarString: string
  fechaNacimientoFamiliarObj: IFechaDto
  sexo: string
  estadoCivil: string
  cdLocalidad: string
  cdGrupo: string
  cdBanco: string
  nuCuenta: string
  tpCuenta: string
  deEmail: string
  nroArea: string
  nroTelefono: string
  fechaEgreso: Date
  codigoIcp: number
  edad: string
  tiempoServicio: string
  parentesco: string
  tipoNomina: string
  fechaIngreso: Date
  fechaIngresoString: string
  fechaIngresoObj: IFechaDto
  unidadDescripcion: string
  cargoNominal: string
  antiguedadCmc: string
  antiguedadOtros: string
  searchText: string
}

export interface IRhVTitularBeneficiariosExcelResponseDto {
  id: number
  cedulaTitular: string
  cedulaBeneficiario: string
  nombreTituBene: string
  apellidosTituBene: string
  fechaNacimientoFamiliarString: string
  sexo: string
  estadoCivil: string
  cdLocalidad: string
  cdGrupo: string
  cdBanco: string
  nuCuenta: string
  tpCuenta: string
  deEmail: string
  nroArea: string
  nroTelefono: string
  fechaEgreso: Date
  codigoIcp: number
  edad: string
  tiempoServicio: string
  parentesco: string
  tipoNomina: string
  fechaIngresoString: string
  unidadDescripcion: string
  cargoNominal: string
  antiguedadCmc: string
  antiguedadOtros: string
}
