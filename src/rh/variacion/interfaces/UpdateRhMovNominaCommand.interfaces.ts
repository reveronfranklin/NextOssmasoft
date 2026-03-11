export interface UpdateRhMovNominaCommand {
    codigoMovNomina: number;
    codigoTipoNomina: number;
    codigoPersona: number;
    codigoConcepto: number | null;
    complementoConcepto: string | null;
    codigoEmpresa: number;
    tipo: 'E' | 'F' | 'V' | string;
    frecuenciaId: number | null;
    monto: number;
    status: 'A' | null | string;
    usuarioUpd: number;
    extra1?: string;
    extra2?: string;
    extra3?: string;
}