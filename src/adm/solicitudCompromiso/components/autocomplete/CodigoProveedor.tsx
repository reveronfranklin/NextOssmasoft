import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store"

const CodigoProveedor = (props: any) => {
    const listProveedores = useSelector((state: RootState) => state.admSolicitudCompromiso.listProveedores)

    const [isLoading] = useState(false)
    const [listProveedor] = useState<any[]>(listProveedores)
    const [proveedor] = useState<any>(listProveedores.filter(item => item.codigoProveedor === props.id)[0])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue.codigoProveedor)
        }
    }

    return (
        <Autocomplete
            loading={isLoading}
            options={listProveedor}
            defaultValue={proveedor}
            id='autocomplete-CodigoProveedor'
            getOptionLabel={(option) => option.codigoProveedor + '-' + option.nombreProveedor}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label="Código de Proveedor" />}
        />
    )
}

export default CodigoProveedor