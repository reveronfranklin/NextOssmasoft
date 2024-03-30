// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel} from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

//import { DataGridPro } from '@mui/x-data-grid-pro';

// ** ThirdParty Components
//import axios from 'axios'
import toast from 'react-hot-toast'

// ** Custom Components
//import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Tooltip,IconButton, TextField, Grid, Toolbar, CardContent } from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner';

import { useDispatch } from 'react-redux'
import { NumericFormat } from 'react-number-format'
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import { IPreAsignacionesDetalleGetDto } from 'src/interfaces/Presupuesto/PreAsignacionesDetalle/PreAsignacionesDetalleGetDto'
import { setOperacionCrudPreAsignacionesDetalle, setPreAsignacionesDetalleSeleccionado, setTotalMonto, setVerPreAsignacionesDetalleActive } from 'src/store/apps/pre-asignaciones-detalle'
import { IPreAsignacionesDetalleFilterDto } from 'src/interfaces/Presupuesto/PreAsignacionesDetalle/PreAsignacionesDetalleFilterDto'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DialogPreAsignacionesDetalleInfo from '../views/DialogPreAsignacionesDetalleInfo'
import { ReactDatePickerProps } from 'react-datepicker'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/


type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar && row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.denominacionCargo? row.descripcionTipoCargo : 'John Doe')}
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
interface CellType {
  row: IPreAsignacionesDetalleGetDto
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
  const [rows, setRows] = useState<IPreAsignacionesDetalleGetDto[]>([])
  const [allRows, setAllRows] = useState<IPreAsignacionesDetalleGetDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')


  function loadServerRows(currentPage: number, data: IPreAsignacionesDetalleGetDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }
  const dispatch = useDispatch();
  const {preAsignacionesSeleccionado} = useSelector((state: RootState) => state.preAsignaciones)
  const {verPreAsignacionesDetalleActive,totalMonto} = useSelector((state: RootState) => state.preAsignacionesDetalle)

  const columns: any = [
    {
      flex: 0.05,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <IconButton size='small' onClick={() => handleView(row)}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>


        </Box>
      )
    },
    {
      with:100,
       headerName: 'Fecha',
       field: 'Fecha',
       renderCell: (params: GridRenderCellParams) => (
         <Typography variant='body2' sx={{ color: 'text.primary' }}>
           {dayjs(params.row.fechaDesembolsoString).format('DD/MM/YYYY') }
         </Typography>
       )
     },

    {
      flex: 0.25,
      minWidth: 290,
      field: 'notas',
      headerName: 'Notas',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params


        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.notas}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.notas}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.075,
      minWidth: 15,
      headerName: 'Monto',
      field: 'monto',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.monto}
        </Typography>
      )
    },







  ]

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(blob, "data.xlsx");
};
  const handleView=  (row : IPreAsignacionesDetalleGetDto)=>{

    console.log('IPreAsignacionesDetalleGetDto',row)
    dispatch(setPreAsignacionesDetalleSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreAsignacionesDetalle(2));
    dispatch(setVerPreAsignacionesDetalleActive(true))


  }

  const fetchTableData = useCallback(
    async (filter:IPreAsignacionesDetalleFilterDto) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);


      const responseAll= await ossmmasofApi.post<any>('/PreAsignacionesDetalle/GetAllByAsignacion',filter);


      if(responseAll.data.data){
        setAllRows(responseAll.data.data);
        setTotal(responseAll.data.data.length);
        setRows(loadServerRows(page, responseAll.data.data))
        const suma = responseAll.data.data.reduce((anterior:any, actual:any) => anterior + (actual.monto), 0);
        dispatch(setTotalMonto(suma));
        setMensaje('')
      }else{
        setTotal(0)
        setAllRows([]);
        setRows([]);
        dispatch(setTotalMonto(0));
        setMensaje('')
      }






      setLoading(false);


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )



  useEffect(() => {
    const filter:IPreAsignacionesDetalleFilterDto={
      codigoAsignacion :preAsignacionesSeleccionado.codigoAsignacion,
      CodigoAsignacionDetalle:0,
      codigoPresupuesto:0
    }

    if(preAsignacionesSeleccionado && preAsignacionesSeleccionado.codigoAsignacion!=null){
      filter.codigoPresupuesto=preAsignacionesSeleccionado.codigoPresupuesto;
    }
    fetchTableData(filter);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreAsignacionesDetalleActive,preAsignacionesSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='fechaDesembolsoString' ||
         sortColumn==='notas')
      {

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
    setRows(loadServerRows(newPage, allRows))

  }
  const handleOnCellEditCommit=async(row:any)=>{
    const updateDto :IUpdateFieldDto={
      id:row.id,
      field:row.field,
      value:row.value
    }

    if(row.field=='monto'){
      if(row.value<=0){
        toast.success('Monto debe ser mayor a cero(0)')

        return;
      }
      for (const i of allRows) {
        if (i.monto == row.id) {
         i.monto = row.value;
        }
       }

    }


    const responseAll= await ossmmasofApi.post<any>('/PreAsignacionesDetalle/UpdateField',updateDto);
    console.log(responseAll);
  }

  const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


      const defaultValues:IPreAsignacionesDetalleGetDto = {
        codigoAsignacionDetalle:0,
        codigoAsignacion :preAsignacionesSeleccionado.codigoAsignacion,
        fechaDesembolso: null,
        fechaDesembolsoString:'',
        fechaDesembolsoObj :null,
        monto:0,
        notas:'',
        searchText:''

      }


      dispatch(setPreAsignacionesDetalleSeleccionado(defaultValues))
      dispatch(setOperacionCrudPreAsignacionesDetalle(1));
      dispatch(setVerPreAsignacionesDetalleActive(true))


  }

  return (
    <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Desembolsos
          </Typography>

        </CardContent>
      {
        !loading ?

        <Grid m={2} pt={3}  item justifyContent="flex-end">
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
          <Tooltip title='Agregar Desembolso'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Descargar'  >
          <IconButton  color='primary' size='small' onClick={() => exportToExcel()}>
            <Icon icon='ci:download' fontSize={20} />
            </IconButton>
          </Tooltip>




          <NumericFormat
            sx={{ml:2 ,typography: 'body1' }}
            label='Total Desembolso:'
            disabled
            customInput={TextField}
            value={totalMonto} decimalSeparator="," decimalScale={2} thousandSeparator="."
          />

          </Toolbar>

        </Grid>

        : <Typography>{mensaje}</Typography>
      }

     { loading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (
        <DataGrid

        getRowHeight={() => 'auto'}
        autoHeight
        pagination
        getRowId={(row) => row.codigoAsignacionDetalle}
        rows={rows}
        rowCount={total}
        columns={columns}
        pageSize={pageSize}
        sortingMode='server'

        paginationMode='server'
        onSortModelChange={handleSortModel}

        onPageChange={handlePageChange}
        onCellEditCommit={row =>handleOnCellEditCommit(row)}


        //onPageChange={newPage => setPage(newPage)}
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
              <DialogPreAsignacionesDetalleInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Card>
  )
}

export default TableServerSide
