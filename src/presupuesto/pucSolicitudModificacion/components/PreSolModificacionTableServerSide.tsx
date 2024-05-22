// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

//import { DataGridPro } from '@mui/x-data-grid-pro';

// ** ThirdParty Components
//import axios from 'axios'

// ** Custom Components
//import CustomChip from 'src/@core/components/mui/chip'

import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports

//import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Tooltip, IconButton, Grid, Toolbar, TextField } from '@mui/material'

// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import Spinner from 'src/@core/components/spinner'

import { useDispatch } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { IFilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-presupuesto'

import { fetchDataPreMtrDenominacionPuc, fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'
import { IPrePucSolModificacionResponseDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionResponseDto'
import { IPrePucSolModificacionFilterDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionFilterDto'

import {
  setOperacionCrudPrePucSolModificacionUpdate,
  setPrePucSolModificacionSeleccionado,
  setTotalAportar,
  setTotalDescontar,
  setVerPrePucSolModificacionUpdateActive
} from 'src/store/apps/pre-puc-sol-modificacion'

import DialogPrePucSolModificacionInfoUpdate from '../views/DialogPrePucSolModificacionInfoUpdate'
import { NumericFormat } from 'react-number-format'
import { setVerPreSaldoDisponibleActive } from 'src/store/apps/pre-saldo-disponible'

/*interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}*/

type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column

/*const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}*/
interface CellType {
  row: IPrePucSolModificacionResponseDto
}
interface Props {
  dePara: string
}
const PreSolModificacionTableServerSide = (dePara: Props) => {
  // ** State
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IPrePucSolModificacionResponseDto[]>([])
  const [allRows, setAllRows] = useState<IPrePucSolModificacionResponseDto[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaSolicitudString')

  function loadServerRows(currentPage: number, data: IPrePucSolModificacionResponseDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }
  const dispatch = useDispatch()

  const { preSolModificacionSeleccionado } = useSelector((state: RootState) => state.preSolModificacion)
  const { prePucSolModificacionSeleccionado, verPrePucSolModificacionUpdateActive, totalDescontar, totalAportar } =
    useSelector((state: RootState) => state.prePucSolModificacion)
  const { listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)

  const columns: any = [
    {
      flex: 0.025,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.status != 'AN' && (
            <Tooltip title='View'>
              <IconButton size='small' onClick={() => handleView(row)}>
                <Icon icon='mdi:eye-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    },
    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'ICP',
      field: 'codigoIcpConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoIcpConcat}
        </Typography>
      )
    },
    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'Denominacion-ICP',
      field: 'denominacionIcp',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.denominacionIcp}
        </Typography>
      )
    },

    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'PUC',
      field: 'codigoPucConcat',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.codigoPucConcat}
        </Typography>
      )
    },
    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'Denominacion-PUC',
      field: 'denominacionPUC',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.denominacionPuc}
        </Typography>
      )
    },
    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'Financiado',
      field: 'descripcionFinanciado',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.descripcionFinanciado}
        </Typography>
      )
    },
    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'Descontar',
      field: 'descontar',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.descontar}
        </Typography>
      )
    },
    {
      flex: 0.045,
      minWidth: 15,
      headerName: 'Aportar',
      field: 'aportar',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='caption' sx={{ color: 'text.primary' }}>
          {params.row.aportar}
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
  const handleView = (row: IPrePucSolModificacionResponseDto) => {
    console.log('IPreSolModificacionResponseDto', row)
    dispatch(setPrePucSolModificacionSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPrePucSolModificacionUpdate(2))
    dispatch(setVerPrePucSolModificacionUpdateActive(true))
    dispatch(setVerPreSaldoDisponibleActive(false))
  }

  const fetchTableData = useCallback(
    async (filter: IFilterPrePresupuestoDto, filterPucSolModificacion: IPrePucSolModificacionFilterDto) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('')
      setLoading(true)

      const responseAll = await ossmmasofApi.post<any>(
        '/PrePucSolModificacion/GetAllByCodigoSolicitud',
        filterPucSolModificacion
      )

      console.log(responseAll.data.data)

      if (responseAll.data.data) {
        setAllRows(responseAll.data.data)
        setTotal(responseAll.data.data.length)
        setRows(loadServerRows(page, responseAll.data.data))

        const sumaAportar = responseAll.data.data.reduce((anterior: any, actual: any) => anterior + actual.aportar, 0)
        const sumaDescontar = responseAll.data.data.reduce(
          (accumulator: any, currentValue: any) => accumulator + currentValue.descontar,
          0
        )

        dispatch(setTotalAportar(sumaAportar))
        dispatch(setTotalDescontar(sumaDescontar))

        setMensaje('')
      } else {
        dispatch(setTotalAportar(0))
        dispatch(setTotalDescontar(0))
        setTotal(0)
        setAllRows([])
        setRows([])
        setMensaje('')
      }
      await fetchDataPreMtrUnidadEjecutora(dispatch, filter)
      await fetchDataPreMtrDenominacionPuc(dispatch, filter)

      setLoading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prePucSolModificacionSeleccionado, verPrePucSolModificacionUpdateActive]
  )

  useEffect(() => {
    const filter: IFilterPrePresupuestoDto = {
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    if (listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto != null) {
      filter.codigoPresupuesto = listpresupuestoDtoSeleccionado.codigoPresupuesto
    }
    const filterPucSolModificacion: IPrePucSolModificacionFilterDto = {
      codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
      dePara: dePara.dePara
    }

    fetchTableData(filter, filterPucSolModificacion)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPrePucSolModificacionUpdateActive, prePucSolModificacionSeleccionado])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (
        sortColumn === 'codigoIcpConcat' ||
        sortColumn === 'codigoPucConcat' ||
        sortColumn === 'descripcionFinanciado'
      ) {
        const dataAsc = temp.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1))
        const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
        setRows(loadServerRows(page, dataToFilter))
      }

      //fetchTableData(newModel[0].sort, newModel[0].field,fechaDesde,fechaHasta,tiposNominaSeleccionado.codigoTipoNomina,conceptoSeleccionado,personaSeleccionado.codigoPersona);
    } else {
      setSort('asc')
      setSortColumn('codigoIcpConcat')
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)

    console.log('de para:', dePara)
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

  return (
    <Card>
      {!loading ? (
        <Grid m={2} pt={3} item justifyContent='flex-end'>
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
            <Tooltip title='Descargar'>
              <IconButton color='primary' size='small' onClick={() => exportToExcel()}>
                <Icon icon='ci:download' fontSize={20} />
              </IconButton>
            </Tooltip>
            <NumericFormat
              sx={{ ml: 2, typography: 'body1' }}
              label='Total Descontar:'
              disabled
              customInput={TextField}
              value={totalDescontar}
              decimalSeparator=','
              decimalScale={2}
              thousandSeparator='.'
            />
            <NumericFormat
              sx={{ ml: 2, typography: 'body1' }}
              label='Total Aportar:'
              disabled
              customInput={TextField}
              value={totalAportar}
              decimalSeparator=','
              decimalScale={2}
              thousandSeparator='.'
            />
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
          getRowId={row => row.codigoPucSolModificacion}
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
      <DialogPrePucSolModificacionInfoUpdate dePara='D'></DialogPrePucSolModificacionInfoUpdate>
      <DatePickerWrapper>{/*  <DialogPrePucSolModificacionInfo dePara={dePara.dePara} /> */}</DatePickerWrapper>
    </Card>
  )
}

export default PreSolModificacionTableServerSide
