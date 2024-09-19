import { useState, ChangeEvent, useRef } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Tooltip, IconButton, Grid, Toolbar } from '@mui/material'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner'
import { useDispatch } from 'react-redux'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { IFilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-presupuesto'
import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'
import { setPreSaldoDisponibleSeleccionado, setVerPreSaldoDisponibleActive } from 'src/store/apps/pre-saldo-disponible'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'

/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/

// type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column

/*const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}*/

const ListSaldoDisponibleTableServerSide = () => {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [allRows] = useState<IListIcpPucConDisponible[]>([])
  const [mensaje] = useState<string>('')
  const [loading] = useState(false)

  // const [sort, setSort] = useState<SortType>('asc')

  const [buffer, setBuffer] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

  const debounceTimeoutRef = useRef<any>(null)
  const [sortColumn, setSortColumn] = useState<string>('fechaSolicitudString')

  const dispatch = useDispatch()
  const { listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)
  const qc: QueryClient = useQueryClient()

  const filter: IFilterPrePresupuestoDto = {
    pageSize,
    page,
    searchText,
    CodigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto,
  }

  console.log('searchText', searchText)
  const query = useQuery({
    queryKey: ['listSaldoDisponible', pageSize, page, searchText],
    queryFn: () => ossmmasofApi.post<any>('/PreVSaldos/GetListIcpPucConDisponible', filter),
    initialData: () => {
      return qc.getQueryData(['listSaldoDisponible', pageSize, page, searchText])
    },
    staleTime: 1000 * 60,
    retry: 3
  }, qc)

  const rows = query?.data?.data?.data || []
  const rowCount = query?.data?.data?.cantidadRegistros || 0

  const columns: any = [
    {
      flex: 0.031,
      minWidth: 15,
      headerName: 'ICP',
      field: 'codigoIcpConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.codigoIcpConcat}
        </Typography>
      )
    },
    {
      flex: 0.041,
      minWidth: 15,
      headerName: 'Denominacion-ICP',
      field: 'denominacionIcp',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.denominacionIcp}
        </Typography>
      )
    },

    {
      flex: 0.031,
      minWidth: 15,
      headerName: 'PUC',
      field: 'codigoPucConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.codigoPucConcat}
        </Typography>
      )
    },
    {
      flex: 0.041,
      minWidth: 15,
      headerName: 'Denominacion-PUC',
      field: 'denominacionPUC',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.denominacionPuc}
        </Typography>
      )
    },
    {
      flex: 0.041,
      minWidth: 15,
      headerName: 'Financiado',
      field: 'denominacionFinanciado',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.denominacionFinanciado}
        </Typography>
      )
    },

    {
      flex: 0.031,
      minWidth: 15,
      headerName: 'Disponible',
      field: 'disponible',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.disponible}
        </Typography>
      )
    }
  ]

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

  const handleView = (row: IListIcpPucConDisponible) => {
    dispatch(setPreSaldoDisponibleSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setVerPreSaldoDisponibleActive(false))
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }

  const handleSortModel = (newModel: GridSortModel) => {

    // const temp = [...allRows]

    if (newModel.length) {
      // setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (
        sortColumn === 'codigoIcpConcat' ||
        sortColumn === 'codigoPucConcat' ||
        sortColumn === 'denominacionIcp' ||
        sortColumn === 'denominacionPuc' ||
        sortColumn === 'denominacionFinanciado'
      ) {
        // const dataAsc = temp.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))

        // const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()

        // setRows(loadServerRows(page, dataToFilter))
      }

      //fetchTableData(newModel[0].sort, newModel[0].field,fechaDesde,fechaHasta,tiposNominaSeleccionado.codigoTipoNomina,conceptoSeleccionado,personaSeleccionado.codigoPersona);
    } else {
      // setSort('asc')
      setSortColumn('codigoIcpConcat')
    }
  }

  //const handleSearch = (value: string) => {
    //setSearchValue(value)

    //if (value == '') {

      // setRows(allRows)
    //} else {

      // const newRows = allRows.filter(el => el.searchText.toLowerCase().includes(value.toLowerCase()))

      // setRows(newRows)
    //}

    //fetchTableData(sort, value, sortColumn,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc)
  //}

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSizeChange = (newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }

  const handleSearch = (value: string) => {
    if (value === '') {
      setSearchText('')
      setBuffer('')

      return
    }

    const newBuffer = value
    setBuffer(newBuffer)
    debouncedSearch(newBuffer)
  }

  const debouncedSearch = (currentBuffer : string) => {
    clearTimeout(debounceTimeoutRef.current)

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchText(currentBuffer)
    }, 2500)
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

      { query.isLoading ? ( <Spinner sx={{ height: '100%' }} /> ) : (
        <DataGrid
          autoHeight
          pagination
          getRowId={row => row.codigoSaldo}
          rows={rows}
          page={page}
          rowCount={rowCount}
          columns={columns}
          pageSize={pageSize}
          getRowHeight={() => 'auto'}
          sortingMode='server'
          paginationMode='server'
          onSortModelChange={handleSortModel}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={handleSizeChange}
          onPageChange={handlePageChange}
          onRowDoubleClick={row => handleDoubleClick(row)}
          components={{ Toolbar: ServerSideToolbar }}
          componentsProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              printOptions: { disableToolbarButton: true },
              value: buffer,
              clearSearch: () => handleSearch(''),
              onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
            }
          }}
        />
      )}
    </Card>
  )
}

export default ListSaldoDisponibleTableServerSide
