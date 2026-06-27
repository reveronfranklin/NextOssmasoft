import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField } from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { BmRow } from 'src/interfaces/Bm/bienes-municipales'
import { bienesMunicipalesEndpoints, bmPost } from 'src/Bm/services/bienesMunicipales.service'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

type CatalogoKey = 'titulos' | 'descriptivas' | 'clasificacion' | 'articulos' | 'detalleArticulos'
type RowWithId = BmRow & { id: number }

const catalogos = [
  { key: 'titulos', label: 'Titulos' },
  { key: 'descriptivas', label: 'Descriptivas' },
  { key: 'clasificacion', label: 'Clasificacion' },
  { key: 'articulos', label: 'Articulos' },
  { key: 'detalleArticulos', label: 'Detalle de articulos' }
] as const

const baseColumns: Record<CatalogoKey, GridColumns<RowWithId>> = {
  titulos: [
    { field: 'tituloId', headerName: 'Id', width: 80 },
    { field: 'titulo', headerName: 'Titulo', minWidth: 240, flex: 1 },
    { field: 'codigo', headerName: 'Codigo', width: 120 },
    { field: 'extra1', headerName: 'Extra 1', minWidth: 160 }
  ],
  descriptivas: [
    { field: 'descripcionId', headerName: 'Id', width: 80 },
    { field: 'tituloId', headerName: 'Titulo Id', width: 110 },
    { field: 'descripcion', headerName: 'Descripcion', minWidth: 260, flex: 1 },
    { field: 'codigo', headerName: 'Codigo', width: 120 },
    { field: 'extra1', headerName: 'Extra 1', minWidth: 160 }
  ],
  clasificacion: [
    { field: 'codigoClasificacionBien', headerName: 'Id', width: 80 },
    { field: 'codigoGrupo', headerName: 'Grupo', width: 90 },
    { field: 'codigoNivel1', headerName: 'N1', width: 80 },
    { field: 'codigoNivel2', headerName: 'N2', width: 80 },
    { field: 'codigoNivel3', headerName: 'N3', width: 80 },
    { field: 'denominacion', headerName: 'Denominacion', minWidth: 260, flex: 1 },
    { field: 'descripcion', headerName: 'Descripcion', minWidth: 240, flex: 1 }
  ],
  articulos: [
    { field: 'codigoArticulo', headerName: 'Id', width: 80 },
    { field: 'codigoClasificacionBien', headerName: 'Clasificacion', width: 130 },
    { field: 'codigo', headerName: 'Codigo', width: 120 },
    { field: 'denominacion', headerName: 'Denominacion', minWidth: 260, flex: 1 },
    { field: 'descripcion', headerName: 'Descripcion', minWidth: 240, flex: 1 }
  ],
  detalleArticulos: [
    { field: 'codigoDetalleArticulo', headerName: 'Id', width: 80 },
    { field: 'codigoArticulo', headerName: 'Articulo', width: 110 },
    { field: 'tipoEspecificacionId', headerName: 'Tipo Id', width: 110 },
    { field: 'tipoEspecificacion', headerName: 'Tipo especificacion', minWidth: 260, flex: 1 }
  ]
}

const idFields: Record<CatalogoKey, string> = {
  titulos: 'tituloId',
  descriptivas: 'descripcionId',
  clasificacion: 'codigoClasificacionBien',
  articulos: 'codigoArticulo',
  detalleArticulos: 'codigoDetalleArticulo'
}

const buildEndpoint = (catalogo: CatalogoKey) => {
  if (catalogo === 'titulos') return bienesMunicipalesEndpoints.catalogos.titulos
  if (catalogo === 'descriptivas') return bienesMunicipalesEndpoints.catalogos.descriptivas
  if (catalogo === 'clasificacion') return bienesMunicipalesEndpoints.catalogos.clasificacion
  if (catalogo === 'detalleArticulos') return bienesMunicipalesEndpoints.catalogos.detalleArticulosByArticulo

  return bienesMunicipalesEndpoints.catalogos.articulos
}

const escapeCsv = (value: unknown) => {
  const text = String(value ?? '')

  return `"${text.replace(/"/g, '""')}"`
}

const downloadCsv = (fileName: string, rows: RowWithId[], columns: GridColumns<RowWithId>) => {
  const visibleColumns = columns.filter(column => Boolean(column.field))
  const header = visibleColumns.map(column => escapeCsv(column.headerName || column.field)).join(',')
  const body = rows.map(row => visibleColumns.map(column => escapeCsv(row[column.field])).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const CatalogosList = () => {
  const [catalogo, setCatalogo] = useState<CatalogoKey>('titulos')
  const [searchText, setSearchText] = useState('')
  const [tituloId, setTituloId] = useState('0')
  const [codigoArticulo, setCodigoArticulo] = useState('0')
  const [rows, setRows] = useState<RowWithId[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const columns = useMemo(() => baseColumns[catalogo], [catalogo])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')
      const payload =
        catalogo === 'descriptivas'
          ? { tituloId: Number(tituloId) || 0, searchText, page: 1, pageSize: 100 }
          : catalogo === 'detalleArticulos'
          ? { codigoArticulo: Number(codigoArticulo) || 0 }
          : { searchText, page: 1, pageSize: 100 }
      const data = await bmPost<BmRow[], unknown>(buildEndpoint(catalogo), payload, [])
      const idField = idFields[catalogo]
      setRows(data.map((item, index) => ({ ...item, id: Number(item[idField] ?? index + 1) || index + 1 })))
    } catch (error) {
      setRows([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar el catalogo')
    } finally {
      setLoading(false)
    }
  }, [catalogo, searchText, tituloId, codigoArticulo])

  const handleExport = () => {
    downloadCsv(`bm-${catalogo}.csv`, rows, columns)
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Catalogos BM' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Catalogo'
                  value={catalogo}
                  onChange={event => setCatalogo(event.target.value as CatalogoKey)}
                >
                  {catalogos.map(item => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {catalogo === 'descriptivas' ? (
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Titulo Id'
                    value={tituloId}
                    onChange={event => setTituloId(event.target.value)}
                  />
                </Grid>
              ) : null}
              {catalogo === 'detalleArticulos' ? (
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Articulo Id'
                    value={codigoArticulo}
                    onChange={event => setCodigoArticulo(event.target.value)}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12} md={catalogo === 'descriptivas' || catalogo === 'detalleArticulos' ? 2 : 4}>
                <TextField
                  fullWidth
                  size='small'
                  label='Buscar'
                  value={searchText}
                  disabled={catalogo === 'detalleArticulos'}
                  onChange={event => setSearchText(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant='contained' startIcon={<SearchOutlinedIcon />} onClick={loadData}>
                  Consultar
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant='outlined'
                  startIcon={<FileDownloadOutlinedIcon />}
                  disabled={rows.length === 0}
                  onClick={handleExport}
                >
                  Exportar
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <BmScreenHelpButton title='Catalogos BM' docPath='/bm-docs/catalogos-bm.md' />
              </Grid>
            </Grid>
            {message ? (
              <Alert severity='warning' sx={{ mt: 4 }}>
                {message}
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Resultado' />
          <CardContent>
            <Box sx={{ height: 560, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CatalogosList
