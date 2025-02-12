import React from 'react';
import { Box, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesBeneficiarioOp } from '../../services/index'
import { setIsOpenDialogConfirmButtons } from "src/store/apps/ordenPago"

import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateBeneficiarioOp } from '../../interfaces/admBeneficiarioOp/createBeneficiarioOp.interfaces'
import { IUpdateBeneficiarioOp } from '../../interfaces/admBeneficiarioOp/updateBeneficiarioOp.interfaces'
import { IDeleteBeneficiarioOp } from '../../interfaces/admBeneficiarioOp/deleteBeneficiarioOp.interfaces'

const FormCreateBeneficioOp = () => {
  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const { beneficioOpSeleccionado, isOpenDialogConfirmButtons } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, createBeneficiarioOp, updateBeneficiarioOp, deleteBeneficiarioOp } = useServicesBeneficiarioOp()

  const { control, setValue, getValues, formState: { isValid } } = useForm<any>({
      defaultValues: {
        monto: 0,
        montoPagado: 0,
        montoAnulado: 0
      },
      mode: 'onChange'
    })

  const invalidateAndReset = (nameTable: string) => {
    if (nameTable && nameTable !== null) {
      qc.invalidateQueries({
        queryKey: [nameTable]
      })
    }
    clearForm()
    dispatch(setIsOpenDialogConfirmButtons(false))
  }

  const handleCreateBeneficioOp = async (): Promise<void> => {
    try {
      const data: ICreateBeneficiarioOp = {
        codigoBeneficiarioOp: 0,
        codigoOrdenPago: 0,
        codigoProveedor: 0,
        monto: getValues('monto'),
        montoPagado: getValues('montoPagado'),
        montoAnulado: getValues('montoAnulado'),
        codigoPresupuesto: 0
      }

      const response = await createBeneficiarioOp(data)

      if (response.isValid) {}
    } catch (error) {
      console.error(error)
    } finally {
      invalidateAndReset('beneficioOpTable')
    }
  }

  const handleUpdateBeneficioOp = async (): Promise<void> => {
    try {
      const data: IUpdateBeneficiarioOp = {
        codigoBeneficiarioOp: beneficioOpSeleccionado.codigoBeneficiarioOp,
        codigoOrdenPago: beneficioOpSeleccionado.codigoOrdenPago,
        codigoProveedor: beneficioOpSeleccionado.codigoProveedor,
        monto: getValues('monto'),
        montoPagado: getValues('montoPagado'),
        montoAnulado: getValues('montoAnulado'),
        codigoPresupuesto: beneficioOpSeleccionado.codigoPresupuesto
      }
      const response = await updateBeneficiarioOp(data)

      if (response.isValid) {}
    } catch (error) {
      console.error(error)
    } finally {
      invalidateAndReset('beneficioOpTable')
    }
  }

  const handleDeleteBeneficioOp = async (): Promise<void> => {
    try {
      const data: IDeleteBeneficiarioOp = {
        codigoBeneficiarioOp: beneficioOpSeleccionado.codigoBeneficiarioOp
      }
      const response = await deleteBeneficiarioOp(data)

      if (response.isValid) {}
    } catch (error) {
      console.error(error)
    } finally {
      invalidateAndReset('beneficioOpTable')
    }
  }

  const clearForm = async (): Promise<void> => {
    setValue('monto', 0)
    setValue('montoPagado', 0)
    setValue('montoAnulado', 0)
  }

  useEffect(() => {
    console.log('beneficioOpSeleccionado', beneficioOpSeleccionado)
    if (beneficioOpSeleccionado) {
      setValue('monto', beneficioOpSeleccionado.monto)
      setValue('montoPagado', beneficioOpSeleccionado.montoPagado)
      setValue('montoAnulado', beneficioOpSeleccionado.montoAnulado)
    }
  }
    , [beneficioOpSeleccionado])


  return (
    <Box p={2}>
      <form>
        <Grid container spacing={2}>
          <Grid item sm={4} xs={12}>
            <Controller
              name="monto"
              control={control}
              defaultValue={beneficioOpSeleccionado?.monto}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Monto"
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0 }}
                  error={!!message}
                  helperText={message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name="montoPagado"
              control={control}
              defaultValue={beneficioOpSeleccionado?.montoPagado}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Monto Pagado"
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0 }}
                  error={!!message}
                  helperText={message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name="montoAnulado"
              control={control}
              defaultValue={beneficioOpSeleccionado?.montoAnulado}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Monto Anulado"
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0 }}
                  error={!!message}
                  helperText={message}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      <Box>
        <CustomButtonDialog
          saveButtonConfig={{
            label: 'Crear',
            onClick: handleCreateBeneficioOp,
            show: true,
            confirm: true
          }}
          updateButtonConfig={{
            label: 'Modificar',
            onClick: handleUpdateBeneficioOp,
            show: !!beneficioOpSeleccionado?.codigoBeneficiarioOp,
            confirm: true
          }}
          deleteButtonConfig={{
            label: 'Eliminar',
            onClick: handleDeleteBeneficioOp,
            show: !!beneficioOpSeleccionado?.codigoBeneficiarioOp,
            confirm: true
          }}
          clearButtonConfig={{
            label: 'Limpiar',
            onClick: clearForm,
            show: true
          }}
          loading={loading}
          isOpenDialog={isOpenDialogConfirmButtons}
          setIsOpenDialog={setIsOpenDialogConfirmButtons}
          isFormValid={isValid}
        />
      </Box>
    </Box>
  )
}

export default FormCreateBeneficioOp
