import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store"

interface ITipoSolicitud {
    id: number
    descripcion: string
}

const TipoSolicitud = (props: any) => {
    const listTipoSolicitud = useSelector((state: RootState) => state.admSolicitudCompromiso.listTipoDeSolicitud)

    const [isLoading] = useState(false)
    const [listTipo] = useState<ITipoSolicitud[]>(listTipoSolicitud)
    const [tipo] = useState<ITipoSolicitud>(listTipoSolicitud.filter(item => item.id == props.id)[0])

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