import { useEffect, useState } from 'react';
import { Skeleton, Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import type { AutoCompleteProps, AdmBeneficiariosPendientesPago } from '../../interfaces';

const BeneficiariosOrdenPago = ({
    id,
    onSelectionChange,
    error,
    label = 'Beneficiario',
    required = false,
    autoFocus = false,
    options = [] as AdmBeneficiariosPendientesPago[]
} : AutoCompleteProps) => {
    const [selectedValue, setSelectedValue] = useState<AdmBeneficiariosPendientesPago | null>(null)

    const ListBeneficiarios: AdmBeneficiariosPendientesPago[] = options

    useEffect(() => {
        if (id === null || id === 0 || id === undefined) {
            setSelectedValue(null)

            return
        }

        const value = ListBeneficiarios.find((item) => item?.codigoBeneficiarioOp === id)
        setSelectedValue(value ?? null)
    }, [id, ListBeneficiarios])

    const handleChange = (event: any, newValue: any) => {
        if (newValue) {
            onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            onSelectionChange({
                codigoBeneficiarioOp: 0,
                value: 0
            })
            setSelectedValue(null)
        }
    }

    return (
        <FormControl fullWidth error={!!error}>
            {
                (options.length === 0) ? (
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
                        options={ListBeneficiarios}
                        value={selectedValue}
                        id="autocomplete-tipo-pago"
                        getOptionLabel={(option) => `${option.codigoBeneficiarioOp} - ${option.nombreProveedor}`}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label={label} required={required} error={!!error} autoFocus={autoFocus} />}
                        key={`tipo-pago-${id || 'empty'}`}
                    />
                    {
                        error && <FormHelperText error>{error}</FormHelperText>
                    }
                </>
            )}
        </FormControl>
    )
}

export default BeneficiariosOrdenPago