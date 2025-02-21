const calcularMontoRetenido = async (impuesto, estatus) => {
  if (impuesto > 0) {
    const montoRetenido = Math.round((impuesto * (estatus / 100)) * 100) / 100

    return montoRetenido
  }

  return 0
}

export default calcularMontoRetenido