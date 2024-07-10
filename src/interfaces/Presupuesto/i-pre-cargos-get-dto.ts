export interface IPreCargosGetDto{
    codigoCargo:number;
    tipoPersonalId :number;
    descripcionTipoPersonal:string;
    tipoCargoId:number;
    descripcionTipoCargo:string;
    denominacion:string;
    descripcion:string;
    grado :number;
    extra1 :string;
    extra2 :string;
    extra3  :string;
    codigoPresupuesto:number;
    page?:number;
    searchText?:string;

}
