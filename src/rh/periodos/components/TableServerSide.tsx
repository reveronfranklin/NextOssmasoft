// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

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
import { Tooltip, IconButton, Grid, Toolbar, CardContent } from '@mui/material'
import Icon from 'src/@core/components/icon'

// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner'

import { useDispatch } from 'react-redux'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { IRhPeriodosResponseDto } from 'src/interfaces/rh/Periodos/RhPeriodosResponseDto'
import { IRhPeriodosFilterDto } from 'src/interfaces/rh/Periodos/RhPeriodosFilterDto'
import DialogRhPeriodoInfo from '../views/DialogRhPeriodoInfo'
import { setOperacionCrudRhPeriodo, setRhPeriodoSeleccionado, setVerRhPeriodoActive } from 'src/store/apps/rh-periodo'
import { IRhPeriodosUpdate } from 'src/interfaces/rh/Periodos/RhPeriodosUpdate'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo'

/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/

type SortType = 'asc' | 'desc' | undefined | null

/*const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}*/
interface CellType {
  row: IRhPeriodosResponseDto
}

const TableServerSide = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IRhPeriodosResponseDto[]>([])
  const [allRows, setAllRows] = useState<IRhPeriodosResponseDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')

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

  function loadServerRows(currentPage: number, data: IRhPeriodosResponseDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }


    const onDownload = async (row: IRhPeriodosResponseDto) => {
      
      const filter = {
        CodigoTipoNomina: row.codigoTipoNomina,
        CodigoPeriodo: row.codigoPeriodo
      }
      await ossmmasofApi.post<any>('/ReportHistoricoNomina/GeneratePdf', filter)


    const link = document.createElement("a");
    link.download = `download.txt`;
    link.href = row.fileName;
    link.click();
  };
  const dispatch = useDispatch()

  const { rhTipoNominaSeleccionado } = useSelector((state: RootState) => state.rhTipoNomina)
  const { verRhPeriodoActive } = useSelector((state: RootState) => state.rhPeriodo)
  const columns: any = [
    {
      flex: 0.02,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Reporte Nomina'>
            <IconButton  
        
            size='small' onClick={() => 
              onDownload(row)}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 0.03,
      minWidth: 50,
      headerName: 'Id',
      field: 'codigoPeriodo',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoPeriodo}
        </Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 80,
      headerName: 'Fecha Nomina',
      field: 'fechaNominaString',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.fechaNominaString}
        </Typography>
      )
    },

    {
      flex: 0.1,
      minWidth: 80,
      headerName: 'Descripcion',
      field: 'descripcion',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcion}
        </Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 80,
      headerName: 'Periodo',
      field: 'descripcionPeriodo',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcionPeriodo}
        </Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 80,
      headerName: 'tipo Nomina',
      field: 'descripcionTipoNomina',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcionTipoNomina}
        </Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 80,
      headerName: 'Fecha Pre-Nomina',
      field: 'fechaPrenominaString',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.fechaPrenominaString.length == 0
            ? ''
            : params.row.fechaPrenominaString}
        </Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 80,
      headerName: 'Fecha Cierre',
      field: 'fechaCierreString',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.fechaCierreString.length == 0 ? '' : params.row.fechaCierreString}
        </Typography>
      )
    }
  ]

  /*const crearReporteNomina= async ()=>{


    setLoading(true);
    const filter = {
      CodigoTipoNomina:10,
      CodigoPeriodo:3821
      }
    const responseAll= await ossmmasofApi.post<any>('/ReportHistoricoNomina/GeneratePdf',filter);
    console.log(responseAll)

    dispatch(setReportName("placas.pdf"));
    dispatch(setVerReportViewActive(true))
    setLoading(false);

   }*/
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


/*   const handleReport = async (row: IRhPeriodosResponseDto) => {
    console.log('IPreAsignacionesDetalleGetDto', row)

    setLoading(true)

    const filter = {
      CodigoTipoNomina: row.codigoTipoNomina,
      CodigoPeriodo: row.codigoPeriodo
    }
    const responseAll = await ossmmasofApi.post<any>('/ReportHistoricoNomina/GeneratePdf', filter)
    console.log('handleReport HistoricoNomina', responseAll.data)
    const response = await ossmmasofApi.get <any>(`/Files/GetPdfFiles/${responseAll.data}`)
    //dispatch(setReportName(responseAll.data))
    //dispatch(setVerReportViewActive(true))

    setLoading(false)

    //dispatch(setPreAsignacionesDetalleSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    //dispatch(setOperacionCrudPreAsignacionesDetalle(2));
    //dispatch(setVerPreAsignacionesDetalleActive(true))
  }
 */
  const fetchTableData = useCallback(
    async (filter: IRhPeriodosFilterDto) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('')
      setLoading(true)

      const responseAll = await ossmmasofApi.post<any>('/RhPeriodosNomina/GetAll', filter)

      console.log(responseAll.data)
      if (responseAll.data) {
        setAllRows(responseAll.data)
        setTotal(responseAll.data.length)
        setRows(loadServerRows(page, responseAll.data))
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
    console.log(rhTipoNominaSeleccionado)
    const filter: IRhPeriodosFilterDto = {
      codigoTipoNomina: rhTipoNominaSeleccionado.codigoTipoNomina
    }
    fetchTableData(filter)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rhTipoNominaSeleccionado, verRhPeriodoActive])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (sortColumn === 'fechaNominaString' || sortColumn === 'descripcionPeriodo') {
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

  const handleView = (row: IRhPeriodosResponseDto) => {
    dispatch(setRhPeriodoSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhPeriodo(2))
    dispatch(setVerRhPeriodoActive(true))
  }
  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }
  const handleAdd = () => {
    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto

    const defaultValues: IRhPeriodosUpdate = {
      codigoPeriodo: 0,
      descripcion: '',
      codigoTipoNomina: 0,
      fechaNomina: fechaActual,
      fechaNominaString: defaultDateString,
      fechaNominaObj: defaultDate,
      periodo: 0,
      tipoNomina: ''
    }

    dispatch(setRhPeriodoSeleccionado(defaultValues))
    dispatch(setOperacionCrudRhPeriodo(1))
    dispatch(setVerRhPeriodoActive(true))
  }

  /*   const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


      const defaultValues:IPreAsignacionesDetalleGetDto = {
        codigoAsignacionDetalle:0,
        codigoAsignacion :preAsignacionesSeleccionado.codigoAsignacion,
        fechaDesembolso: null,
        fechaDesembolsoString:'',
        fechaDesembolsoObj :null,
        monto:0,
        notas:'',
        searchText:'',
        codigoIcpConcat:'',
        codigoPucConcat:''

      }


      dispatch(setPreAsignacionesDetalleSeleccionado(defaultValues))
      dispatch(setOperacionCrudPreAsignacionesDetalle(1));
      dispatch(setVerPreAsignacionesDetalleActive(true))


  } */

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          Periodos
        </Typography>
      </CardContent>
      {!loading ? (
        <Grid m={2} pt={3} item justifyContent='flex-end'>
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
            <Tooltip title='Agregar Periodo'>
              <IconButton color='primary' size='small' onClick={() => handleAdd()}>
                <Icon icon='ci:add-row' fontSize={20} />
              </IconButton>
            </Tooltip>
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
          getRowId={row => row.codigoPeriodo}
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

      <DatePickerWrapper>
        <DialogReportInfo></DialogReportInfo>
        <DialogRhPeriodoInfo popperPlacement={popperPlacement} />
      </DatePickerWrapper>
    </Card>
  )
}

export default TableServerSide
