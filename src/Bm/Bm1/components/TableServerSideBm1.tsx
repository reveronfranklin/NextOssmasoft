// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { ReactDatePickerProps } from 'react-datepicker'

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
import { Autocomplete, Button, CircularProgress, Divider, Grid, TextField } from '@mui/material'

// ** Types

import Spinner from 'src/@core/components/spinner'
import { Bm1GetDto } from 'src/interfaces/Bm/Bm1HetDto'
import DialogBM1Info from './DialogBM1Info'
import { setBm1Seleccionado, setVerBmBm1ActiveActive } from 'src/store/apps/bm'
import { useDispatch } from 'react-redux'
import { setListIcp } from 'src/store/apps/ICP'
import { setListIcpSeleccionado } from 'src/store/apps/bmConteo'
import { ICPGetDto } from 'src/interfaces/Bm/BmConteo/ICPGetDto'
import { setReportName, setVerReportViewActive } from 'src/store/apps/report'
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo'
import PickersDesdeHasta from 'src/rh/historico/individual/component/PickersDesdeHasta'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { Bm1FilterDto } from '../../../interfaces/Bm/Bm1FilterDto'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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

const columns: any = [
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'Unidad Trabajo',
    field: 'unidadTrabajo',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.unidadTrabajo}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'Responsable',
    field: 'responsableBien',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.responsableBien}
      </Typography>
    )
  },

  {
    flex: 0.08,
    minWidth: 15,
    headerName: 'Numero Placa',
    field: 'numeroPlaca',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.numeroPlaca}
      </Typography>
    )
  },
  {
    flex: 0.125,
    minWidth: 110,
    field: 'articulo',
    headerName: 'articulo',
    editable: true,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.articulo}
      </Typography>
    )
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: 'year',
    headerName: 'Año',
    editable: true,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.year}
      </Typography>
    )
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: 'month',
    headerName: 'Mes',
    editable: true,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.month}
      </Typography>
    )
  }
]

