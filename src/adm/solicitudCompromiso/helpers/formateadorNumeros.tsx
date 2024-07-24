const formatNumber = (number: number) => {
    if (number) {
        const strNumber = number.toString()
        const [integerPart, decimalPart] = strNumber.split('.');
        const formattedIntegerPart = integerPart.replace(/(\d)(?=(\d{3})+$)/g, '$1.');
        const formattedDecimalPart = decimalPart ? `.${decimalPart}` : '';

        return `${formattedIntegerPart}${formattedDecimalPart}`;
    }
}

export default formatNumber