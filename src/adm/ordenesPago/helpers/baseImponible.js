/**
 * Calcula la base imponible a partir del monto del documento y el porcentaje de IVA.
 * @param {number} montoDocumento - El monto del documento.
 * @param {number} porcentajeIva - El porcentaje de IVA.
 * @returns {number} - La base imponible.
 */

const calcularBaseImponible = async (montoDocumento, porcentajeIva) => {
  return new Promise((resolve, reject) => {
    if (montoDocumento > 0) {
      const baseImponible = Math.round((montoDocumento / (1 + (porcentajeIva / 100))) * 100) / 100
      resolve(baseImponible)
    } else {
      resolve(0)
    }
  })
}

export default calcularBaseImponible