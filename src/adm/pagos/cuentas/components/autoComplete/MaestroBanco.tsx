import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { useServicesMaestroBanco } from '../../services';
import { BancoResponseDto, BancoFilterDto } from '../../interfaces';

const MaestroBanco = (props: any) => {
    const { getList }       = useServicesMaestroBanco()
    const qc: QueryClient   = useQueryClient()

    const payload: BancoFilterDto = {
        searchText: ''
    }

    const query = useQuery({
        queryKey: ['maestroBancoCodigo'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListBanco: BancoResponseDto[]     = query.data?.data ?? [];
    const [selectedValue, setSelectedValue] = useState<BancoResponseDto | null>(null)

    useEffect(() => {
        // No hacer nada si no hay ID o si ya hay un valor seleccionado que coincide
        if (props.id === 0) {
            setSelectedValue(null)
            return
        }

        if (selectedValue && selectedValue.codigoBanco === props.id) {
            return
        }

        const value = ListBanco.find((item) => item?.codigoBanco === props.id)

        if (value && (!selectedValue || selectedValue.codigoBanco !== value.codigoBanco)) {
            // Usar una bandera para evitar la actualización circular
            setSelectedValue(value)
            // Solo llamar a onSelectionChange si el valor es diferente
            props.onSelectionChange(value)
        }
    }, [props.id, ListBanco])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            props.onSelectionChange({
                codigoBanco: 0,
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
                        options={ListBanco}
                        value={selectedValue}
                        id='autocomplete-maestro-banco'
                        getOptionLabel={(option) => `${option.codigoBanco} - ${option.nombre}`}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Maestro Banco" />}
                    />
                )
            }
        </>
    )
}

export default MaestroBanco