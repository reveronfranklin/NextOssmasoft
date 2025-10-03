const calcularMontoRetenido = async (impuesto, estatus) => {
  if (impuesto > 0) {
    const calculo = (impuesto * ((estatus / 100) + 1))
    let montoRetenido = calculo - impuesto;

    montoRetenido = Math.round(montoRetenido * 100) / 100

    return montoRetenido
  }

  return 0
};

export default calcularMontoRetenido