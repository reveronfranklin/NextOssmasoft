const calculatePrice = (precioUnitario: number, cantidad: number, impuesto?: number): number => {
    let total = precioUnitario * cantidad

    if (impuesto && impuesto > 0) {
        const totalImpuesto = total * (impuesto / 100)
        total += totalImpuesto
    }

    return total
}

export default calculatePrice