const FormatNumber = (number: number | null) : string | null => {
    if (number !== null && number !== undefined) {
        const fixedNumber = number.toFixed(2)
        const [integerPart, decimalPart] = fixedNumber.split('.')

        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

        return `${formattedIntegerPart},${decimalPart}`
    }

    return null
}

export default FormatNumber