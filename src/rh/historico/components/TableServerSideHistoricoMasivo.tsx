// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel} from '@mui/x-data-grid'

//import { DataGridPro } from '@mui/x-data-grid-pro';

// ** ThirdParty Components
//import axios from 'axios'

// ** Custom Components
//import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { IHistoricoMovimiento } from 'src/interfaces/rh/I-historico-movimientoDto'
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Toolbar, Tooltip } from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos'
import { IPersonaFilterDto } from 'src/interfaces/rh/i-filter-persona'
import Spinner from 'src/@core/components/spinner';
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import Icon from 'src/@core/components/icon'

const MAX_RANGE_MESSAGE = 'El rango de fechas no puede ser mayor a un año.'
const MASIVO_QUERY_TYPE = 'MASIVO'
const MASIVO_EXCEL_QUERY_TYPE = 'MASIVO_EXCEL'

const isDateRangeGreaterThanOneYear = (desde: Date, hasta: Date) => {
  const maxHasta = new Date(desde)
  maxHasta.setFullYear(maxHasta.getFullYear() + 1)

  return hasta > maxHasta
}



/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/
interface FilterHistorico {

    desde: Date
    hasta: Date
    tipoQuery:string;
    codigoTipoNomina:IListTipoNominaDto[]
    codigoPersona:number
    codigoConcepto:IListConceptosDto[]
    page:number,
    pageSize:number
    tipoSort:SortType;
    sortColumn:string;
    codigoProceso:number;
}

type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.nombre? row.apellido : 'John Doe')}
      </CustomAvatar>
    )
  }
}

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
    headerName: 'Nomina',
    field: 'tipoNomina',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.tipoNomina}
      </Typography>
    )
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'full_Name',
    headerName: 'Nombre',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params


      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.nombre}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.apellido}
            </Typography>
          </Box>
        </Box>
      )
    }
  },


  {
    flex: 0.125,
    minWidth: 15,
    headerName: 'Fecha',
    field: 'fechaNomina',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {dayjs(params.row.fechaNomina).format('DD/MM/YYYY') }
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 15,
    headerName: 'Dpto',
    field: 'unidadEjecutora',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.unidadEjecutora}
      </Typography>
    )
  },
  {
    flex: 0.125,
    minWidth: 110,
    field: 'sueldo',
    headerName: 'Sueldo',
    editable: true,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.sueldo}
      </Typography>
    )
  },
  {
    flex: 0.125,
    field: 'codigo',
    minWidth: 15,
    headerName: 'Cod Concepto',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.codigo}
      </Typography>
    )
  },
  {
    flex: 0.175,
    field: 'denominacion',
    minWidth: 150,
    headerName: 'Concepto',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.denominacion}
      </Typography>
    )
  },
  ,
  {
    flex: 0.125,
    minWidth: 110,
    field: 'monto',
    headerName: 'Monto',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.monto}
      </Typography>
    )
  },
]

