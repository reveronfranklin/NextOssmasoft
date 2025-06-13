import { useEffect, useState } from 'react';
import { Skeleton, Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import { useQueryClient, useQuery, type QueryClient } from '@tanstack/react-query';
import { useServicesProveedoresContacto  } from '../../services';
import type { AutoCompleteProps, ProveeedorResponseDto } from '../../interfaces';

const BeneficiariosProveedoresContactos = ({
    id,
    onSelectionChange,
    error,
    label = 'Beneficiario Proveedor Contacto',
    required = false,
    autoFocus = false
} : AutoCompleteProps) => {
    const [selectedValue, setSelectedValue] = useState<ProveeedorResponseDto | null>(null)

    const { getList }       = useServicesProveedoresContacto()
    const qc: QueryClient   = useQueryClient()

    const query = useQuery({
        queryKey: ['beneficiariosProveedoresContactos'],
        queryFn: () => getList(),
        retry: 3,
        staleTime: 5000 * 60 * 60
    }, qc)

    const ListBeneficiariosProveedoresContacto: ProveeedorResponseDto[] = query.data?.data ?? []

    // Filter to remove duplicates based on codigoProveedor
    const uniqueBeneficiarios = ListBeneficiariosProveedoresContacto.filter((beneficiario, index, self) =>
        index === self.findIndex((b) => b.codigoProveedor === beneficiario.codigoProveedor)
    )

    useEffect(() => {
        if (id === null || id === 0 || id === undefined) {
          setSelectedValue(null)

          return
        }

        const value = uniqueBeneficiarios.find((item) => item?.codigoProveedor === id)
        setSelectedValue(value ?? null)
    }, [id, uniqueBeneficiarios])

    const handleChange = (event: any, newValue: any) => {
        if (newValue) {
            onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            onSelectionChange({
                codigoProveedor: 0,
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
                        options={uniqueBeneficiarios}
                        value={selectedValue}
                        id="autocomplete-beneficiarios-proveedores-contactos"
                        getOptionLabel={(option) => {
                            return `${option.codigoProveedor} - ${option.nombreProveedor}`
                        }}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label={label} required={required} error={!!error} autoFocus={autoFocus} />}
                        key={`beneficiarios-proveedores-contactos-${id} || 'empty'}`}
                    />
                    {
                        error && <FormHelperText error>{error}</FormHelperText>
                    }
                </>
            )}
        </FormControl>
    )
}

export default BeneficiariosProveedoresContactos