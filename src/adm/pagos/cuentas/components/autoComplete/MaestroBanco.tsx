import { useEffect, useState } from 'react';
import { Skeleton, Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import { useQueryClient, useQuery, type QueryClient } from '@tanstack/react-query';
import { useServicesMaestroBanco } from '../../services';
import type { AutoCompleteProps, BancoResponseDto, BancoFilterDto } from '../../interfaces';

const MaestroBanco = ({
    id,
    onSelectionChange,
    error,
    label = 'Maestro Banco',
    required = false,
    autoFocus = false
} : AutoCompleteProps) => {
    const { getList } = useServicesMaestroBanco()
    const qc: QueryClient = useQueryClient()

    const payload: BancoFilterDto = {
        searchText: ''
    }

    const query = useQuery({
        queryKey: ['maestroBancoCodigo'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListBanco: BancoResponseDto[]     = query.data?.data ?? []
    const [selectedValue, setSelectedValue] = useState<BancoResponseDto | null>(null)

    useEffect(() => {
        if (id === null || id === 0 || id === undefined) {
          setSelectedValue(null)

          return
        }

        const value = ListBanco.find((item) => item?.codigoBanco === id)
        setSelectedValue(value ?? null)
    }, [id, ListBanco])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            onSelectionChange({
                codigoBanco: 0,
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
                        options={ListBanco}
                        value={selectedValue}
                        id="autocomplete-maestro-banco"
                        getOptionLabel={(option) => `${option.codigoBanco} - ${option.nombre}`}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label={label} required={required} error={!!error} autoFocus={autoFocus} />}
                        key={`banco-${id || 'empty'}`}
                    />
                    {
                        error && <FormHelperText error>{error}</FormHelperText>
                    }
                </>
            )}
        </FormControl>
    )
}

export default MaestroBanco