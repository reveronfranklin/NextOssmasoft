import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto'
import { setOperacionCrudPresupuesto, setPresupuesto, setVerPresupuestoActive } from 'src/store/apps/presupuesto'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import dayjs from 'dayjs'
import DialogPrePresupuestoInfo from 'src/presupuesto/maestro/views/DialogPrePresupuestoInfo'
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo'

import downloadReportByName from 'src/utilities/generateReport/download-report-by-name'

const PresupuestoList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const fechaActual = new Date()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const currentMonthString = '00' + monthByIndex(currentMonth).toString()

  const currentDay = new Date().getDate()
  const currentDayString = '00' + currentDay.toString()
  const defaultDate: IFechaDto = {
    year: currentYear.toString(),
    month: currentMonthString.slice(-2),
    day: currentDayString.slice(-2)
  }
  const defaultDateString = fechaActual.toISOString()

  interface CellType {
    row: IPresupuesto
  }

  const columns = [
    {
      flex: 0,
      minWidth: 40,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Reporte Resumen'>
            <IconButton size='small' onClick={() => reportView(row)}>
              <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 0,
      width: 130,
      field: 'codigoPresupuesto',
      headerName: 'Codigo',
    },
    {
      flex: 1,
      field: 'denominacion',
      width: 430
    },
    {
      flex: 0,
      width: 100,
      headerName: 'AÑo',
      field: 'ano',
    },
    {
      flex: 0,
      with: 100,
      headerName: 'Desde',
      field: 'fechaDesde',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.fechaDesde}
        </Typography>
      )
    },
    {
      flex: 0,
      with: 100,
      headerName: 'Hasta',
      field: 'fechaHasta',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.fechaHasta).format('DD/MM/YYYY')}
        </Typography>
      )
    }
  ]

  const handleView = (row: IPresupuesto) => {
    dispatch(setPresupuesto(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPresupuesto(2))
    dispatch(setVerPresupuestoActive(true))
  }

  const handleClick = (row: any) => {
    dispatch(setPresupuesto(row))
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }

  const reportView = async (row: IPresupuesto) => {
    setLoading(true)

    try {
      const filter = {
        codigoPresupuesto: row.codigoPresupuesto
      }

      const responseAll = await ossmmasofApi.post<any>('/ReportPreResumenSaldo/GeneratePdf', filter)
      const {data} = responseAll.data

      await downloadReportByName(data)
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    const defaultValues = {
      codigoPresupuesto: 0,
      denominacion: '',
      descripcion: '',
      ano: 0,
      numeroOrdenanza: '',
      extra1: '',
      extra2: '',
      extra3: '',
      fechaDesde: fechaActual,
      fechaDesdeString: defaultDateString,
      fechaDesdeObj: defaultDate,
      fechaHasta: fechaActual,
      fechaHastaString: defaultDateString,
      fechaHastaObj: defaultDate,
      fechaOrdenanza: fechaActual,
      fechaOrdenanzaString: defaultDateString,
      fechaOrdenanzaObj: defaultDate,
      fechaAprobacion: fechaActual,
      fechaAprobacionString: defaultDateString,
      fechaAprobacionObj: defaultDate
    }

    dispatch(setPresupuesto(defaultValues))

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudPresupuesto(1))
    dispatch(setVerPresupuestoActive(true))
  }

  const dispatch = useDispatch()

  const { verPresupuestoActive = false } = useSelector((state: RootState) => state.presupuesto)
  const [loading, setLoading] = useState(false)

  const [presupuestos, setPresupuestos] = useState([])

  useEffect(() => {
    const getPresupuestos = async () => {
      setLoading(true)

      const responseAll = await ossmmasofApi.get<any>('/PrePresupuesto/GetList')
      const data = responseAll.data

      setPresupuestos(data)

      setLoading(false)
    }
    getPresupuestos()
  }, [verPresupuestoActive])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Maestro de Presupuesto' />
        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Agregar'>
              <IconButton color='primary' size='small' onClick={() => handleAdd()}>
                <Icon icon='ci:add-row' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
        { loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Box sx={{ height: 500 }}>
            <DataGrid
              getRowId={row => row.codigoPresupuesto}
              columns={columns}
              rows={presupuestos}
              onRowClick={row => handleClick(row)}
              onRowDoubleClick={row => handleDoubleClick(row)}
            />
          </Box>
        )}
        <DatePickerWrapper>
          <DialogReportInfo></DialogReportInfo>
          <DialogPrePresupuestoInfo popperPlacement={popperPlacement} />
        </DatePickerWrapper>
      </Card>
    </Grid>
  )
}

export default PresupuestoList
