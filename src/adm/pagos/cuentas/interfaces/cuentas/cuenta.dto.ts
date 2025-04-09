export interface CuentaDto {
    codigoCuentaBanco: number,
    codigoBanco: number | null,
    tipoCuentaId: number | null,
    noCuenta: string | null,
    formatoMascara: string | null,
    denominacionFuncionalId: number | null,
    codigo: string | null,
    principal: boolean,
    recaudadora: boolean,
    codigoMayor: number | null,
    codigoAuxiliar: number | null
}