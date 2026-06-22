import { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/utilities/pickers/PickersCustomInput'
import {
  descargarReporteBm1Excel,
  generarReporteBm1Pdf,
  getReporteBm1Data,
  getReporteBm1Icps
} from '../services/reporteBm1.service'
import { ReporteBm1IcpDto, ReporteBm1ItemDto } from '../interfaces/reporteBm1.types'

const columns: GridColumns<ReporteBm1ItemDto & { id: number }> = [
  { field: 'unidadTrabajo', headerName: 'Unidad Trabajo', minWidth: 220, flex: 1.4 },
  { field: 'codigoGrupo', headerName: 'Grupo', width: 80 },
  { field: 'codigoNivel1', headerName: 'Nivel 1', width: 85 },
  { field: 'codigoNivel2', headerName: 'Nivel 2', width: 85 },
  { field: 'numeroLote', headerName: 'Lote', width: 90 },
  { field: 'cantidad', headerName: 'Cant.', width: 90, type: 'number' },
  { field: 'numeroPlaca', headerName: 'Placa', minWidth: 130 },
  {
    field: 'valorActual',
    headerName: 'Valor Actual',
    minWidth: 130,
    type: 'number',
    valueFormatter: params => Number(params.value ?? 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })
  },
  { field: 'articulo', headerName: 'Articulo', minWidth: 190, flex: 1 },
  { field: 'especificacion', headerName: 'Especificacion', minWidth: 220, flex: 1.2 },
  { field: 'servicio', headerName: 'Servicio', minWidth: 170 },
  { field: 'responsableBien', headerName: 'Responsable', minWidth: 190 },
  {
    field: 'fechaMovimiento',
    headerName: 'Fecha',
    width: 120,
    valueFormatter: params => {
      if (!params.value) return ''
      const date = new Date(params.value as string)

      return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-VE')
    }
  }
]

const ReporteBm1View = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  const today = useMemo(() => new Date(), [])
  const firstDay = useMemo(() => new Date(today.getFullYear(), 0, 1), [today])

  const [fechaDesde, setFechaDesde] = useState<Date>(firstDay)
  const [fechaHasta, setFechaHasta] = useState<Date>(today)
  const [icps, setIcps] = useState<ReporteBm1IcpDto[]>([])
  const [selectedIcps, setSelectedIcps] = useState<ReporteBm1IcpDto[]>([])
  const [rows, setRows] = useState<(ReporteBm1ItemDto & { id: number })[]>([])
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [loadingIcps, setLoadingIcps] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [message, setMessage] = useState<string>('')

  const buildCurrentPayload = useCallback(
    () => ({
      fechaDesde,
      fechaHasta,
      codigosIcp: selectedIcps.map(item => item.codigoIcp)
    }),
    [fechaDesde, fechaHasta, selectedIcps]
  )

  const clearPdfPreview = useCallback(() => {
    setPdfUrl(previousUrl => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl)
      }

      return ''
    })
  }, [])

  const loadIcps = useCallback(async () => {
    try {
      setLoadingIcps(true)
      setMessage('')
      setIcps(await getReporteBm1Icps())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo cargar la lista de ICP')
    } finally {
      setLoadingIcps(false)
    }
  }, [])

  useEffect(() => {
    loadIcps()
  }, [loadIcps])

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const handleFechaDesde = (value: Date) => {
    setFechaDesde(value)
    clearPdfPreview()

    if (value > fechaHasta) {
      setFechaHasta(value)
    }
  }

  const handleFechaHasta = (value: Date) => {
    setFechaHasta(value)
    clearPdfPreview()
  }

  const handleIcps = (value: ReporteBm1IcpDto[]) => {
    setSelectedIcps(value)
    clearPdfPreview()
  }

  const handleGetData = async () => {
    try {
      setLoadingData(true)
      setMessage('')
      clearPdfPreview()
      const data = await getReporteBm1Data(buildCurrentPayload())
      setRows(data.map((item, index) => ({ ...item, id: index + 1 })))
    } catch (error) {
      setRows([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar el reporte BM1')
    } finally {
      setLoadingData(false)
    }
  }

  const handlePreviewPdf = async () => {
    try {
      setLoadingPdf(true)
      setMessage('')
      const currentPayload = buildCurrentPayload()
      const url = await generarReporteBm1Pdf(currentPayload)
      setPdfUrl(previousUrl => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl)
        }

        return url
      })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo generar el PDF BM1')
    } finally {
      setLoadingPdf(false)
    }
  }

  const handleExcel = async () => {
    try {
      setLoadingExcel(true)
      setMessage('')
      await descargarReporteBm1Excel(buildCurrentPayload())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo descargar el Excel BM1')
    } finally {
      setLoadingExcel(false)
    }
  }

  const isBusy = loadingData || loadingPdf || loadingExcel

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Reporte BM1' />
          <CardContent>
            <Grid container spacing={4} alignItems='center'>
              <Grid item xs={12} md={3}>
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  selected={fechaDesde}
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handleFechaDesde(date)}
                  customInput={<CustomInput label='Fecha Desde' />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  selected={fechaHasta}
                  minDate={fechaDesde}
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handleFechaHasta(date)}
                  customInput={<CustomInput label='Fecha Hasta' />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  loading={loadingIcps}
                  options={icps}
                  value={selectedIcps}
                  onChange={(_, value) => handleIcps(value)}
                  getOptionLabel={option => `${option.codigoIcp} - ${option.unidadTrabajo}`}
                  isOptionEqualToValue={(option, value) => option.codigoIcp === value.codigoIcp}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='ICP'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingIcps ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant='outlined'
                    startIcon={<SearchOutlinedIcon />}
                    disabled={isBusy}
                    onClick={handleGetData}
                  >
                    Consultar
                  </Button>
                  <Button
                    variant='contained'
                    startIcon={loadingPdf ? <CircularProgress color='inherit' size={18} /> : <PictureAsPdfOutlinedIcon />}
                    disabled={isBusy}
                    onClick={handlePreviewPdf}
                  >
                    Vista previa PDF
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={loadingExcel ? <CircularProgress color='inherit' size={18} /> : <FileDownloadOutlinedIcon />}
                    disabled={isBusy}
                    onClick={handleExcel}
                  >
                    Descargar Excel
                  </Button>
                </Stack>
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
          <CardHeader title='Vista previa PDF' />
          <CardContent>
            <Box
              sx={{
                height: 760,
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {loadingPdf ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 3
                  }}
                >
                  <CircularProgress />
                  <Typography variant='body2'>Generando reporte PDF...</Typography>
                </Box>
              ) : pdfUrl ? (
                <object data={pdfUrl} type='application/pdf' width='100%' height='100%'>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    No se pudo mostrar el PDF en el navegador.
                  </Box>
                </object>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary'
                  }}
                >
                  Seleccione los filtros y genere la vista previa.
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Datos consultados' />
          <CardContent>
            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loadingData}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
              />
            </Box>
            <Typography variant='body2' sx={{ mt: 3, color: 'text.secondary' }}>
              Registros: {rows.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReporteBm1View
