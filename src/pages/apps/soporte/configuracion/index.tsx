import { Card, CardContent, Chip, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'src/@core/components/spinner'
import { fetchSupportCatalog, SUPPORT_CATALOGS_QUERY_KEY } from 'src/soporte/services/supportService'
import { SupportCatalogDto } from 'src/soporte/interfaces/SupportDtos'

const catalogGroups = [
  { key: 'types', title: 'Tipos de solicitud' },
  { key: 'priorities', title: 'Prioridades' },
  { key: 'statuses', title: 'Estados' },
  { key: 'modules', title: 'Modulos' }
] as const

const CatalogTable = ({ title, data }: { title: string; data: SupportCatalogDto[] }) => (
  <Card>
    <CardContent>
      <Typography variant='h6' sx={{ mb: 4 }}>
        {title}
      </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripcion</TableCell>
            <TableCell>Orden</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.descripcion || '-'}</TableCell>
              <TableCell>{item.orden}</TableCell>
              <TableCell>
                <Chip size='small' label={item.activo ? 'Activo' : 'Inactivo'} color={item.activo ? 'success' : 'default'} />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant='body2'>Sin registros.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

const CatalogSection = ({ group }: { group: (typeof catalogGroups)[number] }) => {
  const query = useQuery({
    queryKey: [SUPPORT_CATALOGS_QUERY_KEY, group.key],
    queryFn: () => fetchSupportCatalog(group.key),
    retry: 1
  })

  if (query.isLoading) {
    return <Spinner sx={{ height: 360 }} />
  }

  return <CatalogTable title={group.title} data={query.data ?? []} />
}

const SupportConfigurationPage = () => {
  return (
    <Grid container spacing={6}>
      {catalogGroups.map(group => (
        <Grid item xs={12} md={6} key={group.key}>
          <CatalogSection group={group} />
        </Grid>
      ))}
    </Grid>
  )
}

export default SupportConfigurationPage
