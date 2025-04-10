export interface AutoCompleteProps {
    id: number | null
    onSelectionChange: (value: any) => void
    error?: string
    label?: string
    required?: boolean
    autoFocus?: boolean
}