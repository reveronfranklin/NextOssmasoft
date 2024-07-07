import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { Skeleton } from "@mui/material";
import useServices from '../../services/useServices'

const ListProducts = (props: any) => {
    const { getListProducts } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['getListProducts'],
        queryFn: () => getListProducts(),
        initialData: () => {
            return qc.getQueryData(['getListProducts'])
        },
        staleTime: 5000 * 60 * 60,
    }, qc)

    const listProducts = query.data?.data ?? []

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
                        options={listProducts}
                        id='autocomplete-ListProducts'
                        onChange={handleChange}
                        getOptionLabel={(option : any) => option.codigo + '-' + option.descripcion}
                        renderInput={(params) => <TextField {...params} label="Productos" />}
                    />
                )
            }
        </>
    )
}

export default ListProducts