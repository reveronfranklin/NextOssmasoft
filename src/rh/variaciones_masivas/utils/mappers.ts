import { ApiResponse, FixedParams, FieldOptionMap, AutocompleteOption } from '../interfaces';

export const mapFieldConfigs = (response: ApiResponse<FixedParams>): FieldOptionMap => {
    if (!response.isValid || !response.data || response.data.length === 0) {

        return {}
    }

    const fieldMap: FieldOptionMap = {}

    const items = response.data[0].items

    items.forEach((item) => {
        const validValues = item.values.filter((element) => element.code.trim() !== "" || element.description.trim() !== "")

        if (validValues.length > 0) {
            fieldMap[item.field] = validValues.map((element): AutocompleteOption => ({
                value: element.code,
                label: element.description
            }))
        }
    })

    return fieldMap
}