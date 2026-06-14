export interface IRhDocumentoCreateDto {
  codigoPersona: number
  tipoDocumentoId: number
  numeroDocumento: string
  fechaVencimiento: string | null
  tipoGradoId: number | null
  gradoId: number | null
  usuarioIns: number
  extra1: string | null
  extra2: string | null
  extra3: string | null
}
