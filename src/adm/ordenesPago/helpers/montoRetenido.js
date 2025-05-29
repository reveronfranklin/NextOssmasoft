const calcularMontoRetenido = async (impuesto, estatus) => {
  if (impuesto > 0) {
    const calculo = (impuesto * ((estatus / 100) + 1))
    const montoRetenido = parseFloat((calculo - impuesto).toFixed(2))

    return montoRetenido
  }

  return 0
}

export default calcularMontoRetenido