const TableServerSideBm1 = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** State
  const [page, setPage] = useState(0)
  const [linkData, setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<Bm1GetDto[]>([])
  const [allRows, setAllRows] = useState<Bm1GetDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [icps, setIcps] = useState<ICPGetDto[]>([])
  const [listIcpSeleccionadoLocal, setListIcpSeleccionadoLocal] = useState<ICPGetDto[]>([])
  const { fechaDesde, fechaHasta } = useSelector((state: RootState) => state.nomina)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('')

  const dispatch = useDispatch()

  function loadServerRows(currentPage: number, data: Bm1GetDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const handleView = (row: Bm1GetDto) => {
    dispatch(setBm1Seleccionado(row))
    dispatch(setVerBmBm1ActiveActive(true))
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }
  const handleIcp = (e: any, value: any) => {
    console.log('handler Icp', value)
    if (value != null) {
      setListIcpSeleccionadoLocal(value)
      dispatch(setListIcpSeleccionado(value))
    } else {
      const icp: ICPGetDto[] = [
        {
          codigoIcp: 0,
          unidadTrabajo: ''
        }
      ]
      setListIcpSeleccionadoLocal(icp)
      dispatch(setListIcpSeleccionado(icp))
    }
  }

  const crearBarCode = async () => {
    setLoading(true)

    //const responseAll= await ossmmasofApi.post<any>('/Bm1/GetByListIcp',listIcpSeleccionado);
    //console.log(responseAll)
    dispatch(setReportName('placas.pdf'))
    dispatch(setVerReportViewActive(true))
    setLoading(false)
  }

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
  const refresh = async () => {
    setLoading(true)

    setMensaje('')
    setLoading(true)
    setAllRows([])
    setTotal(0)
    setRows(loadServerRows(page, []))
    setLinkData('')

    const responseIcps = await ossmmasofApi.get<any>('/Bm1/GetListICP')
    dispatch(setListIcp(responseIcps.data.data))
    setIcps(responseIcps.data.data)

    console.log('listIcpSeleccionadoen fecth table data', listIcpSeleccionadoLocal)

    const filter: Bm1FilterDto = {
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      listIcpSeleccionado: listIcpSeleccionadoLocal
    }
    if (filter.listIcpSeleccionado.length > 0) {
      const responseAll = await ossmmasofApi.post<any>('/Bm1/GetByListIcp', filter)

      //const responseAll= await ossmmasofApi.get<any>('/Bm1/GetAll');
      console.log('responseAll fecth table data', responseAll)
      setAllRows(responseAll.data.data)
      setTotal(responseAll.data.data.length)

      setRows(loadServerRows(page, responseAll.data.data))

      setLinkData(responseAll.data.linkData)
      setLoading(false)
      console.log('responseAll.data.data bm1)', responseAll.data.data)
      if (responseAll.data.data.length > 0) {
        setMensaje('')
      } else {
        setMensaje('')
      }
    }

    setLoading(false)
  }

  const fetchTableData = useCallback(
    async (listIcpSelelected: ICPGetDto[], fechaDesde: Date, fechaHasta: Date) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('')
      setLoading(true)
      setAllRows([])
      setTotal(0)
      setRows(loadServerRows(page, []))
      setLinkData('')

      const responseIcps = await ossmmasofApi.get<any>('/Bm1/GetListICP')
      dispatch(setListIcp(responseIcps.data.data))
      setIcps(responseIcps.data.data)

      const filter: Bm1FilterDto = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        listIcpSeleccionado: listIcpSelelected
      }
      console.log('responseAll fecth table data filter', filter)
      if (filter.listIcpSeleccionado.length > 0) {
        const responseAll = await ossmmasofApi.post<any>('/Bm1/GetByListIcp', filter)

        //const responseAll= await ossmmasofApi.get<any>('/Bm1/GetAll');
        console.log('responseAll fecth table data', responseAll)
        setAllRows(responseAll.data.data)
        setTotal(responseAll.data.data.length)
        setRows(loadServerRows(page, responseAll.data.data))
        setLinkData(responseAll.data.linkData)
        if (responseAll.data.data.length > 0) {
          setMensaje('')
        } else {
          setMensaje('')
        }
      }

      setLoading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    fetchTableData(listIcpSeleccionadoLocal, fechaDesde, fechaHasta)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (
        sortColumn === 'unidadTrabajo' ||
        sortColumn === 'numeroPlaca' ||
        sortColumn === 'articulo' ||
        sortColumn === 'year' ||
        sortColumn === 'month' ||
        sortColumn === 'responsableBien'
      ) {
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
    <>
      <PickersDesdeHasta popperPlacement={popperPlacement} />
      <Card>
        {!loading ? (
          <Box m={2} pt={3}>
            {/*  <Button variant='contained' href={linkData} size='large' >
              Descargar Todo
            </Button> */}
            <Button variant='contained' onClick={exportToExcel} size='large'>
              Descargar Todo
            </Button>
            <Button size='large' onClick={crearBarCode} variant='outlined' sx={{ ml: 4 }}>
              {loading ? (
                <CircularProgress
                  sx={{
                    color: 'common.blue',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              ) : null}
              Ver Placas
            </Button>
            <Button size='large' onClick={refresh} variant='outlined' sx={{ ml: 4 }}>
              {loading ? (
                <CircularProgress
                  sx={{
                    color: 'common.blue',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              ) : null}
              Refrescar
            </Button>
          </Box>
        ) : (
          <Typography>{mensaje}</Typography>
        )}
        <Divider></Divider>

        <Grid item sm={12} xs={12}>
          <div>
            {icps && icps.length > 0 ? (
              <Autocomplete
                sx={{ ml: 5, mr: 2, mt: 2 }}
                multiple={true}
                options={icps}
                id='autocomplete-list-icp'
                isOptionEqualToValue={(option, value) => option.codigoIcp === value.codigoIcp}
                getOptionLabel={option => option.codigoIcp + '-' + option.unidadTrabajo}
                onChange={handleIcp}
                renderInput={params => <TextField {...params} label='ICP' />}
              />
            ) : (
              <div></div>
            )}
          </div>
        </Grid>

        {loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <DataGrid
            autoHeight
            pagination
            getRowId={row => row.codigoBien}
            rows={rows}
            rowCount={total}
            columns={columns}
            pageSize={pageSize}
            sortingMode='server'
            paginationMode='server'
            onSortModelChange={handleSortModel}
            onPageChange={handlePageChange}
            onRowDoubleClick={row => handleDoubleClick(row)}
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
      </Card>
      <DialogReportInfo></DialogReportInfo>
      <DialogBM1Info />
    </>
  )
}

export default TableServerSideBm1
