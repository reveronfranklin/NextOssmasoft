import {
  Box,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'
import { useDispatch } from 'react-redux'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Spinner from 'src/@core/components/spinner'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { GridRenderCellParams } from '@mui/x-data-grid'

import { RhReporteNominaResumenResponseDto } from 'src/interfaces/rh/Recibos/RhReporteNominaResponseDto'
import dayjs from 'dayjs'
import { setReportName, setVerReportViewActive } from 'src/store/apps/report'
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo'

const RecibosList = () => {
  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      width: 130
    },

    {
      field: 'descripcionPeriodo',
      headerName: 'Periodo',
      width: 220
    },
    {
      flex: 0.2,
      minWidth: 80,
      headerName: 'Fecha Nomina',
      field: 'fechaNominaString',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.fechaNominaString).format('DD/MM/YYYY')}
        </Typography>
      )
    },
    {
      field: 'denominacion',
      headerName: 'Ofcina',
      width: 330
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 330
    }
  ]

  const handleView = async (row: RhReporteNominaResumenResponseDto) => {
    const filter = {
      codigoTipoNomina: row.codigoTipoNomina,
      codigoPeriodo: row.codigoPeriodo,
      codigoIcp: row.codigoIcp,
      codigoPersona: row.codigoPersona,
      sendEmail: sendEmail
    }
    const responseAll = await ossmmasofApi.post<any>('/RhVReciboPago/GeneratePdf', filter)
    console.log('reporte', responseAll)

    dispatch(setReportName(responseAll.data))
    dispatch(setVerReportViewActive(true))
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }

  const handleReport = async () => {
    const filter = {
      codigoTipoNomina: rhTipoNominaSeleccionado.codigoTipoNomina,
      codigoPeriodo: rhPeriodoSeleccionado.codigoPeriodo,
      codigoIcp: rhListOficinaSeleccionado.codigoIcp,
      sendEmail: sendEmail
    }
    if (filter.codigoTipoNomina == undefined) filter.codigoTipoNomina = 0
    if (filter.codigoPeriodo == undefined) filter.codigoPeriodo = 0
    if (filter.codigoIcp == undefined) filter.codigoIcp = 0
    const responseAll = await ossmmasofApi.post<any>('/RhVReciboPago/GeneratePdf', filter)
    console.log('reporte', responseAll)

    dispatch(setReportName(responseAll.data))
    dispatch(setVerReportViewActive(true))
  }
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [viewTable] = useState(false)
  const [data, setData] = useState<RhReporteNominaResumenResponseDto[]>([])

  const { rhTipoNominaSeleccionado } = useSelector((state: RootState) => state.rhTipoNomina)
  const { rhPeriodoSeleccionado } = useSelector((state: RootState) => state.rhPeriodo)
  const { rhListOficinaSeleccionado } = useSelector((state: RootState) => state.rhListOficina)
  const [sendEmail, setSendEmail] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendEmail(event.target.checked)
  }
  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      const filter = {
        codigoTipoNomina: rhTipoNominaSeleccionado.codigoTipoNomina,
        codigoPeriodo: rhPeriodoSeleccionado.codigoPeriodo,
        codigoIcp: rhListOficinaSeleccionado.codigoIcp
      }
      if (filter.codigoTipoNomina == undefined) filter.codigoTipoNomina = 0
      if (filter.codigoPeriodo == undefined) filter.codigoPeriodo = 0
      if (filter.codigoIcp == undefined) filter.codigoIcp = 0
      console.log(filter)
      if (rhTipoNominaSeleccionado.codigoTipoNomina > 0 && rhPeriodoSeleccionado.codigoPeriodo) {
        const responseAll = await ossmmasofApi.post<any>(
          '/RhReporteNominaHistorico/GetByPeriodoTipoNominaResumen',
          filter
        )
        console.log('Data resumen recibo', responseAll.data.data)
        if (responseAll.data.data != null) {
          setData(responseAll.data.data)
        } else {
          setData([])
        }
      }

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rhTipoNominaSeleccionado, rhPeriodoSeleccionado, rhListOficinaSeleccionado])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Recibos' />

        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Recibos por lote'>
              <IconButton size='small' color='primary' onClick={() => handleReport()}>
                <Icon icon='fluent:table-24-regular' fontSize={20} />
              </IconButton>
            </Tooltip>
            <FormControlLabel
              control={
                <Checkbox checked={sendEmail} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
              }
              label='Send Email'
            />
          </Box>
        </CardActions>

        {viewTable ? (
          <div></div>
        ) : loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Box sx={{ height: 500 }}>
            <DataGrid
              getRowId={row => row.id}
              columns={columns}
              rows={data}
              onRowDoubleClick={row => handleDoubleClick(row)}
            />
          </Box>
        )}
      </Card>

      <DatePickerWrapper>
        <DialogReportInfo></DialogReportInfo>
      </DatePickerWrapper>
    </Grid>
  )
}

export default RecibosList
