export interface IRhDocumentoResponseDto {
  codigoPersona: number
  codigoDocumento: number
  tipoDocumentoId: number
  tipodocumentoId?: number
  tipoDocumento: string
  descripcionDocumento?: string
  numeroDocumento: string
  fechaVencimiento: string | null
  fechaVencimientoString?: string | null
  tipoGradoId: number | null
  tipoGradoid?: number | null
  tipoGrado: string
  descripcionTipoGrado?: string
  gradoId: number | null
  gradoid?: number | null
  grado: string
  descripcionGrado?: string
  extra1: string | null
  extra2: string | null
  extra3: string | null
  usuarioIns: number
  fechaIns: string | null
  usuarioUpd: number | null
  fechaUpd: string | null
  codigoEmpresa: number
  persona: string
}
