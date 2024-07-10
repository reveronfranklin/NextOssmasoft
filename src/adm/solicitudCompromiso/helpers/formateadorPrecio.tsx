const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        useGrouping: true,
        minimumFractionDigits: 2
    }).format(price)
}

export default formatPrice