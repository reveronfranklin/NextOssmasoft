import { IFechaDto } from "../fecha-dto";

export interface IRhAdministrativosResponseDto{

        codigoAdministrativo :number;
        codigoPersona :number;
        fechaIngreso:string;
        fechaIngresoObj?:IFechaDto;
        tipoPago :string;
        descripcionTipoPago:string;
        bancoId :number;
        descripcionBanco :string;
        tipoCuentaId :number;
        descripcionCuenta:string;
        noCuenta:string;

}