const TableServerSideHistoricoMasivo = () => {
  const {fechaDesde,fechaHasta,tiposNominaSeleccionado=[] as IListTipoNominaDto[],conceptoSeleccionado=[] as IListConceptosDto[]} = useSelector((state: RootState) => state.nomina)

  // ** State
  const [page, setPage] = useState(0)
  
  //const [ setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IHistoricoMovimiento[]>([])
  const [allRows, setAllRows] = useState<IHistoricoMovimiento[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [openExcelDialog, setOpenExcelDialog] = useState(false)
  const [excelDesde, setExcelDesde] = useState<Date>(fechaDesde)
  const [excelHasta, setExcelHasta] = useState<Date>(fechaHasta)
  const [excelTiposNomina, setExcelTiposNomina] = useState<IListTipoNominaDto[]>([])
  const [excelConceptos, setExcelConceptos] = useState<IListConceptosDto[]>([])
  const [excelTiposNominaOptions, setExcelTiposNominaOptions] = useState<IListTipoNominaDto[]>([])
  const [excelConceptosOptions, setExcelConceptosOptions] = useState<IListConceptosDto[]>([])
  const [excelLoading, setExcelLoading] = useState(false)
  const [excelMessage, setExcelMessage] = useState('')

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')

  const unwrapApiData = <T,>(responseData: any): T[] => {
    if (Array.isArray(responseData)) {
      return responseData
    }

    if (Array.isArray(responseData?.data)) {
      return responseData.data
    }

    return []
  }

  const formatDateInputValue = (date: Date) => dayjs(date).format('YYYY-MM-DD')

  const parseDateInputValue = (value: string) => new Date(`${value}T00:00:00`)

  const fetchExcelTiposNomina = useCallback(
    async (desde: Date, hasta: Date) => {
      const filterTipoNomina: IPersonaFilterDto = {
        codigoPersona: 0,
        desde,
        hasta,
        sinRestriccionFecha: true
      }

      const responseAllTipoNomina = await ossmmasofApiVertical.post<any>('/RhTipoNomina/GetTipoNominaByCodigoPersona', filterTipoNomina)
      const data = unwrapApiData<IListTipoNominaDto>(responseAllTipoNomina.data)

      setExcelTiposNominaOptions(data)

      return data
    },
    []
  )

  const fetchExcelConceptos = useCallback(
    async (desde: Date, hasta: Date, tiposNomina: IListTipoNominaDto[]) => {
      const filter: IPersonaFilterDto = {
        codigoPersona: 0,
        desde,
        hasta,
        sinRestriccionFecha: true,
        codigoTipoNomina: tiposNomina
          .filter(tipoNomina => tipoNomina.codigoTipoNomina > 0)
          .map(tipoNomina => ({ codigoTipoNomina: tipoNomina.codigoTipoNomina }))
      }

      const responseAll = await ossmmasofApiVertical.post<any>('/RhConceptos/GetConceptosByPersonas', filter)
      const data = unwrapApiData<IListConceptosDto>(responseAll.data)

      setExcelConceptosOptions(data)

      return data
    },
    []
  )

  const openExcelExportDialog = async () => {
    setExcelDesde(fechaDesde)
    setExcelHasta(fechaHasta)
    setExcelTiposNomina(tiposNominaSeleccionado)
    setExcelConceptos(conceptoSeleccionado)
    setExcelMessage('')
    setOpenExcelDialog(true)

    try {
      setExcelLoading(true)
      await fetchExcelTiposNomina(fechaDesde, fechaHasta)
      await fetchExcelConceptos(fechaDesde, fechaHasta, tiposNominaSeleccionado)
    } catch (error) {
      setExcelMessage('Error al cargar parámetros de descarga')
    } finally {
      setExcelLoading(false)
    }
  }

  const handleExcelDesdeChange = async (value: string) => {
    const desde = parseDateInputValue(value)
    setExcelDesde(desde)
    setExcelTiposNomina([])
    setExcelConceptos([])
    setExcelConceptosOptions([])

    try {
      setExcelLoading(true)
      setExcelMessage('')
      await fetchExcelTiposNomina(desde, excelHasta)
      await fetchExcelConceptos(desde, excelHasta, [])
    } catch (error) {
      setExcelMessage('Error al cargar parámetros de descarga')
    } finally {
      setExcelLoading(false)
    }
  }

  const handleExcelHastaChange = async (value: string) => {
    const hasta = parseDateInputValue(value)
    setExcelHasta(hasta)
    setExcelTiposNomina([])
    setExcelConceptos([])
    setExcelConceptosOptions([])

    try {
      setExcelLoading(true)
      setExcelMessage('')
      await fetchExcelTiposNomina(excelDesde, hasta)
      await fetchExcelConceptos(excelDesde, hasta, [])
    } catch (error) {
      setExcelMessage('Error al cargar parámetros de descarga')
    } finally {
      setExcelLoading(false)
    }
  }

  const handleExcelTiposNominaChange = async (value: IListTipoNominaDto[]) => {
    setExcelTiposNomina(value)
    setExcelConceptos([])

    try {
      setExcelLoading(true)
      setExcelMessage('')
      await fetchExcelConceptos(excelDesde, excelHasta, value)
    } catch (error) {
      setExcelMessage('Error al cargar conceptos')
    } finally {
      setExcelLoading(false)
    }
  }

  const fetchTableData = useCallback(
    async (desde:Date,hasta:Date,codigoTipoNomina:IListTipoNominaDto[],codigoConcepto:IListConceptosDto[]) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);
      setAllRows([]);
      setTotal(0);
      setRows([])
      
      //setLinkData('')

      if (isDateRangeGreaterThanOneYear(desde, hasta)) {
        setMensaje(MAX_RANGE_MESSAGE)
        setLoading(false)

        return
      }



      const filterHistorico:FilterHistorico={
        desde,
        hasta,
        tipoQuery: MASIVO_QUERY_TYPE,
        codigoTipoNomina,
        codigoConcepto,
        codigoPersona:0,
        page,
        pageSize,
        tipoSort:sort,
        sortColumn:sortColumn,
        codigoProceso:0
      }

      try {
        const responseAll = await ossmmasofApiVertical.post<any>('/RhHistoricoMovimiento/GetHistoricoFecha', filterHistorico)
        const historico = responseAll.data?.data ?? []
        const totalRecords = responseAll.data?.cantidadRegistros ?? historico.length

        setAllRows(historico)
        setTotal(totalRecords)
        setRows(historico)
        setMensaje(responseAll.data?.isValid === false ? responseAll.data?.message ?? 'Error al consultar histórico' : '')
      } catch (error) {
        setMensaje('Error al consultar histórico')
        setAllRows([])
        setTotal(0)
        setRows([])
      }

      //setLinkData(responseAll.data.linkData)

      setLoading(false);

    },
    [page, pageSize, sort, sortColumn]
  )


  useEffect(() => {
    setPage(0)
  }, [fechaDesde,fechaHasta,tiposNominaSeleccionado,conceptoSeleccionado])

  useEffect(() => {
    fetchTableData(fechaDesde,fechaHasta,tiposNominaSeleccionado,conceptoSeleccionado);


  }, [fetchTableData, fechaDesde,fechaHasta,tiposNominaSeleccionado,conceptoSeleccionado])


  const exportToExcel = async () => {
    if (isDateRangeGreaterThanOneYear(fechaDesde, fechaHasta)) {
      setMensaje(MAX_RANGE_MESSAGE)

      return
    }

    const filterHistorico: FilterHistorico = {
      desde: fechaDesde,
      hasta: fechaHasta,
      tipoQuery: MASIVO_QUERY_TYPE,
      codigoTipoNomina: tiposNominaSeleccionado,
      codigoConcepto: conceptoSeleccionado,
      codigoPersona: 0,
      page: 0,
      pageSize: 0,
      tipoSort: sort,
      sortColumn: sortColumn,
      codigoProceso: 0
    }

    try {
      setMensaje('')
      const responseAll = await ossmmasofApiVertical.post<any>('/RhHistoricoMovimiento/GetHistoricoFecha', filterHistorico)
      const exportRows = responseAll.data?.data ?? []

      const worksheet = XLSX.utils.json_to_sheet(exportRows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      })

      saveAs(blob, 'historicoMasivo.xlsx')
    } catch (error) {
      setMensaje('Error al exportar histórico')
    }
  }

  const exportExpandedToExcel = async () => {
    if (excelHasta < excelDesde) {
      setExcelMessage('Fecha Hasta no puede ser menor que Fecha Desde')

      return
    }

    const filterHistorico: FilterHistorico = {
      desde: excelDesde,
      hasta: excelHasta,
      tipoQuery: MASIVO_EXCEL_QUERY_TYPE,
      codigoTipoNomina: excelTiposNomina,
      codigoConcepto: excelConceptos,
      codigoPersona: 0,
      page: 0,
      pageSize: 0,
      tipoSort: sort,
      sortColumn: sortColumn,
      codigoProceso: 0
    }

    try {
      setExcelLoading(true)
      setExcelMessage('')
      const responseAll = await ossmmasofApiVertical.post<any>('/RhHistoricoMovimiento/GetHistoricoFecha', filterHistorico)
      const exportRows = responseAll.data?.data ?? []

      if (responseAll.data?.isValid === false) {
        setExcelMessage(responseAll.data?.message ?? 'Error al exportar histórico')

        return
      }

      if (!exportRows.length) {
        setExcelMessage('No hay datos para exportar')

        return
      }

      const worksheet = XLSX.utils.json_to_sheet(exportRows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      })

      saveAs(blob, 'historicoMasivoAmpliado.xlsx')
      setOpenExcelDialog(false)
    } catch (error) {
      setExcelMessage('Error al exportar histórico')
    } finally {
      setExcelLoading(false)
    }
  }

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='denominacion' ||
         sortColumn==='full_name' ||
         sortColumn ==='fechaNomina' ||
         sortColumn=== 'tipoNomina' ||
         sortColumn==='sueldo' ||
         sortColumn === 'monto')
      {

            const dataAsc = temp.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
            const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
            setRows(dataToFilter)
      }



      //fetchTableData(newModel[0].sort, newModel[0].field,fechaDesde,fechaHasta,tiposNominaSeleccionado.codigoTipoNomina,conceptoSeleccionado,personaSeleccionado.codigoPersona);

    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }



  const handleSearch = (value: string) => {


    setSearchValue(value)
    if(value=='') {
      setRows(allRows);
    }else{
      const newRows= allRows.filter((el) => el.searchText.toLowerCase().includes(value.toLowerCase()));
      setRows(newRows);

    }

    //fetchTableData(sort, value, sortColumn,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc)
  }

  const handlePageChange = (newPage:number) => {

    setPage(newPage)

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
            <Tooltip title='Descarga ampliada'>
              <IconButton color='primary' size='small' onClick={openExcelExportDialog}>
                <Icon icon='mdi:file-excel-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Grid>
      ) : (
        <Typography>{mensaje}</Typography>
      )}

      {mensaje && !loading ? (
        <Typography sx={{ mx: 4, mb: 4 }} color='error'>
          {mensaje}
        </Typography>
      ) : null}

      <Dialog open={openExcelDialog} onClose={() => setOpenExcelDialog(false)} fullWidth maxWidth='md'>
        <DialogTitle>Descarga ampliada</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='date'
                label='Desde'
                value={formatDateInputValue(excelDesde)}
                onChange={event => handleExcelDesdeChange(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='date'
                label='Hasta'
                value={formatDateInputValue(excelHasta)}
                onChange={event => handleExcelHastaChange(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={excelTiposNominaOptions}
                value={excelTiposNomina}
                id='autocomplete-excel-tipo-nomina'
                isOptionEqualToValue={(option, value) => option.codigoTipoNomina === value.codigoTipoNomina}
                getOptionLabel={option => `${option.codigoTipoNomina}-${option.descripcion}`}
                onChange={(event, value) => handleExcelTiposNominaChange(value)}
                renderInput={params => <TextField {...params} label='Tipo Nomina' />}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={excelConceptosOptions}
                value={excelConceptos}
                id='autocomplete-excel-concepto'
                isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo + value.codigoTipoNomina}
                getOptionLabel={option => `${option.codigo}-${option.codigoTipoNomina}-${option.denominacion}`}
                onChange={(event, value) => setExcelConceptos(value)}
                renderInput={params => <TextField {...params} label='Conceptos' />}
              />
            </Grid>
            {excelMessage ? (
              <Grid item xs={12}>
                <Typography color='error'>{excelMessage}</Typography>
              </Grid>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExcelDialog(false)} disabled={excelLoading}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={exportExpandedToExcel} disabled={excelLoading}>
            Descargar
          </Button>
        </DialogActions>
      </Dialog>

     { loading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (
        <DataGrid

        autoHeight
        pagination
        getRowId={(row) => row.codigoHistoricoNomina}
        rows={rows}
        rowCount={total}
        columns={columns}
        page={page}
        pageSize={pageSize}
        sortingMode='server'

        paginationMode='server'
        onSortModelChange={handleSortModel}

        //rowsPerPageOptions={[7, 10, 25, 50]}
        onPageChange={handlePageChange}

        //onPageChange={newPage => setPage(newPage)}
        components={{ Toolbar: ServerSideToolbar }}
        onPageSizeChange={newPageSize => {
          setPage(0)
          setPageSize(newPageSize)
        }}
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

export default TableServerSideHistoricoMasivo
