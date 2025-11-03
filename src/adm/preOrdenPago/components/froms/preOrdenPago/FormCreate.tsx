import { useState, useRef } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices, UploadFile, Description, Delete } from '@mui/icons-material';
import {
    Box,
    Grid,
    FormControl,
    Button,
    InputLabel,
    Chip,
    Typography,
    Stack,
    CircularProgress
} from '@mui/material';

import { useServices } from '../../../services';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

interface FileFormDto {
    documentoAdjunto: File[]
}

const defaultValues: FileFormDto = {
    documentoAdjunto: []
}

const FormCreate = () => {
    const [isFormEnabled, setIsFormEnabled]     = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]           = useState(false)
    const fileInputRef                          = useRef<HTMLInputElement>(null);

    const qc: QueryClient  = useQueryClient()
    const rules            = getRules()

    const {
        store,
        message,
        loading
    } = useServices()

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<FileFormDto>({
        defaultValues,
        mode: 'onChange'
    })

    const selectedFiles = watch('documentoAdjunto')

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleClearForm = () => {
        reset(defaultValues)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDeleteFile = (fileName: string) => {
        const currentFiles = selectedFiles || []
        const updatedFiles = currentFiles.filter(file => file.name !== fileName)
        setValue('documentoAdjunto', updatedFiles, { shouldValidate: true, shouldDirty: true })
    }

    const handleUploadFile = async (dataForm: FileFormDto) => {
        setIsFormEnabled(false)

        try {
            if (dataForm.documentoAdjunto.length > 0) {
                const formData = new FormData()
                dataForm.documentoAdjunto.forEach((file, index) => {
                    formData.append(`files${index}`, file)
                })

                const response = await store(formData as any)

               /*  if (response?.isValid) { */
                    console.log('Archivos subidos con éxito:', response)
                    handleClearForm()
                    handleCloseDialog()
                /* } */
            }
        } catch (e: any) {
            console.error('handleUploadFile', e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['preOrdenPagoTable']
            })
        }
    }

    const filesCount = selectedFiles?.length || 0

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid
                    item
                    sm={12}
                    xs={12}
                    sx={{ overflow: 'auto', padding: '0 1rem' }}
                >
                    <Box>
                        {loading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 10,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 1,
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                    Analizando archivos, espere por favor...
                                </Typography>
                                <CircularProgress />
                            </Box>
                        )}

                        {!!isFormEnabled ?
                            <form>
                                <Grid container spacing={0} paddingTop={0} paddingBottom={0} justifyContent="flex">
                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="documentoAdjunto"
                                                    control={control}
                                                    rules={ rules.documentoAdjunto }
                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                        <Box>
                                                            <InputLabel
                                                                shrink
                                                                htmlFor="documentoAdjunto-input"
                                                                sx={{ position: 'relative', transform: 'none', marginBottom: 3 }}
                                                            >
                                                                Seleccionar Documento(s)
                                                            </InputLabel>

                                                            <input
                                                                id="documentoAdjunto-input"
                                                                type="file"
                                                                multiple
                                                                accept=".pdf,image/*"
                                                                style={{ display: 'none' }}
                                                                ref={fileInputRef}
                                                                onBlur={onBlur}
                                                                onChange={(e) => {
                                                                    const target = e.target as HTMLInputElement
                                                                    const newFiles = Array.from(target.files || [])
                                                                    const currentFiles = value || [];
                                                                    const updatedFiles = [...currentFiles, ...newFiles]
                                                                    onChange(updatedFiles)
                                                                    e.target.value = ''
                                                                }}
                                                            />

                                                            <label htmlFor="documentoAdjunto-input">
                                                                <Button
                                                                    component="span"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    startIcon={<UploadFile />}
                                                                    fullWidth
                                                                >
                                                                    Añadir Archivo(s)
                                                                </Button>
                                                            </label>

                                                            {errors.documentoAdjunto && (
                                                                <Typography color="error" variant="caption" display="block" sx={{ mt: 2, ml: 1.75 }}>
                                                                    {errors.documentoAdjunto.message}
                                                                </Typography>
                                                            )}


                                                            {filesCount > 0 && (
                                                                <Box mt={2}>
                                                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                                                        Archivos seleccionados ({filesCount}):
                                                                    </Typography>
                                                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                                                        {selectedFiles.map((file) => (
                                                                            <Chip
                                                                                key={file.name}
                                                                                icon={<Description />}
                                                                                label={file.name}
                                                                                onDelete={() => handleDeleteFile(file.name)}
                                                                                deleteIcon={<Delete />}
                                                                                color="info"
                                                                                variant="outlined"
                                                                            />
                                                                        ))}
                                                                    </Stack>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <DialogConfirmation
                                    open={dialogOpen}
                                    onClose={handleCloseDialog}
                                    onConfirm={handleSubmit(handleUploadFile)}
                                    loading={loading}
                                    title="Adjuntar Documento"
                                    content="¿Desea subir el documento(s) seleccionado(s)?"
                                />

                                <Box sx={{ paddingTop: 6 }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={handleOpenDialog}
                                        disabled={!isValid || filesCount === 0}
                                        startIcon={<UploadFile />}
                                    >
                                        { 'Subir' } ({filesCount})
                                    </Button>
                                    <Button
                                        color='primary'
                                        size='small'
                                        onClick={handleClearForm}
                                        startIcon={<CleaningServices />}
                                        sx={{ ml: 2 }}
                                    >
                                        Limpiar
                                    </Button>
                                </Box>
                            </form>
                            : null
                        }
                    </Box>
                </Grid>
            </Grid>
            <AlertMessage
                message={message?.text ?? ''}
                severity={message?.isValid ? 'success' : 'error'}
                duration={8000}
                show={message?.text ? true : false}
            />
        </>
    )
}

export default FormCreate