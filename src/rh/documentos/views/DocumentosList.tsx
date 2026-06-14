import { Box, Card, CardActions, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Spinner from 'src/@core/components/spinner'
import { RootState } from 'src/store'
import { IRhDocumentoResponseDto } from 'src/interfaces/rh/RhDocumentoResponseDto'
import {
  defaultRhDocumento,
  setOperacionCrudRhDocumento,
  setRhDocumentoSeleccionado,
  setVerRhDocumentoActive
} from 'src/store/apps/rh-documentos'
import DialogRhDocumentoInfo from './DialogRhDocumentoInfo'
import { DOCUMENTOS_QUERY_KEY, fetchRhDocumentosByPersona } from '../services/rhDocumentosService'

interface CellType {
  row: IRhDocumentoResponseDto
}

const formatDate = (value: string | null) => {
  if (!value || value.startsWith('0001-01-01')) {
    return ''
  }

  return value.slice(0, 10)
}

const DocumentosList = () => {
  const dispatch = useDispatch()
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)
  const codigoPersona = personaSeleccionado?.codigoPersona ?? 0

  const query = useQuery({
    queryKey: [DOCUMENTOS_QUERY_KEY, codigoPersona],
    queryFn: () => fetchRhDocumentosByPersona(codigoPersona),
    enabled: codigoPersona > 0,
    retry: 1
  })
  const documentos = query.data?.data ?? []
  const totalRegistros = query.data?.cantidadRegistros ?? documentos.length

  const columns = [
    {
      flex: 0.1,
      field: 'codigoDocumento',
      minWidth: 70,
      headerName: '# ID'
    },
    {
      flex: 0.25,
      minWidth: 160,
      field: 'tipoDocumento',
      headerName: 'Tipo',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row.tipoDocumento || row.descripcionDocumento}</Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'numeroDocumento',
      headerName: 'Numero',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.numeroDocumento}</Typography>
    },
    {
      flex: 0.16,
      minWidth: 130,
      field: 'fechaVencimiento',
      headerName: 'Vencimiento',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{formatDate(row.fechaVencimiento)}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'tipoGrado',
      headerName: 'Tipo Grado',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row.tipoGrado || row.descripcionTipoGrado}</Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'grado',
      headerName: 'Grado',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.grado || row.descripcionGrado}</Typography>
    }
  ]

  const handleView = (row: IRhDocumentoResponseDto) => {
    dispatch(setRhDocumentoSeleccionado(row))
    dispatch(setOperacionCrudRhDocumento(2))
    dispatch(setVerRhDocumentoActive(true))
  }

  const handleAdd = () => {
    if (codigoPersona <= 0) {
      return
    }

    dispatch(setRhDocumentoSeleccionado({ ...defaultRhDocumento, codigoPersona }))
    dispatch(setOperacionCrudRhDocumento(1))
    dispatch(setVerRhDocumentoActive(true))
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Agregar'>
              <span>
                <IconButton color='primary' size='small' onClick={handleAdd} disabled={codigoPersona <= 0}>
                  <Icon icon='ci:add-row' fontSize={20} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Tabla'>
              <IconButton size='small' color='primary'>
                <Icon icon='fluent:table-24-regular' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
        {query.isLoading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Box sx={{ height: 450 }}>
            <DataGrid
              getRowId={row => row.codigoDocumento}
              columns={columns}
              rows={documentos}
              rowCount={totalRegistros}
              pageSize={100}
              rowsPerPageOptions={[10, 25, 50, 100]}
              pagination
              onRowDoubleClick={row => handleView(row.row)}
            />
          </Box>
        )}
        {query.isError && (
          <Typography sx={{ color: 'error.main', px: 4, pb: 4 }} variant='body2'>
            {(query.error as Error).message}
          </Typography>
        )}
      </Card>
      <DatePickerWrapper>
        <DialogRhDocumentoInfo />
      </DatePickerWrapper>
    </Grid>
  )
}

export default DocumentosList
