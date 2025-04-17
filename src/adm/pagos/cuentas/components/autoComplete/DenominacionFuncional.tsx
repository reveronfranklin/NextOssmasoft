import { useEffect, useState } from 'react'
import { Skeleton, Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material'
import { useQueryClient, useQuery, type QueryClient } from '@tanstack/react-query'
import { useServicesDescriptivas } from '../../services'
import type { AutoCompleteProps, DescriptivaResponseDto, DescriptivaFilterDto } from '../../interfaces'

const DenominacionFuncional = ({
    id,
    onSelectionChange,
    error,
    label = 'Denominación Funcional',
    required = false,
    autoFocus = false
}: AutoCompleteProps) => {
    const { getList } = useServicesDescriptivas()
    const qc: QueryClient = useQueryClient()

    const payload: DescriptivaFilterDto = {
        TituloId: 221
    }

    const query = useQuery({
        queryKey: ['denominacionFuncional'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListDenominacionFuncional: DescriptivaResponseDto[]   = query.data?.data ?? []
    const [selectedValue, setSelectedValue]                     = useState<DescriptivaResponseDto | null>(null)

    useEffect(() => {
        if (id === null || id === 0 || id === undefined) {
            setSelectedValue(null)

            return
        }

        const value = ListDenominacionFuncional.find((item) => item?.descripcionId === id)
        setSelectedValue(value ?? null)
    }, [id, ListDenominacionFuncional])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            onSelectionChange({
                descripcionId: 0,
                value: 0
            })
            setSelectedValue(null)
        }
    }

    return (
        <FormControl fullWidth error={!!error}>
            {query.isLoading ? (
                <Skeleton
                    width={300}
                    height={70}
                    style={{
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        padding: 0
                    }}
                />
            ) : (
                <>
                    <Autocomplete
                        options={ListDenominacionFuncional}
                        value={selectedValue}
                        id="autocomplete-denominacion-funcional"
                        getOptionLabel={(option) => `${option.descripcionId} - ${option.descripcion}`}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label={label} required={required} error={!!error} autoFocus={autoFocus} />}
                        key={`denominacion-funcional-${id || "empty"}`}
                    />
                    {
                        error && <FormHelperText error>{error}</FormHelperText>
                    }
                </>
            )}
        </FormControl>
    )
}

export default DenominacionFuncional