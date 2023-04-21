// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColTypeDef, GridColumns, GridRenderCellParams, GridSortModel} from '@mui/x-data-grid'

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
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { IFilterPresupuestoIpcPuc } from 'src/interfaces/Presupuesto/i-filter-presupuesto-ipc-puc'




/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/
interface FilterHistorico {

    desde: Date
    hasta: Date
    codigoTipoNomina:number
    codigoPersona:number
    codigoConcepto:string

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

const columns: GridColumns = [


  /*{
    flex: 0.035,
    minWidth: 15,
    headerName: 'Icp',
    field: 'codigoIcp',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.codigoIcp}
      </Typography>
    )
  },*/
  {
    flex: 0.125,
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
    flex: 0.065,
    minWidth: 15,
    headerName: 'IcpConcat',
    field: 'codigoIcpConcat',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.codigoIcpConcat}
      </Typography>
    )
  },
  {
    flex: 0.125,
    minWidth: 15,
    headerName: 'Denominacion Icp',
    field: 'denominacionIcp',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.denominacionIcp}
      </Typography>
    )
  },


  /*{
    flex: 0.035,
    minWidth: 90,
    field: 'codigoPuc',
    headerName: 'Puc',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.codigoPuc}
      </Typography>
    )
  },*/
  {
    flex: 0.055,
    minWidth: 110,
    field: 'codigoPucConcat',
    headerName: 'PucConcat',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.codigoPucConcat}
      </Typography>
    )
  },
  {
    flex: 0.125,
    field: 'denominacionPuc',
    minWidth: 110,
    headerName: 'denominacionPuc',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.denominacionPuc}
      </Typography>
    )
  },

  {
    flex: 0.055,
    minWidth: 110,
    field: 'presupuestadoFormat',
    headerName: 'Presupuestado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.presupuestadoFormat}
      </Typography>
    )
  },
  ,

  {
    flex: 0.055,
    minWidth: 110,
    field: 'disponibleFormat',
    headerName: 'Disponible',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.disponibleFormat}
      </Typography>
    )
  },

]

const TableServerSidePreVSaldo = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [linkData, setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IHistoricoMovimiento[]>([])
  const [mensaje, setMensaje] = useState<string>('')

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('full_name')

  const {preMtrDenominacionPucSeleccionado={} as IListPreMtrDenominacionPuc,preMtrUnidadEjecutoraSeleccionado={} as IListPreMtrUnidadEjecutora,listpresupuestoDtoSeleccionado={} as IListPresupuestoDto} = useSelector((state: RootState) => state.presupuesto)

  function loadServerRows(currentPage: number, data: IHistoricoMovimiento[]) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }


  const fetchTableData = useCallback(
    async (sort: SortType, q: string, column: string,codigoPresupuesto:number,codigoIPC:number,codigoPuc:number) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('...cargando')

      const filterPresupuesto:IFilterPresupuestoIpcPuc={codigoPresupuesto,codigoIPC,codigoPuc}


      const responseAll= await ossmmasofApi.post<any>('/PreVSaldos/GetAllByPresupuestoIpcPuc',filterPresupuesto);

      console.log('Respuesta llamando al saldo presupuesto+++++++++======>',responseAll)
      setTotal(responseAll.data.data.length);
      setRows(loadServerRows(page, responseAll.data.data))
      setLinkData(responseAll.data.linkData)

      if( responseAll.data.data.length>0){
        setMensaje('')
      }else{
        setMensaje('No Data')
      }

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize]
  )



  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc);

    //fetchTableExcel();
  }, [fetchTableData, listpresupuestoDtoSeleccionado, preMtrDenominacionPucSeleccionado, preMtrUnidadEjecutoraSeleccionado, searchValue, sort, sortColumn])

  const handleSortModel = (newModel: GridSortModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc)
    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn,listpresupuestoDtoSeleccionado.codigoPresupuesto,preMtrUnidadEjecutoraSeleccionado.codigoIcp,preMtrDenominacionPucSeleccionado.codigoPuc)
  }

  return (
    <Card>
      {
        mensaje.length===0 ?
          <Box  m={2} pt={3}>
          <Button variant='contained' href={linkData} size='large' >
            Descargar Todo {linkData}
          </Button>
        </Box>
        : <Typography  m={2} pt={3}>{mensaje}</Typography>
      }


      <DataGrid
        getRowHeight={() => 'auto'}
        autoHeight
        rowHeight={38}
        pagination
        getRowId={(row) => row.codigoSaldo}
        rows={rows}
        rowCount={total}
        columns={columns}
        checkboxSelection
        pageSize={pageSize}
        sortingMode='server'
        paginationMode='server'
        onSortModelChange={handleSortModel}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageChange={newPage => setPage(newPage)}
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
    </Card>
  )
}

export default TableServerSidePreVSaldo
