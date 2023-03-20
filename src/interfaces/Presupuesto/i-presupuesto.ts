import { IPreDenominacionPuc ,IPreDenominacionPucResumen} from "./i-pre-denominacion-puc";

export interface IPresupuesto{
    codigoPresupuesto:string;
    denominacion:string
    descripcion:string;
    ano:number;
    montoPresupuesto:number;
    fechaDesde:Date;
    fechaHasta:Date;
    preDenominacionPuc:IPreDenominacionPuc[];
    preDenominacionPucResumen:IPreDenominacionPucResumen[];
    totalPresupuesto:number;
    totalDisponible:number;
    totalPresupuestoString:string;
    totalDisponibleString:string;
}


