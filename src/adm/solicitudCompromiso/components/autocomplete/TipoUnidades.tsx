import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { Skeleton } from "@mui/material";
import useServices from '../../services/useServices'
import { useEffect, useState } from "react";

interface ITipoUnidades {
    id: number
    descripcion: string
}

const TipoUnidad = (props: any) => {
    const { fetchTipoUnidades } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['tipoUnidades'],
        queryFn: () => fetchTipoUnidades(),
        retry: 3,
        staleTime: 5000 * 60 * 60,
    }, qc)

    const listTipo: ITipoUnidades[] = query.data?.data ?? [];
    const [selectedValue, setSelectedValue] = useState<ITipoUnidades | null>(null)

    useEffect(() => {
        if (props.id === 0) {
            setSelectedValue(null)

            return
        }
        setSelectedValue(listTipo.filter((item: { id: number }) => item?.id == props?.id)[0])
    }, [props.id]);

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue.id)
            setSelectedValue(newValue)
        } else {
            props.onSelectionChange(0)
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
                        options={listTipo}
                        value={selectedValue}
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

export default TipoUnidad