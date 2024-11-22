import React from 'react';
import { Box, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setIsOpenDialogConfirmButtons, setRetencionSeleccionado } from "src/store/apps/ordenPago"
import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

const formCreateRetenciones = () => {
  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const { isOpenDialogConfirmButtons } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, createRetencion, updateRetencion, deleteRetencion } = useServicesRetenciones()

  const { control, setValue, getValues, formState: { errors } } = useForm<any>({
    defaultValues: {},
    mode: 'onChange',
  })

  const handleCreateOrden = async (): Promise<void> => {}
  const handleUpdateOrden = async (): Promise<void> => {}
  const handleDeleteOrden = async (): Promise<void> => {}
  const clearForm = async (): Promise<void> => {}

  return (
    <Box>
      <form></form>
      <CustomButtonDialog
        saveButtonConfig={{
          label: 'Crear',
          onClick: handleCreateOrden,
          show: true,
          confirm: true
        }}
        updateButtonConfig={{
          label: 'Modificar',
          onClick: handleUpdateOrden,
          show: true,
          confirm: true
        }}
        deleteButtonConfig={{
          label: 'Eliminar',
          onClick: handleDeleteOrden,
          show: true,
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
      />
    </Box>
  )
}

export default formCreateRetenciones