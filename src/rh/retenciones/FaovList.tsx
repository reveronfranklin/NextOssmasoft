import { Box, Card, CardActions, Grid, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
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
import { RhTmpRetencionesFaovDto } from 'src/interfaces/rh/RhTmpRetencionesFaovDto'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import Icon from 'src/@core/components/icon'

interface CellType {
  row: RhTmpRetencionesFaovDto
}

const FaovList = () => {
  // ** State

  const [linkData, setLinkData] = useState('')
  const [linkDataArlternative, SetLinkDataArlternative] = useState('')
  const [mensaje] = useState<string>('')
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
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoFaovTrabajador}</Typography>
    },

    {
      flex: 0.4,
      minWidth: 125,

      field: 'montoCahPatrono',
      headerName: 'Patrono',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoFaovPatrono}</Typography>
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

  const [data, setData] = useState<RhTmpRetencionesFaovDto[]>([])

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
      console.log(tipoNominaSeleccionado.codigoTipoNomina)
      if (tipoNominaSeleccionado && tipoNominaSeleccionado.codigoTipoNomina <= 0) return
      setData([])
      setLoading(true)
      setLinkData('')
      const filter: IFilterFechaTipoNomina = {
        fechaDesde: dayjs(fechaDesde).format('DD/MM/YYYY'),
        fechaHasta: dayjs(fechaHasta).format('DD/MM/YYYY'),
        tipoNomina: tipoNominaSeleccionado.codigoTipoNomina
      }
      const responseAll = await ossmmasofApi.post<any>('/RhTmpRetencionesFaov/GetRetencionesFaov', filter)

      if (responseAll.data?.data) {
        setData(responseAll.data?.data)

        setLinkData(responseAll.data.linkData)
        SetLinkDataArlternative(responseAll.data.linkDataArlternative)
        console.log(responseAll.data.linkDataArlternative)
      } else {
        setData([])
      }
      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaDesde, fechaHasta, tipoNominaSeleccionado])

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions>
          {!loading ? (
            <Grid m={2} pt={3} item justifyContent='flex-end'>
              <Toolbar sx={{ justifyContent: 'flex-start' }}>
                <Tooltip title='Descargar'>
                  <IconButton color='primary' size='small' onClick={() => exportToExcel()}>
                    <Icon icon='ci:download' fontSize={20} />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </Grid>
          ) : (
            <Typography>{mensaje}</Typography>
          )}

          <Box m={2} pt={3}>
            {linkData.length > 0 ? (
              <Link href={linkDataArlternative} target='_blank' download={linkDataArlternative}>
                Descargar Txt
              </Link>
            ) : (
              <div></div>
            )}
          </Box>
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

export default FaovList
