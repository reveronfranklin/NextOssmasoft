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
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Button } from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'
import Spinner from 'src/@core/components/spinner';
import dayjs from 'dayjs'




/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/
interface FilterHistorico {

    desde: Date
    hasta: Date
    codigoTipoNomina:IListTipoNominaDto[]
    codigoPersona:number
    codigoConcepto:IListConceptosDto[]
    page:number,
    pageSize:number
    tipoSort:SortType;
    sortColumn:string;
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

const TableServerSide = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [linkData, setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IHistoricoMovimiento[]>([])
  const [allRows, setAllRows] = useState<IHistoricoMovimiento[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')

  const {fechaDesde,fechaHasta,tiposNominaSeleccionado=[] as IListTipoNominaDto[],conceptoSeleccionado=[] as IListConceptosDto[],personaSeleccionado={} as IListSimplePersonaDto} = useSelector((state: RootState) => state.nomina)

  function loadServerRows(currentPage: number, data: IHistoricoMovimiento[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }


  const fetchTableData = useCallback(
    async (desde:Date,hasta:Date,codigoTipoNomina:IListTipoNominaDto[],codigoConcepto:IListConceptosDto[],codigoPersona:number) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}


      setMensaje('')
      setLoading(true);
      const filterHistorico:FilterHistorico={
        desde,
        hasta,
        codigoTipoNomina,
        codigoConcepto,
        codigoPersona,
        page,
        pageSize,
        tipoSort:sort,
        sortColumn:sortColumn
      }

      console.log('filetr historico',filterHistorico)
      const responseAll= await ossmmasofApi.post<any>('/HistoricoMovimiento/GetHistoricoFecha',filterHistorico);
      setAllRows(responseAll.data.data);
      setTotal(responseAll.data.data.length);

      setRows(loadServerRows(page, responseAll.data.data))

      setLinkData(responseAll.data.linkData)
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
    fetchTableData(fechaDesde,fechaHasta,tiposNominaSeleccionado,conceptoSeleccionado,personaSeleccionado.codigoPersona);

    //fetchTableExcel();
  }, [fetchTableData,fechaDesde,fechaHasta,tiposNominaSeleccionado,conceptoSeleccionado,personaSeleccionado])

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
      {
        !loading && linkData.length>0 ?
          <Box  m={2} pt={3}>
          <Button variant='contained' href={linkData} size='large' >
            Descargar Todo
          </Button>
        </Box>
        : <Typography>{mensaje}</Typography>
      }

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
        pageSize={pageSize}
        sortingMode='server'

        paginationMode='server'
        onSortModelChange={handleSortModel}

        //rowsPerPageOptions={[7, 10, 25, 50]}
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

export default TableServerSide
