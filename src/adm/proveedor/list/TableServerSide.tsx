import { useEffect, useState, useCallback, ChangeEvent } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Tooltip, IconButton, Grid, Toolbar, CardContent } from '@mui/material'
import { getInitials } from 'src/@core/utils/get-initials'
import Spinner from 'src/@core/components/spinner'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { ThemeColor } from 'src/@core/layouts/types'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddProveedorDrawer from './AddProveedorDrawer'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setProveedorSeleccionado, setProveedoresDtoSeleccionado } from 'src/store/apps/adm-proveedor'
import { IProveedor } from '../interfaces'

type SortType = 'asc' | 'desc' | undefined | null

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: IProveedor
}

const proveedorStatusObj: UserStatusType = {
  Activo: 'success',
  Inactivo: 'secondary',
  Suspendido: 'warning'
}

const TableServerSide = () => {
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('asc')
  const [pageSize, setPageSize] = useState<number>(100)
  const [rows, setRows] = useState<IProveedor[]>([])
  const [allRows, setAllRows] = useState<IProveedor[]>([])
  const [mensaje, setMensaje] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const router = useRouter();
  const dispatch = useDispatch();

  function loadServerRows(currentPage: number, data: IProveedor[]) {
    return data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }

  const renderClient = (row: IProveedor) => (
    <CustomAvatar
      skin='light'
      color='primary'
      sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
    >
      {getInitials(row.nombreProveedor || 'Proveedor')}
    </CustomAvatar>
  )

  const columns = [
    {
      flex: 0.25,
      minWidth: 250,
      field: 'nombreProveedor',
      headerName: 'Proveedor',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='caption'>
              {row.nombreProveedor}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'cedula',
      headerName: 'Cédula',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='body2'>
          {row.cedula}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'rif',
      headerName: 'RIF',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='body2'>
          {row.rif}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'nacionalidad',
      headerName: 'Nacionalidad',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.nacionalidad}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        const status = row.status || 'Activo'

        return (
          <CustomChip
            skin='light'
            size='small'
            label={status}
            color={proveedorStatusObj[status]}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    }
  ]

  const handlerProveedor = (value:any) => {
    if (value && value.row.codigoProveedor > 0) {
      dispatch(setProveedorSeleccionado(value.row));
      dispatch(setProveedoresDtoSeleccionado(value.row));
      router.replace("/apps/adm/proveedor/view/resumen/");
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })

    saveAs(blob, 'proveedores.xlsx')
  }

  const fetchTableData = useCallback(async () => {
    setMensaje('')
    setLoading(true)

    const response = await ossmmasofApi.get('/AdmProveedores/GetAll')

    if (response?.data?.isValid !== false) {
      setAllRows(response.data.data)
      setTotal(response.data.data.length)
      setRows(loadServerRows(page, response.data.data))
    } else {
      setAllRows([])
      setRows([])
      setTotal(0)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const handleSortModel = (newModel: GridSortModel) => {
    const temp = [...allRows]

    if (newModel.length) {
      setSort(newModel[0].sort)
      const sortColumn = newModel[0].field

      if (
        sortColumn === 'nombreProveedor' ||
        sortColumn === 'cedula' ||
        sortColumn === 'rif'
      ) {
        const dataAsc = temp.sort((a: any, b: any) =>
          a[sortColumn] < b[sortColumn] ? -1 : 1
        )
        const dataToFilter = sort === 'asc' ? dataAsc : dataAsc.reverse()
        setRows(loadServerRows(page, dataToFilter))
      }
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)

    if (value === '') {
      setRows(allRows)
    } else {
      const newRows = allRows.filter(el =>
        el.nombreProveedor?.toLowerCase().includes(value.toLowerCase())
      )
      setRows(newRows)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setRows(loadServerRows(newPage, allRows))
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant='h5'>
          Proveedores
        </Typography>
      </CardContent>

      {!loading ? (
        <Grid m={2} pt={3}>
          <Toolbar sx={{ justifyContent: 'flex-start' }}>
            <Tooltip title='Descargar'>
              <IconButton color='primary' size='small' onClick={exportToExcel}>
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
          getRowId={row => row.codigoProveedor}
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
          onRowDoubleClick={(row) => handlerProveedor(row)}
          componentsProps={{
            baseButton: { variant: 'outlined' },
            toolbar: {
              printOptions: { disableToolbarButton: true },
              value: searchValue,
              clearSearch: () => handleSearch(''),
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                handleSearch(event.target.value)
            }
          }}
        />
      )}

      <DatePickerWrapper>
        <AddProveedorDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
      </DatePickerWrapper>
    </Card>
  )
}

export default TableServerSide
