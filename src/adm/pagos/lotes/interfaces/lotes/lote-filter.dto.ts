export interface LoteFilterDto {
    PageSize:          number;
    PageNumber:        number;
    SearchText:        string;
    CodigoPresupuesto: number;
    FechaInicio:       string;
    FechaFin:          string;
    CodigEmpresa:      number;
}