// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel} from '@mui/x-data-grid'

// ** Icon Imports
//import Icon from 'src/@core/components/icon'

//import { DataGridPro } from '@mui/x-data-grid-pro';

// ** ThirdParty Components
//import axios from 'axios'
//import toast from 'react-hot-toast'

// ** Custom Components
//import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

//import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

//import { Tooltip,IconButton, Grid, Toolbar } from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner';

//import { useDispatch } from 'react-redux'

//import { NumericFormat } from 'react-number-format'
//import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import { IPreAsignacionesGetDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesGetDto'
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { IPreAsignacionesFilterDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesFilterDto'

//import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
//import DialogPreAsignacionesInfo from './DialogPreAsignacionesInfo'
//import { useTheme } from '@mui/material/styles'
//import { ReactDatePickerProps } from 'react-datepicker'

//import { useTheme } from '@mui/material/styles'
//import { ReactDatePickerProps } from 'react-datepicker'


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


/* interface CellType {
  row: IPreAsignacionesGetDto
} */

const TableServerSideExcelCreate = () => {
  //const theme = useTheme()
  //const { direction } = theme
  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** State
  const [page, setPage] = useState(0)

  //const [linkData, setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows,setRows] = useState<IPreAsignacionesGetDto[]>([])
  const [allRows, setAllRows] = useState<IPreAsignacionesGetDto[]>([])

  //const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')


  function loadServerRows(currentPage: number, data: IPreAsignacionesGetDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }

  //const dispatch = useDispatch();


  const {
  preMtrUnidadEjecutoraSeleccionado={} as IListPreMtrUnidadEjecutora,
  listpresupuestoDtoSeleccionado={} as IListPresupuestoDto} =
  useSelector((state: RootState) => state.presupuesto)

 //const {refrescarTablaAsignaciones=false} = useSelector((state: RootState) => state.preAsignaciones)
 const {listPreAsignacionesCreate} = useSelector((state: RootState) => state.preAsignaciones)


  const columns: any = [
    {
      flex: 0.1,
      minWidth: 80,
      headerName: 'ICP',
      field: 'codigoIcpConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoIcpConcat}
        </Typography>
      )
    },
    {
      flex: 0.1,
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
      flex: 0.3,
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
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.presupuestado}
        </Typography>
      )
    },


  ]



  const fetchTableData = useCallback(
    async (filter:IPreAsignacionesFilterDto) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      //setMensaje('')
      setLoading(true);
      setRows(listPreAsignacionesCreate);
      setAllRows(listPreAsignacionesCreate);
      setTotal(listPreAsignacionesCreate.length);

      //setRows(loadServerRows(page, listPreAsignacionesCreate))


      console.log(filter);

      console.log(rows)




      setLoading(false);


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listPreAsignacionesCreate]
  )



  useEffect(() => {
    if(listpresupuestoDtoSeleccionado.codigoPresupuesto>0 ){


      const filter:IPreAsignacionesFilterDto={
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
        codigoIcp:preMtrUnidadEjecutoraSeleccionado.codigoIcp,
        codigoPuc:0,
        codigoAsignacion:0
      }

      fetchTableData(filter);

    }



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listpresupuestoDtoSeleccionado,listPreAsignacionesCreate])

  const handleSortModel = (newModel: GridSortModel) => {

    const temp  = [... allRows];

    if (newModel.length) {

      setSort(newModel[0].sort);
      setSortColumn(newModel[0].field);

      //const column: string=newModel[0].field.toString();

      if(sortColumn==='codigoPucConcat' ||
         sortColumn==='denominacionPuc' ||
         sortColumn ==='codigoPucConcat' ||
         sortColumn==='presupuestado')
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



  return (
    <Card>
      {/* {
        !loading ?

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


          </Toolbar>

        </Grid>

        : <Typography>{mensaje}</Typography>
      } */}

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

export default TableServerSideExcelCreate
