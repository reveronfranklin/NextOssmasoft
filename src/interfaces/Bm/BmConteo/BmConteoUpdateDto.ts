import { IFechaDto } from "src/interfaces/fecha-dto";
import { ICPGetDto } from "./ICPGetDto";

export interface IBmConteoUpdateDto {
	codigoBmConteo :number;
		titulo :string;
    comentario:string;
		codigoPersonaResponsable:number;
		conteoId:number;
		fecha :Date | null;
		fechaString :string;
		fechaObj:IFechaDto | null;
    listIcpSeleccionado:ICPGetDto[]

}
