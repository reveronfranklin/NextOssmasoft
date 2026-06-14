import { useRouter } from 'next/router'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import {
  checkCntPermission,
  CNT_PERMISSION_CATALOG_ADMIN,
  CNT_PERMISSION_CATALOG_VIEW,
  CNT_PERMISSION_CIERRE_CIERRE,
  CNT_PERMISSION_CIERRE_PRECIERRE,
  CNT_PERMISSION_CIERRE_REVERSO,
  CNT_PERMISSION_CIERRE_VIEW,
  CNT_PERMISSION_CONCILIACION_FORMATS_EDIT,
  CNT_PERMISSION_CONCILIACION_FORMATS_VIEW,
  CNT_PERMISSION_CONCILIACION_OCR,
  CNT_PERMISSION_CONCILIACION_REPROCESS,
  CNT_PERMISSION_EDIT_AUTOMATIC,
  CNT_PERMISSION_REORDER,
  CNT_PERMISSION_REPORT_VIEW,
  CNT_PERMISSIONS_QUERY_KEY
} from '../../services/cntService'

const permissionItems = [
  { label: 'Catalogos', permission: CNT_PERMISSION_CATALOG_VIEW },
  { label: 'Administracion', permission: CNT_PERMISSION_CATALOG_ADMIN },
  { label: 'Reportes', permission: CNT_PERMISSION_REPORT_VIEW },
  { label: 'Automaticos', permission: CNT_PERMISSION_EDIT_AUTOMATIC },
  { label: 'Reordenar', permission: CNT_PERMISSION_REORDER },
  { label: 'Formatos ver', permission: CNT_PERMISSION_CONCILIACION_FORMATS_VIEW },
  { label: 'Formatos editar', permission: CNT_PERMISSION_CONCILIACION_FORMATS_EDIT },
  { label: 'Reprocesar banco', permission: CNT_PERMISSION_CONCILIACION_REPROCESS },
  { label: 'OCR banco', permission: CNT_PERMISSION_CONCILIACION_OCR },
  { label: 'Cierre ver', permission: CNT_PERMISSION_CIERRE_VIEW },
  { label: 'Precierre', permission: CNT_PERMISSION_CIERRE_PRECIERRE },
  { label: 'Cierre', permission: CNT_PERMISSION_CIERRE_CIERRE },
  { label: 'Reverso', permission: CNT_PERMISSION_CIERRE_REVERSO }
]

const configurationLinks = [
  { label: 'Periodos', path: '/apps/cnt/catalogos/periodos', icon: 'mdi:calendar-month-outline' },
  { label: 'Relacion documentos', path: '/apps/cnt/catalogos/relacion-documentos', icon: 'mdi:file-link-outline' },
  { label: 'Formatos banco', path: '/apps/cnt/conciliacion/formatos-banco', icon: 'mdi:bank-transfer' },
  { label: 'Cierre contable', path: '/apps/cnt/procesos/cierre-contable', icon: 'mdi:file-lock-outline' },
  { label: 'Saldos', path: '/apps/cnt/catalogos/saldos', icon: 'mdi:scale-balance' },
  { label: 'Plan de cuentas', path: '/apps/cnt/catalogos/plan-cuentas', icon: 'mdi:account-tree-outline' }
]

const CntConfiguracion = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()

  const permissionsQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, 'configuracion', currentUserId],
    queryFn: async () =>
      Promise.all(
        permissionItems.map(async item => ({
          ...item,
          result: await checkCntPermission({ usuarioId: currentUserId, permission: item.permission })
        }))
      ),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canOpenConfiguration = permissionsQuery.data?.some(item => item.result.hasPermission) === true

  if (permissionsQuery.isLoading) return <Spinner />

  if (permissionsQuery.isError) {
    return <Alert severity='error'>{(permissionsQuery.error as Error).message}</Alert>
  }

  if (!canOpenConfiguration) {
    return <Typography color='error'>El usuario no tiene permisos de configuracion para contabilidad.</Typography>
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Configuracion de contabilidad
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {(permissionsQuery.data ?? []).map(item => (
                <Chip
                  key={item.permission}
                  label={item.label}
                  color={item.result.hasPermission ? 'success' : 'default'}
                  variant={item.result.hasPermission ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {configurationLinks.map(item => (
        <Grid item xs={12} sm={6} md={3} key={item.path}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Icon icon={item.icon} fontSize={28} />
                <Typography variant='h6'>{item.label}</Typography>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
              <Button size='small' variant='contained' onClick={() => router.push(item.path)}>
                Abrir
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default CntConfiguracion
