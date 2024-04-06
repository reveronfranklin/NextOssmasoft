// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'

// ** Icon Imports

//import { DataGridPro } from '@mui/x-data-grid-pro';

// ** ThirdParty Components
//import axios from 'axios'

// ** Custom Components
//import CustomChip from 'src/@core/components/mui/chip'

import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports

//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Tooltip, IconButton, Grid, Toolbar } from '@mui/material'
import Icon from 'src/@core/components/icon'

// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { ReactDatePickerProps } from 'react-datepicker'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo'
import { IRhTmpRetencionesCahDto } from 'src/interfaces/rh/RhTmpRetencionesCahDto'
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { IFilterFechaTipoNomina } from 'src/interfaces/rh/i-filter-fecha-tiponomina'

type SortType = 'asc' | 'desc' | undefined | null

interface CellType {
  row: IRhTmpRetencionesCahDto
}

const CahList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IRhTmpRetencionesCahDto[]>([])
  const [allRows, setAllRows] = useState<IRhTmpRetencionesCahDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')

  function loadServerRows(currentPage: number, data: IRhTmpRetencionesCahDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  //const dispatch = useDispatch()

  const columns = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: 'Id',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.id}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 95,
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
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoCahTrabajador}</Typography>
    },

    {
      flex: 0.4,
      minWidth: 125,

      field: 'montoCahPatrono',
      headerName: 'Patrono',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoCahPatrono}</Typography>
    },
    {
      flex: 0.4,
      minWidth: 125,

      field: 'montoTotalRetencion',
      headerName: 'Total',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.montoTotalRetencion}</Typography>
    }
  ]

  const {
    fechaDesde,
    fechaHasta,
    tipoNominaSeleccionado = {} as IListTipoNominaDto
  } = useSelector((state: RootState) => state.nomina)

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })

    saveAs(blob, 'data.xlsx')
  }

  const fetchTableData = useCallback(
    async (filter: IFilterFechaTipoNomina) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      console.log(popperPlacement)
      setMensaje('')
      setLoading(true)

      const responseAll = await ossmmasofApi.post<any>('/RhTmpRetencionesCah/GetRetencionesCah', filter)

      console.log('Data+++++++++', responseAll.data.data)
      if (responseAll.data.data != null) {
        setAllRows(responseAll.data.data)
        setTotal(responseAll.data.data.length)
        setRows(loadServerRows(page, responseAll.data.data))
        setMensaje('')
      } else {
        setTotal(0)
        setAllRows([])
        setRows([])
        setMensaje('')
      }

      setLoading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    const filter: IFilterFechaTipoNomina = {
      fechaDesde: dayjs(fechaDesde).format('DD/MM/YYYY'),
      fechaHasta: dayjs(fechaHasta).format('DD/MM/YYYY'),

      tipoNomina: tipoNominaSeleccionado.codigoTipoNomina
    }
    fetchTableData(filter)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaDesde, fechaHasta, tipoNominaSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (sortColumn === 'nombresApellidos' || sortColumn === 'unidadEjecutora') {
        const dataAsc = temp.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
        const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
        setRows(loadServerRows(page, dataToFilter))
      }

      //fetchTableData(newModel[0].sort, newModel[0].field,fechaDesde,fechaHasta,tiposNominaSeleccionado.codigoTipoNomina,conceptoSeleccionado,personaSeleccionado.codigoPersona);
    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value == '') {
      setRows(allRows)
    } else {
      const newRows = allRows.filter(el => el.searchText.toLowerCase().includes(value.toLowerCase()))
      setRows(newRows)
    }

    //fetchTableData(sort, value, sortColumn,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setRows(loadServerRows(newPage, allRows))
  }

  return (
    <Card>
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

      {loading ? (
        <Spinner sx={{ height: '100%' }} />
      ) : (
        <DataGrid
          getRowHeight={() => 'auto'}
          autoHeight
          pagination
          getRowId={row => row.id}
          rows={rows}
          rowCount={total}
          columns={columns}
          pageSize={pageSize}
          sortingMode='server'
          paginationMode='server'
          onSortModelChange={handleSortModel}
          onPageChange={handlePageChange}
          components={{ Toolbar: ServerSideToolbar }}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          componentsProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              printOptions: { disableToolbarButton: true },
              value: searchValue,
              clearSearch: () => handleSearch(''),
              onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
            }
          }}
        />
      )}

      <DatePickerWrapper>
        <DialogReportInfo></DialogReportInfo>
      </DatePickerWrapper>
    </Card>
  )
}

export default CahList
