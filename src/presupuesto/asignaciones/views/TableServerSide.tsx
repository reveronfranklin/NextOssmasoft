// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel} from '@mui/x-data-grid'

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
import { Tooltip,IconButton, Grid, Toolbar } from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner';

import { useDispatch } from 'react-redux'

//import { NumericFormat } from 'react-number-format'
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import { IPreAsignacionesGetDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesGetDto'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { setOperacionCrudPreAsignaciones, setPreAsignacionesSeleccionado, setVerPreAsignacionesActive } from 'src/store/apps/pre-asignaciones'
import { IPreAsignacionesFilterDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesFilterDto'

import DialogPreAsignacionesInfo from './DialogPreAsignacionesInfo'
import { useTheme } from '@mui/material/styles'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IPreAsignacionesPlantillaDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesPlantilla'

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
        {getInitials(row.denominacionPuc? row.denominacionPuc : 'John Doe')}
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
  row: IPreAsignacionesGetDto
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
  const [rows, setRows] = useState<IPreAsignacionesGetDto[]>([])
  const [allRows, setAllRows] = useState<IPreAsignacionesGetDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')


  function loadServerRows(currentPage: number, data: IPreAsignacionesGetDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }
  const dispatch = useDispatch();


  const {preMtrDenominacionPucSeleccionado={} as IListPreMtrDenominacionPuc,
  preMtrUnidadEjecutoraSeleccionado={} as IListPreMtrUnidadEjecutora,
  listpresupuestoDtoSeleccionado={} as IListPresupuestoDto} =
  useSelector((state: RootState) => state.presupuesto)

  const {verPreAsignacionesActive=false} = useSelector((state: RootState) => state.preAsignaciones)


  const columns: any = [
    {
      flex: 0.05,
      minWidth: 90,
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
      flex: 0.2,
      minWidth: 80,
      headerName: 'Puc',
      field: 'codigoPucConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoPucConcat}
        </Typography>
      )
    },

    {
      flex: 0.25,
      minWidth: 290,
      field: 'denominacionPuc',
      headerName: 'Denominacion',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params


        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
   {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.denominacionPuc}
            </Typography>

            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 50,
      headerName: 'Presupuestado',
      field: 'presupuestado',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.presupuestado}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'ordinario',
      headerName: 'Ordinario',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(params.row.ordinario)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'coordinado',
      headerName: 'Coordinado',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(params.row.coordinado)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'laee',
      headerName: 'LAEE',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(params.row.laee)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'fides',
      headerName: 'FIDES',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(params.row.fides)}
        </Typography>
      )
    },

    {
      flex: 0.1,
      field: 'total',
      minWidth: 50,
      headerName: 'Total',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(+params.row.ordinario + +params.row.coordinado + +params.row.laee + +params.row.fides)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'totalDesembolso',
      headerName: 'Desembolso',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(params.row.totalDesembolso)}
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
const exportToExcelPlantilla = () => {

  console.log('allRows',allRows)

  const newArray  = allRows.map(function(item) {


    const plantilla:IPreAsignacionesPlantillaDto={
      codigoAsignacion:item.codigoAsignacion,
      codigoIcpConcat:item.codigoIcpConcat,
      denominacionIcp:item.denominacionPuc,
      codigoPucConcat:item.codigoPucConcat,
      denominacionPuc:item.denominacionPuc,
      presupuestado:item.presupuestado,
      ordinario:item.ordinario,
      coordinado:item.coordinado,
      laee:item.laee,
      fides:item.fides
    }



    return plantilla
  })
  console.log(newArray)
  const worksheet = XLSX.utils.json_to_sheet(newArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Buffer to store the generated Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, "data.xlsx");
};

  const handleView=  (row : IPreAsignacionesGetDto)=>{

    dispatch(setPreAsignacionesSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
   dispatch(setOperacionCrudPreAsignaciones(2));
   dispatch(setVerPreAsignacionesActive(true))


  }

  const fetchTableData = useCallback(
    async (filter:IPreAsignacionesFilterDto) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);

      const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/GetAll',filter);
      console.log(responseAll.data)

      if(responseAll.data.data){
        setAllRows(responseAll.data.data);
        setTotal(responseAll.data.data.length);
        setRows(loadServerRows(page, responseAll.data.data))

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
    if(listpresupuestoDtoSeleccionado.codigoPresupuesto>0){


      const filter:IPreAsignacionesFilterDto={
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
        codigoIcp:preMtrUnidadEjecutoraSeleccionado.codigoIcp,
        codigoPuc:preMtrDenominacionPucSeleccionado.codigoPuc,
        codigoAsignacion:0
      }
      fetchTableData(filter);

    }



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreAsignacionesActive,listpresupuestoDtoSeleccionado,preMtrUnidadEjecutoraSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='codigoPucConcat' ||
         sortColumn==='denominacionPuc' ||
         sortColumn ==='presupuestado' ||
         sortColumn==='ordinario')
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

    if(listpresupuestoDtoSeleccionado.presupuestoEnEjecucion){
      toast.success('Presupuestado en ejecucion, no puede  ser modificado')

      return;

    }
    if(row.field=='presupuestado'){
      if(row.value<=0){
        toast.success('Presupuestado debe ser mayor a cero(0)')

        return;
      }
      for (const i of allRows) {
        if (i.codigoAsignacion == row.id) {
         i.presupuestado = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoAsignacion == row.id) {
         i.presupuestado = row.value;
        }
       }

    }
    if(row.field=='ordinario'){
      if(row.value<=0){
        toast.success('Ordinario debe ser mayor a cero(0)')

        return;
      }
      for (const i of allRows) {
        if (i.codigoAsignacion == row.id) {
         i.ordinario = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoAsignacion == row.id) {
         i.ordinario = row.value;
        }
       }
    }
    if(row.field=='coordinado'){

      for (const i of allRows) {
        if (i.codigoAsignacion == row.id) {
         i.coordinado = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoAsignacion == row.id) {
         i.coordinado = row.value;
        }
       }
    }
    if(row.field=='fides'){

      for (const i of allRows) {
        if (i.codigoAsignacion == row.id) {
         i.fides = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoAsignacion == row.id) {
         i.fides = row.value;
        }
       }
    }
    if(row.field=='laee'){

      for (const i of allRows) {
        if (i.codigoAsignacion == row.id) {
         i.laee = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoAsignacion == row.id) {
         i.laee = row.value;
        }
       }
    }


    const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/UpdateField',updateDto);
    console.log(responseAll);
  }

  const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


    const defaultValues:IPreAsignacionesGetDto = {

      codigoAsignacion :0,
      codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      año :listpresupuestoDtoSeleccionado.ano,
      escenario:0,
      codigoIcp:0,
      codigoIcpConcat:'',
      DenominacionIcp:'',
      codigoPuc:0,
      codigoPucConcat:'',
      denominacionPuc:'',
      presupuestado:0,
      ordinario:0,
      coordinado:0,
      laee:0,
      fides:0,
      totalDesembolso:0,
      total:0,
      searchText:''

    }


      dispatch(setPreAsignacionesSeleccionado(defaultValues));
      dispatch(setOperacionCrudPreAsignaciones(1));
      dispatch(setVerPreAsignacionesActive(true))



  }

  const handleAddExcel=  ()=>{


    // Operacion Crud 1 = Crear titulo


    const defaultValues:IPreAsignacionesGetDto = {

      codigoAsignacion :0,
      codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      año :listpresupuestoDtoSeleccionado.ano,
      escenario:0,
      codigoIcp:0,
      codigoIcpConcat:'',
      DenominacionIcp:'',
      codigoPuc:0,
      codigoPucConcat:'',
      denominacionPuc:'',
      presupuestado:0,
      ordinario:0,
      coordinado:0,
      laee:0,
      fides:0,
      totalDesembolso:0,
      total:0,
      searchText:''

    }


      dispatch(setPreAsignacionesSeleccionado(defaultValues));
      dispatch(setOperacionCrudPreAsignaciones(3));
      dispatch(setVerPreAsignacionesActive(true))



  }

  return (
    <Card>
      {
        !loading ?

        <Grid m={2} pt={3}  item justifyContent="flex-end">
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Agregar Excel'>
            <IconButton  color='primary' size='small' onClick={() => handleAddExcel()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>


          <Tooltip title='Descargar'  >
          <IconButton  color='primary' size='small' onClick={() => exportToExcel()}>
            <Icon icon='ci:download' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Descargar Plantilla'  >
          <IconButton  color='primary' size='small' onClick={() => exportToExcelPlantilla()}>
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
        getRowId={(row) => row.codigoAsignacion}
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
              <DialogPreAsignacionesInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>

    </Card>

  )
}

export default TableServerSide
