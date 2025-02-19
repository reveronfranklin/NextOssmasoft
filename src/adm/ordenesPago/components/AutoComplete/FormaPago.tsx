import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import useServices from '../../services/useServices'

interface IFormaPago {
    id: number
    descripcion: string,
    value: number
}

const FormaPago = (props: any) => {
    const { fetchDescriptivaById } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['tipoPago'],
        queryFn: () => fetchDescriptivaById({ tituloId: 16 }),
        retry: 3,
        staleTime: 5000 * 60 * 60,
    }, qc)

    const ListFormaPago: IFormaPago[] = query.data?.data ?? [];
    const [selectedValue, setSelectedValue] = useState<IFormaPago | null>(null)

    useEffect(() => {
        if (props.id === 0) {
            setSelectedValue(null)

            return
        }

        const value = ListFormaPago.filter((item: { id: number }) => item?.id == props?.id)[0]

        if (value) {
            handleChange(null, value)
        }
    }, [props.id, ListFormaPago])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            props.onSelectionChange({
                id: 0,
                value: 0
            })
            setSelectedValue(null)
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
                        ref={props.autocompleteRef}
                        options={ListFormaPago}
                        value={selectedValue}
                        id='autocomplete-TipoImpuesto'
                        getOptionLabel={(option) => option.id + '-' + option.descripcion}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="FormaPago" />}
                    />
                )
            }
        </>
    )
}

export default FormaPago