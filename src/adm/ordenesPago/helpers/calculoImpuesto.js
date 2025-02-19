/**
 * Calcula la base imponible a partir del monto del documento y el porcentaje de IVA.
 * @param {number} montoDocumento - El monto del documento.
 * @param {number} porcentajeIva - El porcentaje de IVA.
 * @returns {number} - La base imponible.
 */
function calculoImpuesto(base, porcentajeIva) {
  if (base > 0 || null || '') {
    const montoImpuesto = Math.round((base * (porcentajeIva / 100)) * 100) / 100

    return montoImpuesto
  }

  return 0
}

export default calculoImpuesto