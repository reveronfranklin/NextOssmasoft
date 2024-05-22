// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'

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
import { Tooltip, IconButton, Grid, Toolbar, CardContent } from '@mui/material'

// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner'

import { useDispatch } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { IPreSolModificacionResponseDto } from 'src/interfaces/Presupuesto/PreSolicitudModificacion/PreSolModificacionResponseDto'
import { IFilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-presupuesto'
import {
  setListTipoModificacion,
  setOperacionCrudPreSolModificacion,
  setPreSolModificacionSeleccionado,
  setVerPreSolModificacionActive
} from 'src/store/apps/pre-sol-modificacion'
import { IPreSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PreSolicitudModificacion/PreSolModificacionUpdateDto'
import { fetchDataPreMtrDenominacionPuc, fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'
import DialogPreSolModificacionInfo from '../views/DialogPreSolModificacionInfo'
import { IPrePucSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionUpdateDto'
import {
  setListFinanciado,
  setOperacionCrudPrePucSolModificacion,
  setPrePucSolModificacionSeleccionado,
  setVerPrePucSolModificacionActive
} from 'src/store/apps/pre-puc-sol-modificacion'
import DialogPrePucSolModificacionInfo from 'src/presupuesto/pucSolicitudModificacion/views/DialogPrePucSolModificacionInfo'

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
        {getInitials(row.descripcionTipoModificacion ? row.descripcionTipoModificacion : 'John Doe')}
      </CustomAvatar>
    )
  }
}
const renderClientStatus = (params: GridRenderCellParams) => {
  const { row } = params
  let stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  if (row.status === 'PE') {
    stateNum = 0
  }

  if (row.status === 'AP') {
    stateNum = 3
  }
  if (row.status === 'AN') {
    stateNum = 1
  }
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
        {getInitials(row.descripcionEstatus ? row.descripcionEstatus : 'John Doe')}
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
  row: IPreSolModificacionResponseDto
}

interface Props {
  dePara: string
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
  const [rows, setRows] = useState<IPreSolModificacionResponseDto[]>([])
  const [allRows, setAllRows] = useState<IPreSolModificacionResponseDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaSolicitudString')
  const [dePara, setDePara] = useState<Props>({ dePara: '' })

  function loadServerRows(currentPage: number, data: IPreSolModificacionResponseDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }
  const dispatch = useDispatch()

  const { listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)
  const { verPreSolModificacionActive } = useSelector((state: RootState) => state.preSolModificacion)
  const { verPrePucSolModificacionActive } = useSelector((state: RootState) => state.prePucSolModificacion)

  const columns: any = [
    {
      flex: 0.05,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Editar'>
            <IconButton size='small' onClick={() => handleView(row)}>
              <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
            </IconButton>
          </Tooltip>

          {row.descontar && row.status == 'PE' && (
            <Tooltip title='Descontar'>
              <IconButton size='small' onClick={() => handleAddPucSolicitud(row, 'D')}>
                <Icon icon='mdi-alpha-d-circle' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
          {row.aportar && row.status == 'PE' && (
            <Tooltip title='Aportar'>
              <IconButton size='small' onClick={() => handleAddPucSolicitud(row, 'P')}>
                <Icon icon='mdi-alpha-a-circle' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    },

    {
      flex: 0.025,
      minWidth: 10,
      headerName: 'Id',
      field: 'codigoSolModificacion',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoSolModificacion}
        </Typography>
      )
    },
    {
      with: 100,
      headerName: 'Fecha',
      field: 'Fecha',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.fechaSolicitudString).format('DD/MM/YYYY')}
        </Typography>
      )
    },

    {
      flex: 0.15,
      minWidth: 210,
      field: 'descripcionTipoModificacion',
      headerName: 'Tipo',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.descripcionTipoModificacion}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.055,
      minWidth: 15,
      headerName: 'Descontar',
      field: 'totalDescontar',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat('de-DE').format(params.row.totalDescontar)}
        </Typography>
      )
    },
    {
      flex: 0.055,
      minWidth: 15,
      headerName: 'Aportar',
      field: 'totalAportar',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Intl.NumberFormat('de-DE').format(params.row.totalAportar)}
        </Typography>
      )
    },

    {
      flex: 0.1,
      minWidth: 80,
      field: 'descripcionEstatus',
      headerName: 'Estatus',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            {renderClientStatus(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.descripcionEstatus}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.075,
      minWidth: 15,
      headerName: 'Proceso',
      field: 'statusProceso',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.statusProceso}
        </Typography>
      )
    }
  ]

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
  const handleView = (row: IPreSolModificacionResponseDto) => {
    dispatch(setPreSolModificacionSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreSolModificacion(2))
    dispatch(setVerPreSolModificacionActive(true))
  }

  const handleAddPucSolicitud = (row: IPreSolModificacionResponseDto, dePara: string) => {
    // Operacion Crud 1 = Crear titulo
    dispatch(setPreSolModificacionSeleccionado(row))
    const defaultValues: IPrePucSolModificacionUpdateDto = {
      codigoPucSolModificacion: 0,
      codigoSaldo: 0,
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto,
      codigoSolModificacion: row.codigoSolModificacion,
      financiadoId: 0,
      codigoIcp: 0,
      codigoPuc: 0,
      monto: 0,
      dePara: dePara
    }
    setDePara({ dePara: dePara })
    dispatch(setPrePucSolModificacionSeleccionado(defaultValues))
    dispatch(setOperacionCrudPrePucSolModificacion(1))
    dispatch(setVerPrePucSolModificacionActive(true))
  }

  const fetchTableData = useCallback(
    async (filter: IFilterPrePresupuestoDto) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}
      setTotal(0)
      setAllRows([])
      setRows([])
      setMensaje('')
      if (filter.codigoPresupuesto <= 0) {
        return
      }

      setMensaje('')
      setLoading(true)

      const responseAll = await ossmmasofApi.post<any>('/PreSolModificacion/GetByPresupuesto', filter)

      if (responseAll.data.data) {
        setAllRows(responseAll.data.data)
        setTotal(responseAll.data.data.length)
        setRows(loadServerRows(page, responseAll.data.data))
        setMensaje('')
      } else {
        setTotal(0)
        setAllRows([])
        setRows([])
        setMensaje('')
      }
      await fetchDataPreMtrUnidadEjecutora(dispatch, filter)
      await fetchDataPreMtrDenominacionPuc(dispatch, filter)

      const filterTipo = { descripcionId: 0, tituloId: 8 }
      const responseTipoModificacion = await ossmmasofApi.post<any>('/PreDescriptivas/GetAllByTitulo', filterTipo)
      dispatch(setListTipoModificacion(responseTipoModificacion.data.data))

      const filterFinanciado = { descripcionId: 0, tituloId: 3 }
      const responseFinanciado = await ossmmasofApi.post<any>('/PreDescriptivas/GetAllByTitulo', filterFinanciado)
      dispatch(setListFinanciado(responseFinanciado.data.data))

      setLoading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    const filter: IFilterPrePresupuestoDto = {
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    if (listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto != null) {
      filter.codigoPresupuesto = listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    if (filter.codigoPresupuesto > 0) {
      fetchTableData(filter)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreSolModificacionActive, verPrePucSolModificacionActive, listpresupuestoDtoSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (
        sortColumn === 'descripcionTipoModificacion' ||
        sortColumn === 'descripcionEstatus' ||
        sortColumn === 'statusProceso'
      ) {
        const dataAsc = temp.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
        const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
        setRows(loadServerRows(page, dataToFilter))
      }

      //fetchTableData(newModel[0].sort, newModel[0].field,fechaDesde,fechaHasta,tiposNominaSeleccionado.codigoTipoNomina,conceptoSeleccionado,personaSeleccionado.codigoPersona);
    } else {
      setSort('asc')
      setSortColumn('descripcionTipoModificacion')
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

  const handleAdd = () => {
    // Operacion Crud 1 = Crear titulo

    const defaultValues: IPreSolModificacionUpdateDto = {
      codigoSolModificacion: 0,
      tipoModificacionId: 0,
      fechaSolicitud: null,
      fechaSolicitudString: '',
      fechaSolicitudObj: null,
      numeroSolModificacion: '',
      codigoSolicitante: 0,
      motivo: '',
      numeroCorrelativo: 0,
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    dispatch(setPreSolModificacionSeleccionado(defaultValues))
    dispatch(setOperacionCrudPreSolModificacion(1))
    dispatch(setVerPreSolModificacionActive(true))
  }

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          Solicitud de Modificación Presupuestaria
        </Typography>
      </CardContent>
      {!loading ? (
        <Grid m={2} pt={3} item justifyContent='flex-end'>
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
            <Tooltip title='Agregar Solicitud'>
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
          getRowId={row => row.codigoSolModificacion}
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
        <DialogPreSolModificacionInfo popperPlacement={popperPlacement} />
        <DialogPrePucSolModificacionInfo dePara={dePara.dePara} />
      </DatePickerWrapper>
    </Card>
  )
}

export default TableServerSide
