import { useMemo, useState } from 'react'
import { Box, Card, CardActions, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import {
  defaultOssUsuarioRol,
  setOperacionCrudOssUsuarioRol,
  setOssUsuarioRolSeleccionado,
  setVerOssUsuarioRolActive
} from 'src/store/apps/oss-usuario-rol'
import { OssUsuarioRolResponseDto } from '../interfaces/OssUsuarioRolDtos'
import {
  fetchOssUsuarioRol,
  OSS_USUARIO_ROL_QUERY_KEY,
  OssUsuarioRolGetAllResult
} from '../services/ossUsuarioRolService'
import DialogOssUsuarioRolInfo from './DialogOssUsuarioRolInfo'

interface CellType {
  row: OssUsuarioRolResponseDto
}

const UsuarioRolList = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')

  const queryPayload = useMemo(
    () => ({
      pageSize,
      pageNumber: page + 1,
      searchText
    }),
    [page, pageSize, searchText]
  )

  const query = useQuery<OssUsuarioRolGetAllResult>({
    queryKey: [OSS_USUARIO_ROL_QUERY_KEY, queryPayload],
    queryFn: () => fetchOssUsuarioRol(queryPayload),
    retry: 1
  })

  const roles = query.data?.data ?? []
  const totalRegistros = query.data?.cantidadRegistros ?? 0

  const handleAdd = () => {
    dispatch(setOssUsuarioRolSeleccionado(defaultOssUsuarioRol))
    dispatch(setOperacionCrudOssUsuarioRol(1))
    dispatch(setVerOssUsuarioRolActive(true))
  }

  const handleEdit = (row: OssUsuarioRolResponseDto) => {
    dispatch(setOssUsuarioRolSeleccionado(row))
    dispatch(setOperacionCrudOssUsuarioRol(2))
    dispatch(setVerOssUsuarioRolActive(true))
  }

  const columns = [
    {
      flex: 0.1,
      field: 'codigoUsuarioRol',
      minWidth: 90,
      headerName: '# ID'
    },
    {
      flex: 0.18,
      field: 'usuario',
      minWidth: 150,
      headerName: 'Usuario',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.usuario}</Typography>
    },
    {
      flex: 0.12,
      field: 'codigoUsuario',
      minWidth: 130,
      headerName: 'Codigo Usuario'
    },
    {
      flex: 0.3,
      field: 'descripcion',
      minWidth: 220,
      headerName: 'Descripcion',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcion}</Typography>
    },
    {
      flex: 0.14,
      field: 'modulos',
      minWidth: 110,
      headerName: 'Modulos',
      sortable: false,
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.jsonMenu?.length ?? 0}</Typography>
    },
    {
      flex: 0.1,
      field: 'actions',
      minWidth: 90,
      headerName: 'Acciones',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Tooltip title='Editar'>
          <IconButton color='primary' size='small' onClick={() => handleEdit(row)}>
            <Icon icon='mdi:pencil-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title='Agregar'>
              <IconButton color='primary' size='small' onClick={handleAdd}>
                <Icon icon='mdi:plus' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Recargar'>
              <IconButton color='primary' size='small' onClick={() => query.refetch()}>
                <Icon icon='mdi:refresh' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            size='small'
            value={searchText}
            label='Buscar'
            sx={{ minWidth: { xs: '100%', sm: 320 } }}
            onChange={event => {
              setPage(0)
              setSearchText(event.target.value)
            }}
          />
        </CardActions>
        {query.isLoading ? (
          <Spinner sx={{ height: 450 }} />
        ) : (
          <Box sx={{ height: 520 }}>
            <DataGrid
              getRowId={row => row.codigoUsuarioRol}
              columns={columns}
              rows={roles}
              rowCount={totalRegistros}
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[10, 25, 50, 100]}
              pagination
              paginationMode='server'
              onPageChange={newPage => setPage(newPage)}
              onPageSizeChange={newPageSize => {
                setPageSize(newPageSize)
                setPage(0)
              }}
              onRowDoubleClick={row => handleEdit(row.row)}
            />
          </Box>
        )}
        {query.isError && (
          <Typography sx={{ color: 'error.main', px: 4, pb: 4 }} variant='body2'>
            {(query.error as Error).message}
          </Typography>
        )}
      </Card>
      <DialogOssUsuarioRolInfo />
    </Grid>
  )
}

export default UsuarioRolList
