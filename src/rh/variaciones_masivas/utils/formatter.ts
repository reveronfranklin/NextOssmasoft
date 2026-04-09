export const formatRuleToString = (field: string, operator: string, value: string) => {
    const formattedValue = isNaN(Number(value)) ? `'${value}'` : value

    return `${field} ${operator} ${formattedValue}`
}