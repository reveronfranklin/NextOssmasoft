import { useSelector } from "react-redux"
import { RootState } from "src/store"

const CalculoDisponiblePuc = (): number => {
    const { totalMasImpuesto } = useSelector((state: RootState) => state.admSolicitudCompromiso.solicitudCompromisoSeleccionadoDetalle)
    const total1ListPuc = useSelector((state: RootState) => state.admSolicitudCompromiso.total1ListPuc)

    const resto = totalMasImpuesto - total1ListPuc

    return resto
}

export default CalculoDisponiblePuc