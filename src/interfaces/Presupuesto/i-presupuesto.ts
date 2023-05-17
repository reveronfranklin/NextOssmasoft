import { IPreDenominacionPuc ,IPreDenominacionPucResumen} from "./i-pre-denominacion-puc";
import { IFechaDto } from '../fecha-dto';

export interface IPresupuesto{
    codigoPresupuesto:string;
    denominacion:string
    descripcion:string;
    ano:number;
    montoPresupuesto:number;
    fechaDesde:string;
    fechaHasta:string;
    fechaAprobacion :string;
    numeroOrdenanza :string;
    fechaOrdenanza :string;
    extra1 :string;
    extra2 :string;
    extra3 :string;
    fechaDesdeObj:IFechaDto;
    fechaHastaObj :IFechaDto;
    fechaAprobacionObj :IFechaDto;
    fechaOrdenanzaObj :IFechaDto;

    preDenominacionPuc:IPreDenominacionPuc[];
    preDenominacionPucResumen:IPreDenominacionPucResumen[];
    totalPresupuesto:number;
    totalDisponible:number;
    totalPresupuestoString:string;
    totalDisponibleString:string;
}


