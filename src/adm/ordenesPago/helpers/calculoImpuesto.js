/**
 * Calcula el monto de impuesto a partir de la base imponible y el porcentaje de IVA.
 * @param {number} base - La base imponible.
 * @param {number} porcentajeIva - El porcentaje de IVA.
 * @returns {Promise<number>} - El monto de impuesto.
 */
const calculoImpuesto = async (base, porcentajeIva) => {
  return new Promise((resolve, reject) => {
    if (base > 0) {
      const montoImpuesto = Math.round((base * (porcentajeIva / 100)) * 100) / 100;
      resolve(montoImpuesto);
    } else {
      resolve(0);
    }
  });
};

export default calculoImpuesto;