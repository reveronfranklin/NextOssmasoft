import { Autocomplete, TextField } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'

import useServices from '../../services/useServices'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from "@mui/material";

const UnidadSolicitante = (props: any) => {
    const { unidadEjecutora } = useServices()
    const { preMtrUnidadEjecutora } = useSelector((state: RootState) => state.presupuesto)

    const query = useQuery({
        queryKey: ['descriptivas'],
        queryFn: () => unidadEjecutora(),
        retry: 3,
    })

    const icp: IListPreMtrUnidadEjecutora = preMtrUnidadEjecutora?.filter(elemento => elemento?.codigoIcp === props.id)[0]

    const handlerUnidadEjecutora = (event: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange()
        }
    }

    return (
        <>
            {
                query.isLoading ? (
                    <Skeleton
                        width={423}
                        height={70}
                        style={{
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            padding: 0,
                        }}
                    />
                ) : (
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
        </>
    )
}

export default UnidadSolicitante