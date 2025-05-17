export interface PagoFilterDto {
    pageSize:          number;
    pageNumber:        number;
    searchText:        string;
    CodigoLote:        number | null;
}