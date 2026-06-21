export interface IRhDocumentoUpdateDto {
  codigoDocumento: number
  codigoPersona: number
  tipoDocumentoId: number
  numeroDocumento: string
  fechaVencimiento: string | null
  tipoGradoId: number
  gradoId: number
  usuarioUpd: number
  extra1: string | null
  extra2: string | null
  extra3: string | null
}
