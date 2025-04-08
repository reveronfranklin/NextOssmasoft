import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { useServicesDescriptivas } from '../../services';
import { DescriptivaResponseDto, DescriptivaFilterDto } from '../../interfaces';

const TipoCuenta = (props: any) => {
    const { getList }       = useServicesDescriptivas()
    const qc: QueryClient   = useQueryClient()

    const payload: DescriptivaFilterDto = {
        TituloId: 199
    }

    const query = useQuery({
        queryKey: ['tipoCuenta'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListTipoCuenta: DescriptivaResponseDto[]     = query.data?.data ?? [];
    const [selectedValue, setSelectedValue] = useState<DescriptivaResponseDto | null>(null)

    useEffect(() => {
        if (props.id === 0) {
            setSelectedValue(null)

            return
        }

        if (selectedValue && selectedValue.descripcionId === props.id) {

            return
        }

        const value = ListTipoCuenta.find((item) => item?.descripcionId === props.id)

        if (value && (!selectedValue || selectedValue.descripcionId !== value.descripcionId)) {
            setSelectedValue(value)
            props.onSelectionChange(value)
        }
    }, [props.id, ListTipoCuenta])

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
                        options={ListTipoCuenta}
                        value={selectedValue}
                        id='autocomplete-tipo-cuenta'
                        getOptionLabel={(option) => `${option.descripcionId} - ${option.descripcion}`}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Tipo de cuenta" />}
                    />
                )
            }
        </>
    )
}

export default TipoCuenta