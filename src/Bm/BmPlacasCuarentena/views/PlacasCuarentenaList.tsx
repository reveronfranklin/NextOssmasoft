import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Spinner from 'src/@core/components/spinner'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { IBmConteoResponseDto } from 'src/interfaces/Bm/BmConteo/BmConteoResponseDto'

import { IBmPlacaCuarentenaResponseDto } from 'src/interfaces/Bm/BmPlacasCuarentena/BmPlacaCuarentenaResponseDto'
import {
  setBmPlacaCuarentenaSeleccionado,
  setListPlacas,
  setOperacionCrudBmPlacaCuarentena,
  setVerBmPlacaCuarentenaActive
} from 'src/store/apps/bmPlacaCuarentena'
import DialogBmPlacaCuarentenaInfo from './DialogBmPlacaCuarentenaInfo'

//import { ICPGetDto } from 'src/interfaces/Bm/BmConteo/ICPGetDto';

const PlacasCuarentenaList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const columns = [
    {
      field: 'codigoPlacaCuarentena',
      headerName: 'Id',
      width: 80
    },
    {
      field: 'numeroPlaca',
      headerName: 'Placa',
      width: 330
    },
    {
      field: 'articulo',
      headerName: 'Articulo',
      width: 280
    }
  ]

  const handleView = (row: IBmConteoResponseDto) => {
    console.log(row)
    dispatch(setBmPlacaCuarentenaSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudBmPlacaCuarentena(2))
    dispatch(setVerBmPlacaCuarentenaActive(true))
  }

  const handleSet = (row: IBmConteoResponseDto) => {
    dispatch(setBmPlacaCuarentenaSeleccionado(row))
  }
  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }
  const handleClick = (row: any) => {
    handleSet(row.row)
  }
  const handleAdd = () => {
    const defaultValues = {
      codigoPlacaCuarentena: 0,
      numeroPlaca: '',
      Articulo: ''
    }

    dispatch(setBmPlacaCuarentenaSeleccionado(defaultValues))

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudBmPlacaCuarentena(1))
    dispatch(setVerBmPlacaCuarentenaActive(true))
  }
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [viewTable, setViewTable] = useState(false)
  const [data, setData] = useState<IBmPlacaCuarentenaResponseDto[]>([])

  const { verBmPlacaCuarentenaActive = false } = useSelector((state: RootState) => state.bmPlacaCuarentena)

  const handleViewTree = () => {
    setViewTable(false)
    refreshData()
  }

  const refreshData = async () => {
    setLoading(true)

    const responsePlacas = await ossmmasofApi.get<any>('/Bm1/GetPlacas')
    console.log('responsePlacas', responsePlacas.data.data)
    if (responsePlacas.data.isValid && responsePlacas.data.data != null) {
      dispatch(setListPlacas(responsePlacas.data.data))
    } else {
      dispatch(setListPlacas([]))
    }

    const responseAll = await ossmmasofApi.get<any>('/BmPlacaCuarentena/GetAll')
    console.log(responseAll.data)
    const data = responseAll.data.data
    if (responseAll.data.isValid && responseAll.data.data != null) {
      setData(responseAll.data.data)
    } else {
      setData([])
    }

    setLoading(false)
  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      const responsePlacas = await ossmmasofApi.get<any>('/Bm1/GetPlacas')
      console.log('responsePlacas', responsePlacas.data.data)
      if (responsePlacas.data.isValid && responsePlacas.data.data != null) {
        dispatch(setListPlacas(responsePlacas.data.data))
      } else {
        dispatch(setListPlacas([]))
      }

      const responseAll = await ossmmasofApi.get<any>('/BmPlacaCuarentena/GetAll')
      console.log(responseAll.data)
      const data = responseAll.data.data
      if (responseAll.data.isValid && responseAll.data.data != null) {
        setData(responseAll.data.data)
      } else {
        setData([])
      }

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verBmPlacaCuarentenaActive])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Placas en Cuarentena' />

        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Agregar'>
              <IconButton color='primary' size='small' onClick={() => handleAdd()}>
                <Icon icon='ci:add-row' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Refrescar'>
              <IconButton size='small' color='primary' onClick={() => handleViewTree()}>
                <Icon icon='fluent:table-24-regular' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>

        {viewTable ? (
          <div></div>
        ) : loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Box sx={{ height: 500 }}>
            <DataGrid
              getRowId={row => row.codigoPlacaCuarentena}
              columns={columns}
              rows={data}
              onRowDoubleClick={row => handleDoubleClick(row)}
              onRowClick={row => handleClick(row)}
            />
          </Box>
        )}
      </Card>

      <DatePickerWrapper>
        <DialogBmPlacaCuarentenaInfo popperPlacement={popperPlacement} />
      </DatePickerWrapper>
    </Grid>
  )
}

export default PlacasCuarentenaList
