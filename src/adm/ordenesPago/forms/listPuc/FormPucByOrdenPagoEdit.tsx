import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Button, Grid } from '@mui/material'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { setIsOpenDialogListPucOrdenPagoEdit } from "src/store/apps/ordenPago"
import useServices from '../../services/useServices'
import { useDispatch } from 'react-redux'
import { NumericFormat } from 'react-number-format'

interface FormInputs {
    monto: number
    icpConcat: string
    pucConcat: string
    descripcionIcp: string
    descripcionPuc: string
    codigoPucCompromiso: number
    codigoPucOrdenPago: number
    descripcionFinanciado: string
}

const FormPucByOrdenPagoEdit = () => {
    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

    const { pucSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)
    const { fetchUpdatePucByOrdenPago } = useServices()
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormInputs>({ defaultValues: pucSeleccionado, mode: 'onChange' })

    const onSubmit = async (data: FormInputs) => {
        const updateDto: IUpdateFieldDto = {
            id: data.codigoPucOrdenPago,
            value: data.monto.toString(),
            field: 'monto',
        }

        try {
            const response = await fetchUpdatePucByOrdenPago(updateDto)
            if (response?.data?.isValid) {
                toast.success('Registro actualizado')
            }
        } catch (error) {
            console.error(error)
        } finally {
            qc.invalidateQueries({ queryKey: ['listPucByOrdenPago'] })
            dispatch(setIsOpenDialogListPucOrdenPagoEdit(false))
        }
    }

    return (
    <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Controller
                    name="monto"
                    control={control}
                    rules={{
                        required: 'Este campo es requerido',
                        min: { value: 0, message: 'El monto debe ser mayor o igual a 0' }
                    }}
                    render={({ field }) => (
                        <NumericFormat
                            {...field}
                            customInput={TextField}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            decimalScale={2}
                            label="Monto"
                            fullWidth
                            error={!!errors.monto}
                            helperText={errors.monto?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                <Controller
                    name="icpConcat"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="icpConcat"
                            type="string"
                            fullWidth
                            disabled={true}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                <Controller
                    name="descripcionIcp"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Descripción ICP"
                            type="string"
                            fullWidth
                            disabled={true}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                <Controller
                    name="pucConcat"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="pucConcat"
                            type="string"
                            fullWidth
                            disabled={true}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                <Controller
                    name="descripcionPuc"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Descripción PUC"
                            type="string"
                            fullWidth
                            disabled={true}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                <Controller
                    name="descripcionFinanciado"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="descripcionFinanciado"
                            type="string"
                            fullWidth
                            disabled={true}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!isValid}
                    >
                        Guardar
                    </Button>
                </Box>
            </Grid>
        </Grid>
    </>
    )
}

export default FormPucByOrdenPagoEdit