import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { Skeleton } from "@mui/material";
import useServices from '../../services/useServices'

interface ITipoUnidades {
    id: number
    descripcion: string
}

const tipoUnidad = (props: any) => {
    const { fetchTipoUnidades } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['tipoUnidades'],
        queryFn: () => fetchTipoUnidades(),
        retry: 3,
    }, qc)

    const listTipo: ITipoUnidades[] = query.data?.data ?? []
    const tipo = listTipo.filter((item: { id: number }) => item?.id == props?.id)[0]

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
                        id='autocomplete-TipoUnidad'
                        getOptionLabel={(option) => option.id + '-' + option.descripcion}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Unidad" />}
                    />
                )
            }
        </>
    )
}

export default tipoUnidad