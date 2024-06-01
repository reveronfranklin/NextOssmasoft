import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'

const UnidadSolicitante = (props: any) => {

    console.log(props.id)
    const { preMtrUnidadEjecutora } = useSelector((state: RootState) => state.presupuesto)
    const { preSolModificacionSeleccionado } = useSelector((state: RootState) => state.preSolModificacion)

    const getIcp = (id: number) => {
        const result = preMtrUnidadEjecutora?.filter(elemento => {
            return elemento.codigoIcp == id
        })

        return result[0]
    }

    const [icp, setIcp] = useState<IListPreMtrUnidadEjecutora>(getIcp(preSolModificacionSeleccionado.codigoSolicitante))

    const handlerUnidadEjecutora = (event: any, newValue: any) => {
        if (newValue) {
            setIcp(newValue)
        }
    }

    return (
        <Autocomplete
            options={preMtrUnidadEjecutora}
            value={icp}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            id='autocomplete-concepto'
            getOptionLabel={option => option.dercripcion + '-' + option.id}
            onChange={handlerUnidadEjecutora}
            renderInput={params => <TextField {...params} label='Unidad Solicitante' />}
        />
    )
}

export default UnidadSolicitante