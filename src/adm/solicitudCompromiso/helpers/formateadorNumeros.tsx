const formatNumber = (number: number) => {
    // Convertir el número a string
    const strNumber = number.toString();

    // Dividir la parte entera de la parte decimal
    const [integerPart, decimalPart] = strNumber.split('.');

    // Formatear la parte entera con separadores de miles y millones
    const formattedIntegerPart = integerPart.replace(/(\d)(?=(\d{3})+$)/g, '$1,');

    // Formatear la parte decimal (opcional, solo si hay decimales)
    const formattedDecimalPart = decimalPart ? `.${decimalPart}` : '';

    // Combinar las partes formateadas y devolver el resultado
    return `${formattedIntegerPart}${formattedDecimalPart}`;
}

export default formatNumber