import { IFechaDto } from "src/interfaces/fecha-dto";

export interface IBmConteoDetalleResponseDto {



	  codigoBmConteoDetalle :number;
		codigoBmConteo :number;
		conteo :number;
		codigoIcp:number;
		unidadTrabajo:string;
    comentario :string;
		codigoPlaca :string;
    cantidad:number;
		cantidadContada :number;
		diferencia :number;

		codigoGrupo :string;
		codigoNivel1:string;
		codigoNivel2 :string;
		numeroLote :string;
		numeroPlaca :string;
		valorActual :number;
		articulo:string;
		especificacion:string;
		servicio :string;
		responsableBien :string;
		fechaMovimiento:Date;
		fechaMovimientoString:string;
		fechaMovimientoObj :IFechaDto;
		codigoBien :number;
		codigoMovBien :number;
		fecha :Date;
		fechaString:string;
		fechaObj :IFechaDto;



}
