export interface IProveedor {
  codigoProveedor:                number;
  nombreProveedor:                string;
  tipoProveedorId:                number;
  nacionalidad:                   null;
  cedula:                         number;
  rif:                            string;
  fechaRif:                       Date;
  nit:                            null;
  fechaNit:                       null;
  numeroRegistroContraloria:      null;
  fechaRegistroContraloria:       null;
  fechaRegistroContraloriaString: string;
  fechaRegistroContraloriaObj:    null;
  capitalPagado:                  number;
  capitalSuscrito:                number;
  status:                         string;
  estatusFisicoId:                number;
  numeroCuenta:                   string;
}
