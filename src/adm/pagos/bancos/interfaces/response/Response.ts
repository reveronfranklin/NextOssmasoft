export interface IResponse<T> {
    data: T[]
    isValid: boolean
    linkData: null
    linkDataAlternative: null
    message: string
    page: number
    totalPage: number
    cantidadRegistros: number
    total1: number
    total2: number
    total3: number
    total4: number
}
