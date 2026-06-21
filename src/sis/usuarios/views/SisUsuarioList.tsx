import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useSupportCurrentUserId } from 'src/soporte/hooks/useSupportCurrentUserId'
import {
  fetchSupportPermissions,
  SUPPORT_PERMISSIONS_QUERY_KEY
} from 'src/soporte/services/supportService'
import { SisUsuarioDto } from '../interfaces/SisUsuarioDtos'
import {
  applySisUsuarioCntPermissions,
  applySisUsuarioSupportPermissions,
  fetchSisUsuarios,
  SIS_USUARIOS_QUERY_KEY,
  SisUsuarioGetAllResult,
  updateSisUsuarioEmail,
  updateSisUsuarioPassword
} from '../services/sisUsuarioService'

interface CellType {
  row: SisUsuarioDto
}

const SisUsuarioList = () => {
  const currentUserId = useSupportCurrentUserId()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [resetUser, setResetUser] = useState<SisUsuarioDto | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const queryPayload = useMemo(() => ({ pageSize, pageNumber: page + 1, searchText }), [page, pageSize, searchText])
  const permissionsQuery = useQuery({
    queryKey: [SUPPORT_PERMISSIONS_QUERY_KEY, currentUserId],
    queryFn: () => fetchSupportPermissions(currentUserId),
    enabled: currentUserId > 0,
    retry: 1
  })
  const permissions = permissionsQuery.data?.permissions ?? []
  const canManageUsers = permissions.includes('soporte.usuarios.configurar')
  const query = useQuery<SisUsuarioGetAllResult>({
    queryKey: [SIS_USUARIOS_QUERY_KEY, queryPayload],
    queryFn: () => fetchSisUsuarios(queryPayload),
    enabled: currentUserId > 0 && canManageUsers,
    retry: 1
  })

  const handleUserFlags = async (
    row: SisUsuarioDto,
    email: string,
    recibeEmail: boolean,
    esAnalistaSoporte: boolean,
    esAnalistaCnt: boolean,
    esAdminCnt: boolean,
    isSuperuser: boolean
  ) => {
    const result = await updateSisUsuarioEmail({
      codigoUsuario: row.codigoUsuario,
      email,
      recibeEmail,
      esAnalistaSoporte,
      esAnalistaCnt,
      esAdminCnt,
      isSuperuser,
      usuarioUpd: currentUserId
    })

    if (result.isValid) {
      toast.success('Usuario actualizado')
      query.refetch()
    } else {
      toast.error(result.message)
    }
  }

  const handlePasswordReset = async () => {
    if (!resetUser || newPassword.trim().length < 6) {
      toast.error('La clave debe tener al menos 6 caracteres')

      return
    }

    const result = await updateSisUsuarioPassword({
      codigoUsuario: resetUser.codigoUsuario,
      nuevaClave: newPassword,
      usuarioUpd: resetUser.codigoUsuario
    })

    if (result.isValid) {
      toast.success('Clave actualizada')
      setResetUser(null)
      setNewPassword('')
    } else {
      toast.error(result.message)
    }
  }

  const getSupportProfile = (row: SisUsuarioDto) => {
    if (row.isSuperuser) return 'Administrador'
    if (row.esAnalistaSoporte) return 'Analista'

    return 'Usuario normal'
  }

  const getCntProfile = (row: SisUsuarioDto) => {
    if (row.esAdminCnt) return 'Administrador'
    if (row.esAnalistaCnt) return 'Analista'

    return 'Usuario contable'
  }

  const handleApplySupportPermissions = async (row: SisUsuarioDto) => {
    const profile = getSupportProfile(row)
    const confirmed = window.confirm(`Aplicar permisos de soporte como ${profile} a ${row.usuario}?`)

    if (!confirmed) return

    try {
      const result = await applySisUsuarioSupportPermissions({
        codigoUsuario: row.codigoUsuario,
        usuarioUpd: currentUserId
      })

      if (result.isValid) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error((error as Error).message || 'No se pudieron aplicar los permisos de soporte')
    }
  }

  const handleApplyCntPermissions = async (row: SisUsuarioDto) => {
    const profile = getCntProfile(row)
    const confirmed = window.confirm(`Aplicar permisos de contabilidad como ${profile} a ${row.usuario}?`)

    if (!confirmed) return

    try {
      const result = await applySisUsuarioCntPermissions({
        codigoUsuario: row.codigoUsuario,
        usuarioUpd: currentUserId
      })

      if (result.isValid) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error((error as Error).message || 'No se pudieron aplicar los permisos de contabilidad')
    }
  }

  const columns = [
    { flex: 0.1, field: 'codigoUsuario', minWidth: 100, headerName: '# ID' },
    { flex: 0.18, field: 'usuario', minWidth: 180, headerName: 'Usuario' },
    { flex: 0.14, field: 'login', minWidth: 130, headerName: 'Login' },
    {
      flex: 0.28,
      field: 'email',
      minWidth: 260,
      headerName: 'Email',
      renderCell: ({ row }: CellType) => (
        <TextField
          size='small'
          defaultValue={row.email}
          onBlur={event => handleUserFlags(row, event.target.value, row.recibeEmail, row.esAnalistaSoporte, row.esAnalistaCnt, row.esAdminCnt, row.isSuperuser)}
        />
      )
    },
    {
      flex: 0.12,
      field: 'recibeEmail',
      minWidth: 120,
      headerName: 'Recibe email',
      renderCell: ({ row }: CellType) => (
        <Checkbox checked={row.recibeEmail} onChange={event => handleUserFlags(row, row.email, event.target.checked, row.esAnalistaSoporte, row.esAnalistaCnt, row.esAdminCnt, row.isSuperuser)} />
      )
    },
    {
      flex: 0.14,
      field: 'esAnalistaSoporte',
      minWidth: 150,
      headerName: 'Analista soporte',
      renderCell: ({ row }: CellType) => (
        <Checkbox checked={row.esAnalistaSoporte} onChange={event => handleUserFlags(row, row.email, row.recibeEmail, event.target.checked, row.esAnalistaCnt, row.esAdminCnt, row.isSuperuser)} />
      )
    },
    {
      flex: 0.14,
      field: 'esAnalistaCnt',
      minWidth: 150,
      headerName: 'Analista CNT',
      renderCell: ({ row }: CellType) => (
        <Checkbox checked={row.esAnalistaCnt} onChange={event => handleUserFlags(row, row.email, row.recibeEmail, row.esAnalistaSoporte, event.target.checked, row.esAdminCnt, row.isSuperuser)} />
      )
    },
    {
      flex: 0.14,
      field: 'esAdminCnt',
      minWidth: 150,
      headerName: 'Admin CNT',
      renderCell: ({ row }: CellType) => (
        <Checkbox checked={row.esAdminCnt} onChange={event => handleUserFlags(row, row.email, row.recibeEmail, row.esAnalistaSoporte, row.esAnalistaCnt, event.target.checked, row.isSuperuser)} />
      )
    },
    {
      flex: 0.12,
      field: 'isSuperuser',
      minWidth: 130,
      headerName: 'Superuser',
      renderCell: ({ row }: CellType) => (
        <Checkbox checked={row.isSuperuser} onChange={event => handleUserFlags(row, row.email, row.recibeEmail, row.esAnalistaSoporte, row.esAnalistaCnt, row.esAdminCnt, event.target.checked)} />
      )
    },
    {
      flex: 0.14,
      field: 'perfilSoporte',
      minWidth: 150,
      headerName: 'Perfil soporte',
      valueGetter: ({ row }: CellType) => getSupportProfile(row)
    },
    {
      flex: 0.14,
      field: 'perfilContabilidad',
      minWidth: 170,
      headerName: 'Perfil CNT',
      valueGetter: ({ row }: CellType) => getCntProfile(row)
    },
    {
      flex: 0.1,
      field: 'acciones',
      minWidth: 190,
      sortable: false,
      filterable: false,
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title='Aplicar permisos soporte'>
            <IconButton size='small' color='primary' onClick={() => handleApplySupportPermissions(row)}>
              <Icon icon='mdi:shield-sync-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Aplicar permisos contabilidad'>
            <IconButton size='small' color='primary' onClick={() => handleApplyCntPermissions(row)}>
              <Icon icon='mdi:calculator-variant-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Resetear clave'>
            <IconButton
              size='small'
              onClick={() => {
                setResetUser(row)
                setNewPassword('')
              }}
            >
              <Icon icon='mdi:lock-reset' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Tooltip title='Recargar'>
            <IconButton color='primary' size='small' disabled={!canManageUsers} onClick={() => query.refetch()}>
              <Icon icon='mdi:refresh' fontSize={20} />
            </IconButton>
          </Tooltip>
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
        {permissionsQuery.isLoading ? (
          <Spinner sx={{ height: 450 }} />
        ) : !canManageUsers ? (
          <Box sx={{ p: 4 }}>
            <Alert severity='warning'>No tiene permiso para administrar usuarios SIS.</Alert>
          </Box>
        ) : query.isLoading ? (
          <Spinner sx={{ height: 450 }} />
        ) : (
          <Box sx={{ height: 540 }}>
            <DataGrid
              getRowId={row => row.codigoUsuario}
              columns={columns}
              rows={query.data?.data ?? []}
              rowCount={query.data?.cantidadRegistros ?? 0}
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              paginationMode='server'
              onPageChange={newPage => setPage(newPage)}
              onPageSizeChange={newPageSize => {
                setPageSize(newPageSize)
                setPage(0)
              }}
            />
          </Box>
        )}
        {query.isError && (
          <Typography sx={{ color: 'error.main', px: 4, pb: 4 }} variant='body2'>
            {(query.error as Error).message}
          </Typography>
        )}
      </Card>
      <Dialog fullWidth maxWidth='xs' open={Boolean(resetUser)} onClose={() => setResetUser(null)}>
        <DialogTitle>Resetear clave</DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 4 }}>
            {resetUser?.usuario}
          </Typography>
          <TextField
            fullWidth
            autoFocus
            type='password'
            label='Nueva clave'
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setResetUser(null)}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handlePasswordReset}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default SisUsuarioList
