export interface CreateRhMovNominaCommand {
    codigoTipoNomina: number;
    codigoPersona: number;
    codigoConcepto: number;
    complementoConcepto: string;
    tipo: 'E' | 'F' | 'V' | string;
    frecuenciaId: number;
    monto: number;
    status: 'A' | null | string;
    usuarioIns: number;
}