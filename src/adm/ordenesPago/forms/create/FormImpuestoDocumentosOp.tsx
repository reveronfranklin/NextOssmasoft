import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { Button, Box, Grid, TextField, FormHelperText } from '@mui/material'
import CustomButtonDialog from './../../components/BottonsActions'
import { useServicesImpuestosDocumentosOp } from '../../services/index'
import { setIsOpenDialogConfirmButtons } from 'src/store/apps/ordenPago'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { ICreateImpuestoDocumentosOp } from './../../interfaces/impuestoDocumentosOp/createImpuestoDocumentosOp'
import { IUpdateImpuestoDocumentosOp } from './../../interfaces/impuestoDocumentosOp/updateImpuestoDocumentosOp'
import { IDeleteImpuestoDocumentosOp } from './../../interfaces/impuestoDocumentosOp/deleteImpuestoDocumentosOp'

const FormImpuestoDocumentosOp = () => {
  const {
    error, message, loading,
    createImpuestoDocumentosOp,
    updateImpuestoDocumentosOp,
    deleteImpuestoDocumentosOp,
  } = useServicesImpuestosDocumentosOp()

  const defaultValues: any = {
    codigoImpuestoDocumentoOp: 0,
    codigoDocumentoOp: 23275,
    codigoRetencion: 0,
    tipoRetencionId: 0,
    periodoImpositivo: "202303",
    baseImponible: 0,
    montoImpuesto: 0,
    montoImpuestoExento: 0,
    montoRetenido: 0
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues
  })

  const { documentoOpSeleccionado, isOpenDialogConfirmButtons } = useSelector((state: RootState) => state.admOrdenPago)

  const handleCreateImpuestoDocumentosOp = async (): Promise<void> => {
    const newCreate: ICreateImpuestoDocumentosOp = {
      codigoImpuestoDocumentoOp: getValues('codigoImpuestoDocumentoOp'),
      codigoDocumentoOp: getValues('codigoDocumentoOp'),
      codigoRetencion: getValues('codigoRetencion'),
      tipoRetencionId: getValues('tipoRetencionId'),
      periodoImpositivo: getValues('periodoImpositivo'),
      baseImponible: getValues('baseImponible'),
      montoImpuesto: getValues('montoImpuesto'),
      montoImpuestoExento: getValues('montoImpuestoExento'),
      montoRetenido: getValues('montoRetenido'),
    }

    console.log(newCreate)

    return

    await createImpuestoDocumentosOp(newCreate)

  }

  const handleUpdateImpuestoDocumentosOp = async (): Promise<void> => {
    const payload: IUpdateImpuestoDocumentosOp = {
      codigoImpuestoDocumentoOp: getValues('codigoImpuestoDocumentoOp'),
      codigoDocumentoOp: getValues('codigoDocumentoOp'),
      codigoRetencion: getValues('codigoRetencion'),
      tipoRetencionId: getValues('tipoRetencionId'),
      periodoImpositivo: getValues('periodoImpositivo'),
      baseImponible: getValues('baseImponible'),
      montoImpuesto: getValues('montoImpuesto'),
      montoImpuestoExento: getValues('montoImpuestoExento'),
      montoRetenido: getValues('montoRetenido'),
    }

    console.log(payload)

    return

    await updateImpuestoDocumentosOp(payload)
  }

  const handleDeleteImpuestoDocumentosOp = async (): Promise<void> => {
    const payload: IDeleteImpuestoDocumentosOp = {
      codigoImpuestoDocumentoOp: getValues('codigoImpuestoDocumentoOp')
    }

    console.log(payload)

    await deleteImpuestoDocumentosOp(payload)
  }

  const clearForm: () => Promise<void> = async () => {
    setValue('codigoImpuestoDocumentoOp', 0)
    setValue('codigoDocumentoOp', 0)
    setValue('codigoRetencion', 0)
    setValue('tipoRetencionId', 0)
    setValue('periodoImpositivo', '')
    setValue('baseImponible', 0)
    setValue('montoImpuesto', 0)
    setValue('montoImpuestoExento', 0)
    setValue('montoRetenido', 0)
  }

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} paddingTop={0} justifyContent='flex-start'>
          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={4}>
              <Controller
                name='codigoImpuestoDocumentoOp'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Codigo Impuesto'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name='codigoDocumentoOp'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Codigo Documento'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name='codigoRetencion'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Codigo Retencion'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

          </Grid>
          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={4}>
              <Controller
                name='tipoRetencionId'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Codigo Retencion Id'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name='periodoImpositivo'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='periodo Impositivo'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name='baseImponible'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='base Imponible'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={4}>
              <Controller
                name='montoImpuesto'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='monto Impuesto'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name='montoImpuestoExento'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='monto Impuesto Exento'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name='montoRetenido'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='monto Retenido'
                    variant='outlined'
                    disabled={false}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
          {error && (
            <Box>
              <FormHelperText sx={{ color: 'error.main', fontSize: 16 }}>{error}</FormHelperText>
            </Box>
          )}
        </Grid>
      </form>
      <CustomButtonDialog
        saveButtonConfig={{
          label: 'Crear',
          onClick: handleCreateImpuestoDocumentosOp,
          show: true,
          confirm: true,
          disabled: false
        }}
        updateButtonConfig={{
          label: 'Actualizar',
          onClick: handleUpdateImpuestoDocumentosOp,
          show: true,
          confirm: true,
          disabled: false
        }}
        deleteButtonConfig={{
          label: 'Eliminar',
          onClick: handleDeleteImpuestoDocumentosOp,
          show: true,
          confirm: true,
          disabled: false
        }}
        clearButtonConfig={{
          label: 'Limpiar',
          onClick: async () => clearForm(),
          show: true,
          disabled: false
        }}
        loading={loading}
        isOpenDialog={isOpenDialogConfirmButtons}
        setIsOpenDialog={setIsOpenDialogConfirmButtons}
        isFormValid={isValid}
      />
    </>
  )
}

export default FormImpuestoDocumentosOp