export interface CreateRhMovNominaCommand {
    codigoTipoNomina: number | null;
    codigoPersona: number;
    codigoConcepto: number | null;
    complementoConcepto: string | null;
    codigoEmpresa: number;
    tipo: 'E' | 'F' | 'V' | string;
    frecuenciaId: number | null;
    monto: number;
    status: 'A' | null | string;
    usuarioIns: number;
    extra1?: string;
    extra2?: string;
    extra3?: string;
}