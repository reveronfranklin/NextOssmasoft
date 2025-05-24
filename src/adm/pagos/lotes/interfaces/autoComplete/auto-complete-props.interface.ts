import { AdmBeneficiariosPendientesPago } from '../ordenPago/orden-pago-response.dto'

export interface AutoCompleteProps {
    id: number | null
    onSelectionChange: (value: any) => void
    error?: string
    label?: string
    required?: boolean
    autoFocus?: boolean
    options?: AdmBeneficiariosPendientesPago[];
}