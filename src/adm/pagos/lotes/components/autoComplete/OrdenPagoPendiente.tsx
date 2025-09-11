import { useEffect, useState } from 'react';
import { Skeleton, Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import { useQueryClient, useQuery, type QueryClient } from '@tanstack/react-query';
import { useServicesOrdenPago } from '../../services';
import type { AutoCompleteProps, OrdenPagoResponseDto, OrdenPagoFilterDto } from '../../interfaces';

const OrdenPagoPendiente = ({
    id,
    onSelectionChange,
    error,
    label = 'Orden Pago Pendiente',
    required = false,
    autoFocus = false
} : AutoCompleteProps) => {
    const [selectedValue, setSelectedValue]                         = useState<OrdenPagoResponseDto | null>(null)
    const [isPresupuestoSeleccionado, setIsPresupuestoSeleccionado] = useState<boolean>(false)

    const {
        presupuestoSeleccionado,
        getList
    } = useServicesOrdenPago()

    const qc: QueryClient = useQueryClient()

    const payload: OrdenPagoFilterDto = {
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto
    }

    const query = useQuery({
        queryKey: ['ordenPagoPendientes'],
        queryFn: () => getList(payload),
        retry: 3,
        staleTime: 5000 * 60 * 60,
        enabled: isPresupuestoSeleccionado
    }, qc)

    const ListOrdenPagoPendiente: OrdenPagoResponseDto[] = query.data?.data ?? []

    useEffect(() => {
        if (id === null || id === 0 || id === undefined) {
          setSelectedValue(null)

          return
        }

        const value = ListOrdenPagoPendiente.find((item) => item?.codigoOrdenPago === id)
        setSelectedValue(value ?? null)
    }, [id, ListOrdenPagoPendiente])

    useEffect(() => {
        if (presupuestoSeleccionado.codigoPresupuesto > 0) {
            setIsPresupuestoSeleccionado(true)
        } else if (presupuestoSeleccionado.codigoPresupuesto === 0) {
            setIsPresupuestoSeleccionado(false)
        }
    }, [ presupuestoSeleccionado.codigoPresupuesto ])

    const handleChange = (event: any, newValue: any) => {
        if (newValue) {
            onSelectionChange(newValue)
            setSelectedValue(newValue)
        } else {
            onSelectionChange({
                codigoOrdenPago: 0,
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
                        options={ListOrdenPagoPendiente}
                        value={selectedValue}
                        id="autocomplete-orden-pago-pendiente"
                        getOptionLabel={(option) => {
                            return `${option.codigoOrdenPago} - ${option.tipoOrdenPago} - ${option.numeroOrdenPago}`
                        }}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label={label} required={required} error={!!error} autoFocus={autoFocus} />}
                        key={`orden-pago-pendiente-${id || 'empty'}`}
                    />
                    {
                        error && <FormHelperText error>{error}</FormHelperText>
                    }
                </>
            )}
        </FormControl>
    )
}

export default OrdenPagoPendiente