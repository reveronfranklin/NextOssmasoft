export interface UpdateRhMovNominaCommand {
    codigoMovNomina: number;
    codigoTipoNomina: number;
    codigoPersona: number;
    codigoConcepto: number;
    complementoConcepto: string;
    tipo: string;
    frecuenciaId: number;
    monto: number;
    status: string;
    usuarioUpd: number;
    extra1?: string;
    extra2?: string;
    extra3?: string;
}