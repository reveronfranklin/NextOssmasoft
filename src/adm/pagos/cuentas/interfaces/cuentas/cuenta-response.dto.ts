export interface CuentaResponseDto {
    codigoCuentaBanco: number,
    codigoBanco: number,
    descripcionBanco: string,
    tipoCuentaId: number,
    descripcionTipoCuenta: string,
    noCuenta: string,
    formatoMascara: string | null,
    denominacionFuncionalId: number,
    descripcionDenominacionFuncional: string,
    codigo: string | null,
    principal: boolean,
    recaudadora: boolean,
    codigoMayor: number,
    codigoAuxiliar: number,
    searchText: string
}