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
//import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
//import { ThemeColor } from 'src/@core/layouts/types'

//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import
//import { getInitials } from 'src/@core/utils/get-initials'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Button, IconButton, Tooltip} from '@mui/material'


// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'



import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { IFilterPresupuestoIpcPuc } from 'src/interfaces/Presupuesto/i-filter-presupuesto-ipc-puc'
import { IPreVSaldo } from 'src/interfaces/Presupuesto/i-pre-vsaldo'
import { useDispatch } from 'react-redux'
import { setPreVSAldoSeleccionado } from 'src/store/apps/presupuesto'
import { setVerDetallePreVSaldoActive } from 'src/store/apps/presupuesto'
import DialogPreVSaldoInfo from 'src/views/pages/presupuesto/DialogPreVSaldoInfo'
import Spinner from 'src/@core/components/spinner';




/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/


type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column
/*const renderClient = (params: GridRenderCellParams) => {
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
}*/

interface CellType {
  row: IPreVSaldo
}



const defaultColumns = [
  {
    flex: 0.125,
    field: 'descripcionFinanciado',
    minWidth: 15,
    headerName: 'Financiado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.descripcionFinanciado}
      </Typography>
    )
  },
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
    flex: 0.125,
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
  {
    flex: 0.025,
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
  const [rows, setRows] = useState<IPreVSaldo[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();



  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('full_name')

  const {preMtrDenominacionPucSeleccionado={} as IListPreMtrDenominacionPuc,preMtrUnidadEjecutoraSeleccionado={} as IListPreMtrUnidadEjecutora,listpresupuestoDtoSeleccionado={} as IListPresupuestoDto} = useSelector((state: RootState) => state.presupuesto)


  const columns = [
    ...defaultColumns,
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
    }
  ]

  function loadServerRows(currentPage: number, data: IPreVSaldo[]) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }


  const handleView=  (row : IPreVSaldo)=>{
    dispatch(setPreVSAldoSeleccionado(row))
    dispatch(setVerDetallePreVSaldoActive(true))

  }

  const fetchTableData = useCallback(
    async (sort: SortType, q: string, column: string,codigoPresupuesto:number,codigoIPC:number,codigoPuc:number) => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('')
      setLoading(true);
      const filterPresupuesto:IFilterPresupuestoIpcPuc={codigoPresupuesto,codigoIPC,codigoPuc}


      const responseAll= await ossmmasofApi.post<any>('/PreVSaldos/GetAllByPresupuestoIpcPuc',filterPresupuesto);

      console.log('Respuesta llamando al saldo presupuesto+++++++++======>',responseAll)
      setLoading(false);
      setTotal(responseAll.data.data.length);
      setRows(loadServerRows(page, responseAll.data.data))
      setLinkData(responseAll.data.linkData)
      dispatch(setVerDetallePreVSaldoActive(false))
      if( responseAll.data.data.length>0){
        setMensaje('')
      }else{
        setMensaje('')
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
         !loading && linkData.length>0 ?
          <Box  m={2} pt={3}>
          <Button variant='contained' href={linkData} size='large' >
            Descargar Todo {linkData}
          </Button>
        </Box>
        : <Typography  m={2} pt={3}>{mensaje}</Typography>
      }
 { loading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (

      <DataGrid


        getRowHeight={() => 'auto'}
        autoHeight
        rowHeight={38}
        pagination
        getRowId={(row) => row.codigoSaldo}
        rows={rows}
        rowCount={total}
        columns={columns}

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
      )}
      <DialogPreVSaldoInfo/>

    </Card>
  )
}

export default TableServerSidePreVSaldo
