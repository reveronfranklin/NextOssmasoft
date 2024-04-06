import { Box, Card, CardActions, Typography } from '@mui/material'

import { Tooltip, IconButton, Grid, Toolbar } from '@mui/material'
import Icon from 'src/@core/components/icon'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
//import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports

import { DataGrid } from '@mui/x-data-grid'

import Spinner from 'src/@core/components/spinner'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { IFilterFechaTipoNomina } from 'src/interfaces/rh/i-filter-fecha-tiponomina'
import dayjs from 'dayjs'
import { RhTmpRetencionesIncesDto } from 'src/interfaces/rh/RhTmpRetencionesIncesDto'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface CellType {
  row: RhTmpRetencionesIncesDto
}

const InceList = () => {
  // ** State

  const columns = [
    {
      flex: 0.2,
      minWidth: 150,
      field: 'fechaNomina',
      headerName: 'Fecha ',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(row.fechaNomina).format('DD/MM/YYYY')}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 300,
      field: 'nombresApellidos',
      headerName: 'Nombre ',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.nombresApellidos}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 350,
      field: 'unidadEjecutora',
      headerName: 'Dpto',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.unidadEjecutora}</Typography>
    },

    {
      flex: 0.4,
      minWidth: 125,

      field: 'montoCahTrabajador',
      headerName: 'Trabajador',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoIncesTrabajador}</Typography>
    },

    {
      flex: 0.4,
      minWidth: 125,

      field: 'montoCahPatrono',
      headerName: 'Patrono',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoIncesPatrono}</Typography>
    },
    {
      flex: 0.4,
      minWidth: 125,

      field: 'montoTotalRetencion',
      headerName: 'Total',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoTotalRetencion}</Typography>
    }
  ]

  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<RhTmpRetencionesIncesDto[]>([])
  const {
    fechaDesde,
    fechaHasta,
    tipoNominaSeleccionado = {} as IListTipoNominaDto
  } = useSelector((state: RootState) => state.nomina)

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })

    saveAs(blob, 'data.xlsx')
  }
  useEffect(() => {
    const getData = async () => {
      if (tipoNominaSeleccionado && tipoNominaSeleccionado.codigoTipoNomina <= 0) return
      setLoading(true)
      const filter: IFilterFechaTipoNomina = {
        fechaDesde: dayjs(fechaDesde).format('DD/MM/YYYY'),
        fechaHasta: dayjs(fechaHasta).format('DD/MM/YYYY'),
        tipoNomina: tipoNominaSeleccionado.codigoTipoNomina
      }
      if (filter.tipoNomina) {
        setData([])
        const responseAll = await ossmmasofApi.post<any>('/RhTmpRetencionesInces/GetRetencionesInces', filter)
        console.log('responseAll', responseAll)
        setData(responseAll.data?.data)
      }

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaDesde, fechaHasta, tipoNominaSeleccionado])

  return (
    <Grid item xs={12}>
      <Card>
        {/* <CardHeader title='Comunicaciones' /> */}

        <CardActions>
          <Grid m={2} pt={3} item justifyContent='flex-end'>
            <Toolbar sx={{ justifyContent: 'flex-start' }}>
              <Tooltip title='Descargar'>
                <IconButton color='primary' size='small' onClick={() => exportToExcel()}>
                  <Icon icon='ci:download' fontSize={20} />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Grid>
        </CardActions>

        {loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Box sx={{ height: 450 }}>
            <DataGrid getRowId={row => row.id} columns={columns} rows={data} />
          </Box>
        )}
      </Card>
    </Grid>
  )
}

export default InceList
