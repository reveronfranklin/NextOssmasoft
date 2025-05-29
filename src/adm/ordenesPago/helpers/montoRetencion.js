//El calculo del monto retenido se realiza de la siguiente manera:
//se toma el total Base de Documentos y se multiplica por el porcentaje de retencion
//en caso de haber seleccionado un tipo de retencion, se toma el porcentaje de retencion
// y se multiplica por el total Base de Documentos, si no se selecciona un tipo de retencion
// se toma el porcentaje de retencion por el usuario y se multiplica por el total Base de Documentos

const calcularMontoRetencion = (base, porcentaje) => base > 0 && porcentaje > 0 ? Math.round((base * porcentaje / 100) * 100) / 100 : 0

export default calcularMontoRetencion