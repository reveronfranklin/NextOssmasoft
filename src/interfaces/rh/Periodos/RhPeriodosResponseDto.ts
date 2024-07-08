import { IFechaDto } from "src/interfaces/fecha-dto";

export interface IRhPeriodosResponseDto{
        codigoPeriodo:number;
        codigoTipoNomina:number;
        fechaNomina:Date;
        fechaNominaString:string;
        fechaNominaObj :IFechaDto | null;
        periodo :number;
        descripcionPeriodo:string;
        tipoNomina :string;
        descripcionTipoNomina:string;
        usuarioPreCierre:number
        fechaPreCierre :Date;
        fechaPreCierreString: string;
        fechaPreCierreObj :IFechaDto | null;
        usuarioCierre:number;
        fechaCierre :Date
        fechaCierreString :string;
        fechaCierreObj :IFechaDto | null;
        codigoCuentaEmpresa:string;
        usuarioPreNomina:number;
        fechaPrenomina :Date;
        fechaPrenominaString :string;
        fechaPrenominaObj :IFechaDto | null;
        codigoPresupuesto:number;
        descripcion :string;
        searchText:string;
        year:number;
        fileName:string;
}
