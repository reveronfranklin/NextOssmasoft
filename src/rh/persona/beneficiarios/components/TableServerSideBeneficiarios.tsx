// ** React Imports
import { useEffect, useState, useCallback, ChangeEvent } from 'react'

// ** MUI Imports

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'

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
import { Grid, IconButton, Toolbar, Tooltip } from '@mui/material'

// ** Types

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import Spinner from 'src/@core/components/spinner'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import Icon from 'src/@core/components/icon'
import {
  IRhVTitularBeneficiariosExcelResponseDto,
  IRhVTitularBeneficiariosResponseDto
} from 'src/interfaces/rh/RhVTitularBeneficiariosResponseDto'

interface FilterTipoNomina {
  codigoTipoNomina: IListTipoNominaDto[]
}

type SortType = 'asc' | 'desc' | undefined | null

// ** renders client column

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
    flex: 0.175,
    minWidth: 15,
    headerName: 'parentesco',
    field: 'parentesco',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.parentesco}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'cedulaTitular',
    field: 'cedulaTitular',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.cedulaTitular}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'cedulaBeneficiario',
    field: 'cedulaBeneficiario',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.cedulaTitular}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'nombreTituBene',
    field: 'nombreTituBene',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.nombreTituBene}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'apellidosTituBene',
    field: 'apellidosTituBene',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.apellidosTituBene}
      </Typography>
    )
  },

  {
    flex: 0.125,
    minWidth: 15,
    headerName: 'fechaNacimientoFamiliar',
    field: 'fechaNacimientoFamiliar',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {dayjs(params.row.fechaNacimientoFamiliar).format('DD/MM/YYYY')}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'edad',
    field: 'edad',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.edad}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'FechaIngreso',
    field: 'fechaIngresoString',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.fechaIngresoString}
      </Typography>
    )
  },

  {
    flex: 0.175,
    minWidth: 120,
    headerName: 'tiempoServicio',
    field: 'tiempoServicio',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.tiempoServicio}
      </Typography>
    )
  }
]

const TableServerSideBeneficiarios = () => {
  // ** State
  const [page, setPage] = useState(0)

  //const [ setLinkData] = useState('')
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IRhVTitularBeneficiariosResponseDto[]>([])
  const [allRows, setAllRows] = useState<IRhVTitularBeneficiariosResponseDto[]>([])
  const [allRowsExcel, setAllRowsExcel] = useState<IRhVTitularBeneficiariosExcelResponseDto[]>([])

  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)

  //const [rows, setRows] = useState<DataGridRowType[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('fechaNominaMov')

  const { tiposNominaSeleccionado = [] as IListTipoNominaDto[] } = useSelector((state: RootState) => state.nomina)

  function loadServerRows(currentPage: number, data: IRhVTitularBeneficiariosResponseDto[]) {
    //if(currentPage<=0) currentPage=1;

    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const fetchTableData = useCallback(
    async (codigoTipoNomina: IListTipoNominaDto[]) => {
      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      setMensaje('')
      setLoading(true)
      setAllRows([])
      setTotal(0)
      setRows(loadServerRows(page, []))

      //setLinkData('')

      if (codigoTipoNomina.length == 0) {
        setLoading(false)

        return
      }

      const filterHistorico: FilterTipoNomina = {
        codigoTipoNomina
      }

      const responseAll = await ossmmasofApi.post<any>('/RhTitularesBeneficiarios/GetByTipoNomina', filterHistorico)
      console.log(responseAll)
      setAllRows(responseAll.data.data)
      setAllRowsExcel(responseAll.data.data)
      setTotal(responseAll.data.data.length)

      setRows(loadServerRows(page, responseAll.data.data))

      //setLinkData(responseAll.data.linkData)

      setLoading(false)

      if (responseAll.data.data.length > 0) {
        setMensaje('')
      } else {
        setMensaje('')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    fetchTableData(tiposNominaSeleccionado)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiposNominaSeleccionado])

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allRowsExcel)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })

    saveAs(blob, 'TitularBeneficiario.xlsx')
  }

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      //const column: string=newModel[0].field.toString();

      if (
        sortColumn === 'tipoNomina' ||
        sortColumn === 'cedulaTitular' ||
        sortColumn === 'cedulaBeneficiario' ||
        sortColumn === 'nombreTituBene' ||
        sortColumn === 'apellidosTituBene' ||
        sortColumn === 'edad' ||
        sortColumn === 'parentesco' ||
        sortColumn === 'tiempoServicio'
      ) {
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
          </Toolbar>
        </Grid>
      ) : (
        <Typography>{mensaje}</Typography>
      )}

      {loading ? (
        <Spinner sx={{ height: '100%' }} />
      ) : (
        <DataGrid
          autoHeight
          pagination
          getRowId={row => row.id}
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
    </Card>
  )
}

export default TableServerSideBeneficiarios
