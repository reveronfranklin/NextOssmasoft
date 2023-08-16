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
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import { IRhRelacionCargoDto } from 'src/interfaces/rh/i-rh-relacion-cargo-dto'
import { setOperacionCrudRhRelacionCargo, setRhRelacionCargoSeleccionado, setVerRhRelacionCargoActive } from 'src/store/apps/rh-relacion-cargo'
import { IFilterByPreRelacionCargoDto } from 'src/interfaces/rh/i-filter-by-pre-relacion-cargo-dto'
import { fetchDataPersonas, fetchDataTipoNomina } from 'src/store/apps/rh/thunks'



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
        {getInitials(row.denominacionCargo? row.denominacionCargo : 'John Doe')}
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
  row: IRhRelacionCargoDto
}


const TableServerSideRhRelacionCargo = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IRhRelacionCargoDto[]>([])
  const [allRows, setAllRows] = useState<IRhRelacionCargoDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')


  function loadServerRows(currentPage: number, data: IRhRelacionCargoDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }
  const dispatch = useDispatch();

  const {preRelacionCargoSeleccionado} = useSelector((state: RootState) => state.preRelacionCargo)
  const {verRhRelacionCargoActive} = useSelector((state: RootState) => state.rhRelacionCargo)

  const columns: any = [
    {
      flex: 0.035,
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
      flex: 0.15,
      minWidth: 190,
      field: 'nombre',
      headerName: 'Persona',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params


        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.nombre}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.apellido }
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.035,
      minWidth: 80,
      headerName: 'Cedula',
      field: 'cedula',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.cedula}
        </Typography>
      )
    },

    {
      flex: 0.175,
      minWidth: 15,
      headerName: 'Cargo',
      field: 'denominacionCargo',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.denominacionCargo}
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


  ]

  const handleView=  (row : IRhRelacionCargoDto)=>{


    dispatch(setRhRelacionCargoSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhRelacionCargo(2));
    dispatch(setVerRhRelacionCargoActive(true))


  }

  const fetchTableData = useCallback(
    async (filter:IFilterByPreRelacionCargoDto) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);



      const responseAll= await ossmmasofApi.post<any>('/RhRelacionCargos/GetAllByRelacionCargo',filter);
      setAllRows(responseAll.data.data);
      setTotal(responseAll.data.data.length);
      setRows(loadServerRows(page, responseAll.data.data))
      setLoading(false);

      if( responseAll.data.data.length>0){
        setMensaje('')
      }else{
        setMensaje('')
      }

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )



  useEffect(() => {
    const filter:IFilterByPreRelacionCargoDto={
      codigoRelacionCargoPre:0

    }

    if(preRelacionCargoSeleccionado && preRelacionCargoSeleccionado.codigoRelacionCargo!=null){
      filter.codigoRelacionCargoPre=preRelacionCargoSeleccionado.codigoRelacionCargo;

    }
    fetchTableData(filter);
    fetchDataPersonas(dispatch);
    fetchDataTipoNomina(dispatch);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhRelacionCargoActive,preRelacionCargoSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='denominacionCargo' ||
         sortColumn==='nombre' ||
         sortColumn ==='apellido' ||
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



    const responseAll= await ossmmasofApi.post<any>('/RhRelacionCargos/UpdateField',updateDto);
    console.log(responseAll);
  }

  const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


      const defaultValues:IRhRelacionCargoDto = {
        codigoRelacionCargo:0,
        codigoCargo :preRelacionCargoSeleccionado.codigoCargo,
        denominacionCargo :preRelacionCargoSeleccionado.denominacionCargo,
        codigoPersona :0,
        nombre:'',
        apellido :'',
        cedula:0,
        sueldo :0,
        fechaFin:'1900-01-01',
        fechaIni:'1900-01-01',
        fechaIniObj:{year:'1900',month:'01',day:'01'},
        fechaFinObj:{year:'1900',month:'01',day:'01'},
        codigoRelacionCargoPre :preRelacionCargoSeleccionado.codigoRelacionCargo,
        searchText:''

      }


      dispatch(setRhRelacionCargoSeleccionado(defaultValues))
      dispatch(setOperacionCrudRhRelacionCargo(1));
      dispatch(setVerRhRelacionCargoActive(true))


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

export default TableServerSideRhRelacionCargo
