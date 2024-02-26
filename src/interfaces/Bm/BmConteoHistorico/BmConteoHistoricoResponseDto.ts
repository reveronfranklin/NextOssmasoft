import { IFechaDto } from "src/interfaces/fecha-dto";

export interface IBmConteoHistoricoResponseDto {
	  codigoBmConteo :number;
		titulo :string;
    comentario:string;
		codigoPersonaResponsable:number;
		nombrePersonaResponsable :string;
		conteoId:number;
		fecha :Date;
		fechaString :string;
		fechaObj:IFechaDto;
    fechaView:string;
    totalCantidad:number;
    totalCantidadContada:number;
    totalDiferencia:number;

}
