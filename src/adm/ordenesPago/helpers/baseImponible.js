/**
 * Calcula la base imponible a partir del monto del documento y el porcentaje de IVA.
 * @param {number} montoDocumento - El monto del documento.
 * @param {number} porcentajeIva - El porcentaje de IVA.
 * @returns {number} - La base imponible.
 */
function calcularBaseImponible(montoDocumento, porcentajeIva) {
  if (montoDocumento > 0 || null || '') {
    const baseImponible = Math.round((montoDocumento / (1 + (porcentajeIva / 100))) * 100) / 100;

    return baseImponible;
  }

  return 0
}

export default calcularBaseImponible