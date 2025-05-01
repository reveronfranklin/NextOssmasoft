export interface LoteFilterDto {
    pageSize:          number;
    pageNumber:        number;
    searchText:        string;
    codigoPresupuesto: number;
    fechaInicio:       string;
    fechaFin:          string;
}