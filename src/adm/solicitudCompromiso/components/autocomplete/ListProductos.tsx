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
        staleTime: 1000 * 60,
    }, qc)

    const listProducts = query.data?.data ?? []
    const tipo = listProducts.filter((item: { codigo: number }) => item?.codigo === props?.id)[0]

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue.codigo)
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
                        defaultValue={tipo}
                        id='autocomplete-ListProducts'
                        getOptionLabel={(option : any) => option.codigo + '-' + option.descripcion}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Productos" />}
                    />
                )
            }
        </>
    )
}

export default ListProducts