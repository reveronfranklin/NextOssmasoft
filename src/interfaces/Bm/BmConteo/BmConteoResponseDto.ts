import { IFechaDto } from "src/interfaces/fecha-dto";
import { BmConteoDetalleResumenResponseDto } from "./BmConteoDetalleResumenResponseDto";

export interface IBmConteoResponseDto {
	  codigoBmConteo :number;
		titulo :string;
    comentario:string;
		codigoPersonaResponsable:number;
		nombrePersonaResponsable :string;
		conteoId:number;
		fecha :Date;
		fechaString :string;
		fechaObj:IFechaDto;
		resumenConteo: BmConteoDetalleResumenResponseDto[]
    fechaView:string;
    totalCantidad:number;
    totalCantidadContado:number;
    totalDiferencia:number;

}
