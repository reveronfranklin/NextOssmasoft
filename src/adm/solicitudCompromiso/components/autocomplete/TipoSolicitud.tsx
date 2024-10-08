import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { Skeleton } from "@mui/material";
import useServices from '../../services/useServices'

interface ITipoSolicitud {
    id: number
    descripcion: string
}

const TipoSolicitud = (props: any) => {
    const { fetchSolicitudCompromiso } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['tipoSolicitud'],
        queryFn: () => fetchSolicitudCompromiso(),
        retry: 3,
        staleTime: 5000 * 60 * 60,
    }, qc)

    const listTipo: ITipoSolicitud [] = query.data?.data ?? []
    const tipo = listTipo.filter((item: { id: number }) => item?.id == props.id)[0]

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue.id)
        }
    }

    return (
        <>
            {
                query.isLoading ? (
                    <Skeleton
                        width={300}
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
                        options={listTipo}
                        defaultValue={tipo}
                        id='autocomplete-TipoSolicitud'
                        getOptionLabel={(option) => option.id + '-' + option.descripcion}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Tipo de Solicitud" />}
                    />
                )
            }
        </>
    )
}

export default TipoSolicitud