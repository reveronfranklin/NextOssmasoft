import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store"

interface ITipoSolicitud {
    id: number
    descripcion: string
}

const TipoSolicitud = (props: any) => {
    const list = useSelector((state: RootState) => state.admSolicitudCompromiso.listTipoDeSolicitud)

    const [isLoading] = useState(false)
    const [listTipo]  = useState<ITipoSolicitud[]>(list)
    const [tipo]      = useState<ITipoSolicitud>(list.filter(elemento => elemento.id == props.id)[0])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue.id)
        }
    }

    return (
        <Autocomplete
            loading={isLoading}
            options={listTipo}
            defaultValue={tipo}
            id='autocomplete-TipoSolicitud'
            getOptionLabel={(option) => option.id + '-' + option.descripcion}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label="Tipo de Solicitud" />}
        />
    )
}

export default TipoSolicitud