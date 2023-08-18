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
import { Tooltip,IconButton, TextField, Grid, Toolbar } from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner';

import { setListPreCargos } from 'src/store/apps/pre-cargo'
import { useDispatch } from 'react-redux'
import { IPreRelacionCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-get-dto'
import { IFilterPresupuestoIcp } from 'src/interfaces/Presupuesto/i-filter-presupuesto-icp'
import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { setOperacionCrudPreRelacionCargo, setPreRelacionCargoSeleccionado, setTotalSueldo, setTotalSueldoAnual, setVerPreRelacionCargoActive } from 'src/store/apps/pre-relacion-cargo'
import { NumericFormat } from 'react-number-format'
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'




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
  row: IPreRelacionCargosGetDto
}


const TableServerSide = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [linkData, setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IPreRelacionCargosGetDto[]>([])
  const [allRows, setAllRows] = useState<IPreRelacionCargosGetDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')


  function loadServerRows(currentPage: number, data: IPreRelacionCargosGetDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }
  const dispatch = useDispatch();
  const {listpresupuestoDtoSeleccionado,listpresupuestoDto} = useSelector((state: RootState) => state.presupuesto)
  const {icpSeleccionado} = useSelector((state: RootState) => state.icp)
  const {verPreRelacionCargoActive,totalSueldo,totalSueldoAnual} = useSelector((state: RootState) => state.preRelacionCargo)

  const columns: any = [
    {
      flex: 0.1,
      minWidth: 130,
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
      flex: 0.075,
      minWidth: 15,
      headerName: 'Año',
      field: 'ano',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.ano}
        </Typography>
      )
    },

    {
      flex: 0.25,
      minWidth: 290,
      field: 'denominacionCargo',
      headerName: 'Denominacion',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params


        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.denominacionCargo}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.descripcionTipoCargo}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 15,
      headerName: 'ICP-Concat',
      field: 'icpConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.icpConcat}
        </Typography>
      )
    },

    {
      flex: 0.175,
      minWidth: 15,
      headerName: 'ICP',
      field: 'denominacionIcp',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.denominacionIcp}
        </Typography>
      )
    },


    {
      flex: 0.075,
      minWidth: 15,
      headerName: 'Cargos',
      field: 'cantidad',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.cantidad}
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
          {new Intl.NumberFormat("de-DE").format(params.row.sueldo)}
        </Typography>
      )
    },

    {
      flex: 0.175,
      field: 'totalMensual',
      minWidth: 150,
      headerName: 'Mensual',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format(params.row.sueldo * params.row.cantidad)}
        </Typography>
      )
    },
    ,
    {
      flex: 0.125,
      minWidth: 110,
      field: 'totalAnual',
      headerName: 'Anual',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat("de-DE").format((params.row.sueldo * params.row.cantidad)*12)}
        </Typography>
      )
    },
  ]

  const handleView=  (row : IPreRelacionCargosGetDto)=>{


    dispatch(setPreRelacionCargoSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreRelacionCargo(2));
    dispatch(setVerPreRelacionCargoActive(true))


  }

  const fetchTableData = useCallback(
    async (filter:IFilterPresupuestoIcp) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);

      const responseAllCargos= await ossmmasofApi.post<any>('/PreCargos/GetAllByPresupuesto',filter);
      const dataCargos = responseAllCargos.data.data;

      dispatch(setListPreCargos(dataCargos));

      const responseAll= await ossmmasofApi.post<any>('/PreRelacionCargos/GetAllByPresupuesto',filter);


      if(responseAll.data.data){
        setAllRows(responseAll.data.data);
        setTotal(responseAll.data.data.length);
        setRows(loadServerRows(page, responseAll.data.data))
        const suma = responseAll.data.data.reduce((anterior:any, actual:any) => anterior + (actual.sueldo* actual.cantidad), 0);
        dispatch(setTotalSueldo(suma));
        const sumaAnual = responseAll.data.data.reduce((anterior:any, actual:any) => anterior + (actual.sueldo* actual.cantidad)*12, 0);
        dispatch(setTotalSueldoAnual(sumaAnual));
        setLinkData(responseAll.data.linkData)
        setMensaje('')
      }else{
        setTotal(0)
        setAllRows([]);
        setRows([]);
        dispatch(setTotalSueldo(0));
        dispatch(setTotalSueldoAnual(0));
        setLinkData('')
        setMensaje('')
      }






      setLoading(false);


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )



  useEffect(() => {
    const filter:IFilterPresupuestoIcp={
      codigoPresupuesto:0,
      codigoIcp:0
    }

    if(listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto!=null){
      filter.codigoPresupuesto=listpresupuestoDtoSeleccionado.codigoPresupuesto;
      if(icpSeleccionado && icpSeleccionado.codigoIcp!=null){
        filter.codigoIcp=icpSeleccionado.codigoIcp;
      }
    }else{
      filter.codigoPresupuesto==listpresupuestoDto[0].codigoPresupuesto;
      dispatch(setListpresupuestoDtoSeleccionado(listpresupuestoDto[0]));
    }
    fetchTableData(filter);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreRelacionCargoActive,listpresupuestoDtoSeleccionado,icpSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='denominacionCargo' ||
         sortColumn==='descripcionTipoCargo' ||
         sortColumn ==='descripcionTipoPersonal' ||
         sortColumn==='icpConcat')
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

    if(row.field=='sueldo'){
      if(row.value<=0){
        toast.success('Sueldo debe ser mayor a cero(0)')

        return;
      }
      for (const i of allRows) {
        if (i.codigoRelacionCargo == row.id) {
         i.sueldo = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoRelacionCargo == row.id) {
         i.sueldo = row.value;
        }
       }

    }
    if(row.field=='cantidad'){
      if(row.value<=0){
        toast.success('Cantidad de Cargos debe ser mayor a cero(0)')

        return;
      }
      for (const i of allRows) {
        if (i.codigoRelacionCargo == row.id) {
         i.cantidad = row.value;
        }
       }
       for (const i of rows) {
        if (i.codigoRelacionCargo == row.id) {
         i.cantidad = row.value;
        }
       }

    }


    const responseAll= await ossmmasofApi.post<any>('/PreRelacionCargos/UpdateField',updateDto);
    console.log(responseAll);
  }

  const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


      const defaultValues:IPreRelacionCargosGetDto = {
        codigoRelacionCargo:0,
        ano: 0,
        escenario: 0,
        codigoIcp: 0,
        denominacionIcp:'',
        codigoCargo:0,
        denominacionCargo: '',
        descripcionTipoCargo:'',
        descripcionTipoPersonal: '',
        cantidad: 0,
        sueldo: 0,
        compensacion: 0,
        prima: 0,
        otro: 0,
        extra1: '',
        extra2: '',
        extra3: '',
        codigoPresupuesto: 0,
        totalMensual: '',
        totalAnual: '',
        searchText:'',
        icpConcat:''

      }


      dispatch(setPreRelacionCargoSeleccionado(defaultValues))
      dispatch(setOperacionCrudPreRelacionCargo(1));
      dispatch(setVerPreRelacionCargoActive(true))


  }

  return (
    <Card>
      {
        !loading && linkData.length>0 ?

        <Grid m={2} pt={3}  item justifyContent="flex-end">
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title='Descargar'  >
            <IconButton  color='primary' size='small' href={linkData} >
            <Icon icon='ci:download' fontSize={20} />
            </IconButton>
          </Tooltip>


          <NumericFormat
            sx={{ml:2 ,typography: 'body1' }}
            label='Total Mensual:'
            disabled
            customInput={TextField}
            value={totalSueldo} decimalSeparator="," decimalScale={2} thousandSeparator="."
          />
         <NumericFormat
              sx={{ml:2 ,typography: 'body1' }}
              label='Total Anual:'
              disabled
              customInput={TextField}
              value={totalSueldoAnual} decimalSeparator="," decimalScale={2} thousandSeparator="."/>
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
        getRowId={(row) => row.codigoRelacionCargo}
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


    </Card>
  )
}

export default TableServerSide
