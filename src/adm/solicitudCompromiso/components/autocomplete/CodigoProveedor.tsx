import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import useServices from '../../services/useServices'
import { Skeleton } from "@mui/material";

const CodigoProveedor = (props: any) => {
    const { fetchProveedores } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['proveedores'],
        queryFn: () => fetchProveedores(),
        initialData: () => {
            return qc.getQueryData(['proveedores'])
        },
        staleTime: 5000 * 60 * 60,
    }, qc)

    const listProveedor = query.data?.data ?? []
    const proveedor = listProveedor.filter((item: { codigoProveedor: string }) => item?.codigoProveedor === props.id)[0]

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue.codigoProveedor)
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
                        loading={query.isLoading}
                        options={listProveedor}
                        defaultValue={proveedor}
                        id='autocomplete-CodigoProveedor'
                        getOptionLabel={(option) => option.codigoProveedor + '-' + option.nombreProveedor}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Código de Proveedor" />}
                    />
                )
            }
        </>
    )
}

export default CodigoProveedor