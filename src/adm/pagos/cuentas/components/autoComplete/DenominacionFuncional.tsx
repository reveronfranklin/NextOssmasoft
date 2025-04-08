import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { useServicesDescriptivas } from '../../services';
import { DescriptivaResponseDto, DescriptivaFilterDto } from '../../interfaces';

const DenominacionFuncional = (props: any) => {
    const { getList }       = useServicesDescriptivas()
    const qc: QueryClient   = useQueryClient()

    const payload: DescriptivaFilterDto = {
        TituloId: 221
    }

    const query = useQuery({
        queryKey: ['denominacionFuncional'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListDenominacionFuncional: DescriptivaResponseDto[]     = query.data?.data ?? [];
    const [selectedValue, setSelectedValue] = useState<DescriptivaResponseDto | null>(null)

    useEffect(() => {
        // No hacer nada si no hay ID o si ya hay un valor seleccionado que coincide
        if (props.id === 0) {
            setSelectedValue(null)
            return
        }

        if (selectedValue && selectedValue.descripcionId === props.id) {
            return
        }

        const value = ListDenominacionFuncional.find((item) => item?.descripcionId === props.id)

        if (value && (!selectedValue || selectedValue.descripcionId !== value.descripcionId)) {
            // Usar una bandera para evitar la actualización circular
            setSelectedValue(value)
            // Solo llamar a onSelectionChange si el valor es diferente
            props.onSelectionChange(value)
        }
    }, [props.id, ListDenominacionFuncional])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            props.onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            props.onSelectionChange({
                descripcionId: 0,
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
                        options={ListDenominacionFuncional}
                        value={selectedValue}
                        id='autocomplete-denominacion-funcional'
                        getOptionLabel={(option) => `${option.descripcionId} - ${option.descripcion}`}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Denominación Funcional" />}
                    />
                )
            }
        </>
    )
}

export default DenominacionFuncional