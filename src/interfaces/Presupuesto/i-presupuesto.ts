import { IPreDenominacionPuc ,IPreDenominacionPucResumen} from "./i-pre-denominacion-puc";
import { IFechaDto } from '../fecha-dto';
import { IPreFinanciadoDto } from "./i-list-pre-financiado-dto";

export interface IPresupuesto{
    codigoPresupuesto:number;
    denominacion:string
    descripcion:string;
    ano:number;
    montoPresupuesto:number;
    fechaDesde:Date;
    fechaDesdeString:string;
    fechaDesdeObj:IFechaDto;

    fechaHasta:Date;
    fechaHastaString:string;
    fechaHastaObj :IFechaDto;

    fechaOrdenanza :Date;
    fechaOrdenanzaString :string;
    fechaOrdenanzaObj :IFechaDto;

    fechaAprobacion :Date;
    fechaAprobacionString :string;
    fechaAprobacionObj :IFechaDto;

    numeroOrdenanza :string;
    extra1 :string;
    extra2 :string;
    extra3 :string;
    preDenominacionPuc:IPreDenominacionPuc[];
    preDenominacionPucResumen:IPreDenominacionPucResumen[];
    preFinanciadoDto:IPreFinanciadoDto[];
    totalPresupuesto:number;
    totalDisponible:number;
    totalPresupuestoString:string;
    totalDisponibleString:string;
    totalModificacionString:string
    totalVigenteString:string
}


