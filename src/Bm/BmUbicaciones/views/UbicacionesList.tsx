import { useCallback, useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CardHeader, Grid, Stack, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { BmRow, BmUbicacionRow } from 'src/interfaces/Bm/bienes-municipales'
import { bienesMunicipalesEndpoints, bmPost } from 'src/Bm/services/bienesMunicipales.service'

type RowWithId<T> = T & { id: number }

const ubicacionesColumns: GridColumns<RowWithId<BmUbicacionRow>> = [
  { field: 'codigoDirBien', headerName: 'Id', width: 80 },
  { field: 'codigoIcp', headerName: 'ICP', width: 110 },
  { field: 'unidadEjecutora', headerName: 'Unidad', minWidth: 260, flex: 1 },
  { field: 'direccion', headerName: 'Direccion', minWidth: 320, flex: 1.4 },
  { field: 'vialidad', headerName: 'Vialidad', minWidth: 180 },
  { field: 'vivienda', headerName: 'Vivienda', minWidth: 150 },
  { field: 'nivel', headerName: 'Nivel', width: 100 }
]

const historicoColumns: GridColumns<RowWithId<BmRow>> = [
  { field: 'codigoHDirBien', headerName: 'Id', width: 80 },
  { field: 'codigoDirBien', headerName: 'Dir', width: 90 },
  { field: 'codigoIcp', headerName: 'ICP', width: 110 },
  { field: 'unidadEjecutora', headerName: 'Unidad', minWidth: 240, flex: 1 },
  { field: 'direccion', headerName: 'Direccion', minWidth: 320, flex: 1.4 },
  { field: 'fechaHIns', headerName: 'Historico', minWidth: 150 }
]

const UbicacionesList = () => {
  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState<RowWithId<BmUbicacionRow>[]>([])
  const [historico, setHistorico] = useState<RowWithId<BmRow>[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingHistorico, setLoadingHistorico] = useState(false)
  const [message, setMessage] = useState('')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')
      const data = await bmPost<BmUbicacionRow[], unknown>(
        bienesMunicipalesEndpoints.ubicaciones.getAll,
        { searchText, page: 1, pageSize: 100 },
        []
      )
      setRows(data.map((item, index) => ({ ...item, id: Number(item.codigoDirBien ?? index + 1) || index + 1 })))
    } catch (error) {
      setRows([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar ubicaciones')
    } finally {
      setLoading(false)
    }
  }, [searchText])

  const loadHistorico = async (row: BmUbicacionRow) => {
    try {
      setLoadingHistorico(true)
      setMessage('')
      const data = await bmPost<BmRow[], unknown>(
        bienesMunicipalesEndpoints.ubicaciones.historicoByDir,
        { codigoDirBien: row.codigoDirBien ?? 0 },
        []
      )
      setHistorico(
        data.map((item, index) => ({ ...item, id: Number(item.codigoHDirBien ?? index + 1) || index + 1 }))
      )
    } catch (error) {
      setHistorico([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar historico de ubicacion')
    } finally {
      setLoadingHistorico(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Ubicaciones BM' />
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                size='small'
                label='Buscar ubicacion o unidad'
                value={searchText}
                onChange={event => setSearchText(event.target.value)}
              />
              <Button variant='contained' startIcon={<SearchOutlinedIcon />} onClick={loadData}>
                Consultar
              </Button>
            </Stack>
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
          <CardHeader title='Ubicaciones registradas' />
          <CardContent>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={ubicacionesColumns}
                loading={loading}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
                onRowClick={params => loadHistorico(params.row)}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Historico de ubicacion' />
          <CardContent>
            <Box sx={{ height: 360, width: '100%' }}>
              <DataGrid
                rows={historico}
                columns={historicoColumns}
                loading={loadingHistorico}
                pageSize={10}
                rowsPerPageOptions={[10, 25]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UbicacionesList
