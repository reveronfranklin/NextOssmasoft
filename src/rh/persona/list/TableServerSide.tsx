// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridSortModel} from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

//import { DataGridPro } from '@mui/x-data-grid-pro';

// ** ThirdParty Components
//import axios from 'axios'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports


//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Tooltip,IconButton, Grid, Toolbar, CardContent } from '@mui/material'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types


import Spinner from 'src/@core/components/spinner';

import { useDispatch } from 'react-redux'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'
import { fetchDataPersonasDto } from 'src/store/apps/rh/thunks'
import { monthByIndex } from 'src/utilities/ge-date-by-object';
import { ThemeColor } from 'src/@core/layouts/types'
import { useRouter } from 'next/router'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { setPersonaSeleccionado, setPersonasDtoSeleccionado } from 'src/store/apps/rh'
import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

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
interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: IListSimplePersonaDto
}
const personaStatusObj: UserStatusType = {
  Activo: 'success',
  Egresado: 'warning',
  Suspendido: 'secondary'
}


const TableServerSide = () => {

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const router = useRouter();
  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IListSimplePersonaDto[]>([])
  const [allRows, setAllRows] = useState<IListSimplePersonaDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')

  function loadServerRows(currentPage: number, data: IListSimplePersonaDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }
  const dispatch = useDispatch();

// ** renders client column
const renderClient = (row: IListSimplePersonaDto) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
      >
        {getInitials(row.nombre ? row.apellido : 'John Doe')}
      </CustomAvatar>
    )
  }
}
  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'nombre',
      headerName: 'Nombre',
      renderCell: ({ row }: CellType) => {
        const {nombre} = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
             {/*  <StyledLink href='/apps/rh/persona/view/overview/'>{nombre}</StyledLink> */}
              <Typography noWrap variant='caption'>
                {nombre}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'apellido',
      headerName: 'Apellido',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.apellido}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'cedula',
      headerName: 'Cedula',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.cedula}
          </Typography>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Nacionalidad',
      field: 'nacionalidad',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row.nacionalidad}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'dercripcionStatus',
      field: 'descripcionStatus',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row.descripcionStatus}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'dercripcionStatus',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.descripcionStatus}
            color={personaStatusObj[row.descripcionStatus]}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
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
    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(blob, "data.xlsx");
};
const handlerPersona= async   (value:any)=>{
  console.log('value en handlerPersona ++++++++',value.row)


  if(value && value.row.codigoPersona>0){

    const filter={codigoPersona:value.row.codigoPersona}
    const responseAll= await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona',filter);
    console.log('responseAll.data persona',responseAll.data)
    dispatch(setPersonaSeleccionado(responseAll.data));
    dispatch(setPersonasDtoSeleccionado(responseAll.data));
    console.log('responseAll.data persona',responseAll.data)
    router.replace("/apps/rh/persona/view/resumen/");
  }


}


  const fetchTableData = useCallback(
    async () => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);

      console.log(popperPlacement)

      const data= await fetchDataPersonasDto(dispatch);

      if(data?.data.isValid!==false){
        setAllRows(data?.data.data);
        setTotal(data?.data.data.length);
        setRows(loadServerRows(page, data?.data.data))
        setMensaje('')
      }else{
        setTotal(0)
        setAllRows([]);
        setRows([]);
        setMensaje('')
      }






      setLoading(false);


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )



  useEffect(() => {

    fetchTableData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='nombre' ||
         sortColumn==='apellido' ||
         sortColumn==='cedula')
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
      const newRows= allRows.filter((el) => el.searchText?.toLowerCase().includes(value.toLowerCase()) );
      setRows(newRows);


    }

    //fetchTableData(sort, value, sortColumn,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc)
  }

  const handlePageChange = (newPage:number) => {

    setPage(newPage)
    setRows(loadServerRows(newPage, allRows))

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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Personas
          </Typography>

        </CardContent>
      {
        !loading ?

        <Grid m={2} pt={3}  item justifyContent="flex-end">
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
         {/*  <Tooltip title='Agregar Desembolso'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Descargar'  >
          <IconButton  color='primary' size='small' onClick={() => exportToExcel()}>
            <Icon icon='ci:download' fontSize={20} />
            </IconButton>
          </Tooltip>



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
        getRowId={(row) => row.codigoPersona}
        rows={rows}
        rowCount={total}
        columns={columns}
        pageSize={pageSize}
        sortingMode='server'

        paginationMode='server'
        onSortModelChange={handleSortModel}

        onPageChange={handlePageChange}

        onRowDoubleClick={(row) => handlerPersona(row)}

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

               <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
        </DatePickerWrapper>
    </Card>
  )
}

export default TableServerSide
