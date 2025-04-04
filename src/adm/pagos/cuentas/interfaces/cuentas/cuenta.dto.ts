export interface CuentaDto {
    codigoCuentaBanco: number,
    codigoBanco: number,
    tipoCuentaId: number,
    noCuenta: string,
    formatoMascara: string | null,
    denominacionFuncionalId: number,
    codigo: string,
    principal: boolean,
    recaudadora: boolean,
    codigoMayor: number,
    codigoAuxiliar: number
}