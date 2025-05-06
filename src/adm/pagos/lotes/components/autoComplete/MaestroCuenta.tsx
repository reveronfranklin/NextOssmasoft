import { useEffect, useState } from 'react';
import { Skeleton, Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import { useQueryClient, useQuery, type QueryClient } from '@tanstack/react-query';
import { useServicesMaestroCuenta } from '../../services';
import type { AutoCompleteProps, CuentaResponseDto, CuentaFilterDto } from '../../interfaces';

const MaestroCuenta = ({
    id,
    onSelectionChange,
    error,
    label = 'Maestro Cuenta',
    required = false,
    autoFocus = false
} : AutoCompleteProps) => {
    const { getList }       = useServicesMaestroCuenta()
    const qc: QueryClient   = useQueryClient()

    const payload: CuentaFilterDto = {
        searchText: ''
    }

    const query = useQuery({
        queryKey: ['maestroCuentaCodigo'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListCuenta: CuentaResponseDto[]    = query.data?.data ?? []
    const [selectedValue, setSelectedValue] = useState<CuentaResponseDto | null>(null)

    useEffect(() => {
        if (id === null || id === 0 || id === undefined) {
          setSelectedValue(null)

          return
        }

        const value = ListCuenta.find((item) => item?.codigoCuentaBanco === id)
        setSelectedValue(value ?? null)
    }, [id, ListCuenta])

    const handleChange = (e: any, newValue: any) => {
        if (newValue) {
            onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            onSelectionChange({
                codigoCuentaBanco: 0,
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
                        options={ListCuenta}
                        value={selectedValue}
                        id="autocomplete-maestro-cuenta"
                        getOptionLabel={(option) => {
                            return `${option.codigoCuentaBanco} - ${option.descripcionBanco} - ${option.noCuenta} - ${option.descripcionDenominacionFuncional}`
                        }}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label={label} required={required} error={!!error} autoFocus={autoFocus} />}
                        key={`cuenta-${id || 'empty'}`}
                    />
                    {
                        error && <FormHelperText error>{error}</FormHelperText>
                    }
                </>
            )}
        </FormControl>
    )
}

export default MaestroCuenta