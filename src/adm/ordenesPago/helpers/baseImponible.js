/**
 * Calcula la base imponible a partir del monto del documento y el porcentaje de IVA.
 * @param {number} montoDocumento - El monto del documento.
 * @param {number} porcentajeIva - El porcentaje de IVA.
 * @returns {number} - La base imponible.
 */

const calcularBaseImponible = async (montoDocumento, porcentajeIva, montoImpuestoExento) => {
  return new Promise((resolve) => {
    if (montoDocumento > 0) {
      const baseImponible = parseFloat(((montoDocumento - montoImpuestoExento) * ((porcentajeIva / 100) + 1)).toFixed(2))
      resolve(baseImponible)
    } else {
      resolve(0)
    }
  })
}

export default calcularBaseImponible