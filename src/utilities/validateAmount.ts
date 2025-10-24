const validateAmount = (amount: any): number => {
    return (amount !== undefined && amount !== null && !isNaN(amount)) ? amount : 0
}

export default validateAmount