import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material'
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';

import { SisBancoCreateDto } from '../interfaces'

const FormMaestroBanco = (props: {
    maestroBanco?: SisBancoCreateDto,
    onFormData?: any,
    onFormClear?: any,
    titleButton?: string,
    message?: string,
    loading?: boolean
}) => {
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)
    const [open, setOpen] = useState<boolean>(false)

    const {
        maestroBanco,
        onFormData,
        onFormClear,
        titleButton,
        message,
        loading
    } = props

    const defaultValues: SisBancoCreateDto = {
        codigoBanco: 0,
        nombre: '',
        codigoInterbancario: ''
    }

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid }
    } = useForm<SisBancoCreateDto>({
        defaultValues,
        mode: 'onChange'
    })

    const onSubmit = async (data: SisBancoCreateDto) => {
        onFormData({ ...data })
    }

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        if (maestroBanco && Object.keys(maestroBanco).length) {
            setIsFormEnabled(true)

            setValue('codigoBanco', maestroBanco.codigoBanco ?? 0)
            setValue('nombre', maestroBanco.nombre ?? '')
            setValue('codigoInterbancario', maestroBanco.codigoInterbancario ?? '')
        }

        if (open && !loading) handleClose()
    }, [maestroBanco, loading, setValue ])

    return (
        <Box>
            {!!isFormEnabled ?
                <form>
                    <Grid container spacing={0} paddingTop={0} paddingBottom={0} justifyContent="flex">
                        <Grid container spacing={0} sm={12} xs={12}>
                            <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="codigoBanco"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Código Banco"
                                                placeholder="Código Banco"
                                                value={value || 0}
                                                multiline
                                                onChange={onChange}
                                                error={!!errors.codigoBanco}
                                                helperText={errors.codigoBanco?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="codigoInterbancario"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Código Interbancario"
                                                placeholder="Código Interbancario"
                                                value={value || ''}
                                                multiline
                                                onChange={onChange}
                                                error={!!errors.codigoInterbancario}
                                                helperText={errors.codigoInterbancario?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={0} sm={12} xs={12}>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="nombre"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Nombre del Banco"
                                                placeholder="Nombre del Banco"
                                                value={value || ''}
                                                multiline
                                                onChange={onChange}
                                                error={!!errors.nombre}
                                                helperText={errors.nombre?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='alert-dialog-description'
                    >
                        <DialogTitle id='alert-dialog-title'>
                            {'Esta usted seguro de realizar esta acción?'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id='alert-dialog-description'>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>No</Button>
                            <Button
                                variant='contained'
                                color='primary'
                                size='small'
                                onClick={handleSubmit(onSubmit)}
                            >
                                { loading ? (
                                    <>
                                        <CircularProgress
                                            sx={{
                                                color: 'common.white',
                                                width: '20px !important',
                                                height: '20px !important',
                                                mr: theme => theme.spacing(2)
                                            }}
                                        />
                                        Espere un momento...
                                    </>
                                ) : 'Si' }
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Box sx={{ paddingTop: 6 }}>
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            onClick={handleDialogOpen}
                            disabled={!isValid}
                        >
                            { titleButton }
                        </Button>
                        <Button
                            color='primary'
                            size='small'
                            onClick={onFormClear}
                        >
                            <CleaningServices /> Limpiar
                        </Button>
                        <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{message}</FormHelperText>
                    </Box>
                </form>
                : null
            }
        </Box>
    )
}

export default FormMaestroBanco