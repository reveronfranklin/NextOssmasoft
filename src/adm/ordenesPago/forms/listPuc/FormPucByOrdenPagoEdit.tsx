import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Grid } from '@mui/material'
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import { setIsOpenDialogListPucOrdenPagoEdit } from "src/store/apps/ordenPago"
import useServices from '../../services/useServices'
import { NumericFormat } from 'react-number-format'
import AlertMessage from 'src/views/components/alerts/AlertMessage'
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm"
import useInvalidateReset from 'src/hooks/useInvalidateReset'

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
    const invalidateReset = useInvalidateReset()

    const { pucSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)

    const { message, fetchUpdatePucByOrdenPago } = useServices()

    const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormInputs>({ defaultValues: pucSeleccionado, mode: 'onChange' })

    const onSubmit = async (data: FormInputs) => {
        const updateDto: IUpdateFieldDto = {
            id: data.codigoPucOrdenPago,
            value: data.monto.toString(),
            field: 'monto',
        }

        try {
            const response = await fetchUpdatePucByOrdenPago(updateDto)

            if (response.isValid) {
                message.text = 'Puc actualizado correctamente'
                message.isValid = true

                invalidateReset({
                    tables: ['listPucByOrdenPago', 'listCompromisoByOrdenPago', 'compromisosTable'],
                    resetForm: () => { console.log('Form reset') },
                    delay: 10000,
                })
            } else {
                message.text = response.message || 'Error al actualizar el Puc'
                message.isValid = false
            }
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => {
                dispatch(setIsOpenDialogListPucOrdenPagoEdit(false))
            }, 1000)
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
                    render={({ field: { ref, ...field } }) => (
                        <NumericFormat
                            {...field}
                            getInputRef={ref}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            decimalScale={2}
                            customInput={TextField}
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
                    <ButtonWithConfirm
                        color="primary"
                        onAction={handleSubmit(onSubmit)}
                        confirmMessage={'¿Está seguro de que desea guardar los cambios?'}
                        showLoading={true}
                        disableBackdropClick={true}
                        sx={{ minWidth: '120px' }}
                        disabled={!isValid}
                    >
                        Guardar
                    </ButtonWithConfirm>
                    <AlertMessage
                        message={message?.text ?? ''}
                        severity={message?.isValid ? 'success' : 'error'}
                        duration={4000}
                        show={message?.text ? true : false}
                    />
                </Box>
            </Grid>
        </Grid>
    </>
    )
}

export default FormPucByOrdenPagoEdit