// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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

// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner'

import { useDispatch } from 'react-redux'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { IFilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-presupuesto'

import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'
import { setPreSaldoDisponibleSeleccionado, setVerPreSaldoDisponibleActive } from 'src/store/apps/pre-saldo-disponible'

/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/

type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column

/*const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}*/

const ListSaldoDisponibleTableServerSide = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IListIcpPucConDisponible[]>([])
  const [allRows, setAllRows] = useState<IListIcpPucConDisponible[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaSolicitudString')

  function loadServerRows(currentPage: number, data: IListIcpPucConDisponible[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }
  const dispatch = useDispatch()

  const { listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)

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
    console.log('IListIcpPucConDisponible', row)
    dispatch(setPreSaldoDisponibleSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setVerPreSaldoDisponibleActive(false))
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }

  const fetchTableData = useCallback(
    async (filter: IFilterPrePresupuestoDto) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('')
      setLoading(true)

      const responseAll = await ossmmasofApi.post<any>('/PreVSaldos/GetListIcpPucConDisponible', filter)

      console.log(responseAll.data.data)

      if (responseAll.data.data) {
        setAllRows(responseAll.data.data)
        setTotal(responseAll.data.data.length)
        setRows(loadServerRows(page, responseAll.data.data))
        setMensaje('')
        console.log(rows)
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
    const filter: IFilterPrePresupuestoDto = {
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    if (listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto != null) {
      filter.codigoPresupuesto = listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    fetchTableData(filter)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (
        sortColumn === 'codigoIcpConcat' ||
        sortColumn === 'codigoPucConcat' ||
        sortColumn === 'denominacionIcp' ||
        sortColumn === 'denominacionPuc' ||
        sortColumn === 'denominacionFinanciado'
      ) {
        const dataAsc = temp.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
        const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
        setRows(loadServerRows(page, dataToFilter))
      }

      //fetchTableData(newModel[0].sort, newModel[0].field,fechaDesde,fechaHasta,tiposNominaSeleccionado.codigoTipoNomina,conceptoSeleccionado,personaSeleccionado.codigoPersona);
    } else {
      setSort('asc')
      setSortColumn('codigoIcpConcat')
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
          getRowId={row => row.codigoSaldo}
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
          onRowDoubleClick={row => handleDoubleClick(row)}
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
    </Card>
  )
}

export default ListSaldoDisponibleTableServerSide
