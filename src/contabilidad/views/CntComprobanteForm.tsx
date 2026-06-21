import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { CntAuxiliarDto, CntDetalleCreateDto, CntMayorDto } from '../interfaces/CntDtos'
import {
  CNT_CATALOGS_QUERY_KEY,
  CNT_PERIODOS_QUERY_KEY,
  CNT_PERMISSION_EDIT_AUTOMATIC,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  createCntComprobante,
  fetchCntCatalog,
  fetchCntComprobanteById,
  fetchCntDetalles,
  fetchCntPeriodos,
  searchCntAuxiliares,
  searchCntMayores,
  updateCntComprobante
} from '../services/cntService'

interface DetailRow extends CntDetalleCreateDto {
  id: number
  mayorLabel: string
  auxiliarLabel: string
  debe: number
  haber: number
}

interface Props {
  codigoComprobante?: number
}

const emptyDetail: DetailRow = {
  id: 0,
  codigoMayor: 0,
  codigoAuxiliar: 0,
  mayorLabel: '',
  auxiliarLabel: '',
  referencia1: '',
  referencia2: '',
  referencia3: '',
  descripcion: '',
  monto: 0,
  debe: 0,
  haber: 0
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const toDateInput = (value?: string) => (value ? value.slice(0, 10) : '')

const CntComprobanteForm = ({ codigoComprobante }: Props) => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const isEdit = Boolean(codigoComprobante)
  const [form, setForm] = useState({
    codigoPeriodo: 0,
    tipoComprobanteId: 0,
    origenId: 0,
    fechaComprobante: '',
    observacion: ''
  })
  const [detail, setDetail] = useState<DetailRow>(emptyDetail)
  const [details, setDetails] = useState<DetailRow[]>([])
  const [mayorSearch, setMayorSearch] = useState('')
  const [auxiliarSearch, setAuxiliarSearch] = useState('')

  const comprobanteQuery = useQuery({
    queryKey: ['cnt-comprobante', codigoComprobante, currentUserId],
    queryFn: () => fetchCntComprobanteById(Number(codigoComprobante), currentUserId),
    enabled: isEdit && currentUserId > 0,
    retry: 1
  })
  const detallesQuery = useQuery({
    queryKey: ['cnt-comprobante-detalles', codigoComprobante, currentUserId],
    queryFn: () => fetchCntDetalles(Number(codigoComprobante), currentUserId),
    enabled: isEdit && currentUserId > 0,
    retry: 1
  })
  const periodosQuery = useQuery({ queryKey: [CNT_PERIODOS_QUERY_KEY, true], queryFn: () => fetchCntPeriodos(true), retry: 1 })
  const tiposQuery = useQuery({ queryKey: [CNT_CATALOGS_QUERY_KEY, 'tipos-comprobante'], queryFn: () => fetchCntCatalog('tipos-comprobante'), retry: 1 })
  const origenesQuery = useQuery({ queryKey: [CNT_CATALOGS_QUERY_KEY, 'origenes-comprobante'], queryFn: () => fetchCntCatalog('origenes-comprobante'), retry: 1 })
  const mayoresQuery = useQuery({ queryKey: ['cnt-mayores-form', mayorSearch], queryFn: () => searchCntMayores(mayorSearch), retry: 1 })
  const auxiliaresQuery = useQuery({
    queryKey: ['cnt-auxiliares-form', auxiliarSearch, detail.codigoMayor],
    queryFn: () => searchCntAuxiliares(auxiliarSearch, detail.codigoMayor || undefined),
    retry: 1
  })
  const automaticEditPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_EDIT_AUTOMATIC, currentUserId],
    queryFn: async () => {
      try {
        return await checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_EDIT_AUTOMATIC })
      } catch {
        return { hasPermission: false, permission: CNT_PERMISSION_EDIT_AUTOMATIC }
      }
    },
    enabled: isEdit && currentUserId > 0,
    retry: 1
  })
  const isAutomatic = Boolean(comprobanteQuery.data?.esAutomatico)
  const canEditAutomatic = automaticEditPermissionQuery.data?.hasPermission === true
  const isReadOnlyAutomatic = isAutomatic && !canEditAutomatic

  useEffect(() => {
    if (!comprobanteQuery.data) {
      return
    }

    setForm({
      codigoPeriodo: comprobanteQuery.data.codigoPeriodo,
      tipoComprobanteId: comprobanteQuery.data.tipoComprobanteId,
      origenId: comprobanteQuery.data.origenId ?? 0,
      fechaComprobante: toDateInput(comprobanteQuery.data.fechaComprobante),
      observacion: comprobanteQuery.data.observacion ?? ''
    })
  }, [comprobanteQuery.data])

  useEffect(() => {
    if (!detallesQuery.data) {
      return
    }

    setDetails(
      detallesQuery.data.map(item => ({
        id: item.codigoDetalleComprobante,
        codigoMayor: item.codigoMayor,
        codigoAuxiliar: item.codigoAuxiliar,
        mayorLabel: item.mayor,
        auxiliarLabel: item.auxiliar,
        referencia1: item.referencia1,
        referencia2: item.referencia2,
        referencia3: item.referencia3,
        descripcion: item.descripcion,
        monto: item.monto,
        debe: item.debe,
        haber: item.haber
      }))
    )
  }, [detallesQuery.data])

  const totals = useMemo(() => {
    const debe = details.reduce((sum, item) => sum + Number(item.debe || 0), 0)
    const haber = details.reduce((sum, item) => sum + Number(item.haber || 0), 0)

    return { debe, haber, diferencia: debe - haber }
  }, [details])

  const addDetail = () => {
    if (isReadOnlyAutomatic) {
      toast.error('El comprobante automatico no puede editarse')

      return
    }

    if (!detail.codigoMayor || !detail.codigoAuxiliar) {
      toast.error('Seleccione mayor y auxiliar')

      return
    }

    if (Number(detail.debe || 0) <= 0 && Number(detail.haber || 0) <= 0) {
      toast.error('Indique Debe o Haber')

      return
    }

    const debe = Number(detail.debe || 0)
    const haber = Number(detail.haber || 0)
    const monto = debe > 0 ? -Math.abs(debe) : Math.abs(haber)

    setDetails(current => [
      ...current,
      {
        ...detail,
        id: Date.now(),
        monto,
        debe,
        haber
      }
    ])
    setDetail(emptyDetail)
    setMayorSearch('')
    setAuxiliarSearch('')
  }

  const removeDetail = (id: number) => {
    if (isReadOnlyAutomatic) {
      toast.error('El comprobante automatico no puede editarse')

      return
    }

    setDetails(current => current.filter(item => item.id !== id))
  }

  const handleSubmit = async () => {
    if (isReadOnlyAutomatic) {
      toast.error('El comprobante automatico no puede editarse')

      return
    }

    if (currentUserId <= 0) {
      toast.error('No se pudo identificar el usuario autenticado')

      return
    }

    if (!form.codigoPeriodo || !form.tipoComprobanteId || !form.fechaComprobante) {
      toast.error('Complete periodo, tipo y fecha')

      return
    }

    if (details.length === 0) {
      toast.error('Agregue al menos una linea de detalle')

      return
    }

    if (Math.abs(totals.diferencia) >= 0.01) {
      toast.error('El comprobante no esta cuadrado')

      return
    }

    const payload = {
      codigoComprobante,
      usuarioId: currentUserId,
      codigoPeriodo: form.codigoPeriodo,
      tipoComprobanteId: form.tipoComprobanteId,
      fechaComprobante: form.fechaComprobante,
      origenId: form.origenId || undefined,
      observacion: form.observacion,
      detalles: details.map(item => ({
        codigoMayor: item.codigoMayor,
        codigoAuxiliar: item.codigoAuxiliar,
        referencia1: item.referencia1,
        referencia2: item.referencia2,
        referencia3: item.referencia3,
        descripcion: item.descripcion,
        monto: item.monto
      }))
    }

    const result = isEdit ? await updateCntComprobante(payload) : await createCntComprobante(payload)

    if (result.isValid) {
      toast.success('Comprobante guardado')
      router.push('/apps/cnt/comprobantes')
    } else {
      toast.error(result.message)
    }
  }

  const columns: GridColumns<DetailRow> = [
    { flex: 0.16, minWidth: 170, field: 'mayorLabel', headerName: 'Mayor' },
    { flex: 0.2, minWidth: 210, field: 'auxiliarLabel', headerName: 'Auxiliar' },
    { flex: 0.22, minWidth: 220, field: 'descripcion', headerName: 'Descripcion' },
    { flex: 0.1, minWidth: 120, field: 'debe', headerName: 'Debe', align: 'right', headerAlign: 'right', valueGetter: ({ row }: { row: DetailRow }) => formatMoney(row.debe) },
    { flex: 0.1, minWidth: 120, field: 'haber', headerName: 'Haber', align: 'right', headerAlign: 'right', valueGetter: ({ row }: { row: DetailRow }) => formatMoney(row.haber) },
    {
      flex: 0.06,
      minWidth: 70,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: { row: DetailRow }) => (
        <Tooltip title='Eliminar linea'>
          <IconButton color='error' size='small' disabled={isReadOnlyAutomatic} onClick={() => removeDetail(row.id)}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  if (comprobanteQuery.isLoading || detallesQuery.isLoading) {
    return <Spinner sx={{ height: 450 }} />
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select disabled={isReadOnlyAutomatic} label='Periodo' value={form.codigoPeriodo} onChange={event => setForm({ ...form, codigoPeriodo: Number(event.target.value) })}>
                {(periodosQuery.data ?? []).map(item => <MenuItem key={item.codigoPeriodo} value={item.codigoPeriodo}>{item.nombrePeriodo}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select disabled={isReadOnlyAutomatic} label='Tipo' value={form.tipoComprobanteId} onChange={event => setForm({ ...form, tipoComprobanteId: Number(event.target.value) })}>
                {(tiposQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.descripcion}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select disabled={isReadOnlyAutomatic} label='Origen' value={form.origenId} onChange={event => setForm({ ...form, origenId: Number(event.target.value) })}>
                <MenuItem value={0}>Sin origen</MenuItem>
                {(origenesQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.descripcion}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth disabled={isReadOnlyAutomatic} type='date' label='Fecha' InputLabelProps={{ shrink: true }} value={form.fechaComprobante} onChange={event => setForm({ ...form, fechaComprobante: event.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth disabled={isReadOnlyAutomatic} multiline minRows={2} label='Observacion' value={form.observacion} onChange={event => setForm({ ...form, observacion: event.target.value })} />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Autocomplete
                disabled={isReadOnlyAutomatic}
                options={mayoresQuery.data ?? []}
                getOptionLabel={(option: CntMayorDto) => `${option.numeroMayor} - ${option.denominacion}`}
                onInputChange={(_, value) => setMayorSearch(value)}
                onChange={(_, value) => setDetail({ ...detail, codigoMayor: value?.codigoMayor ?? 0, mayorLabel: value ? `${value.numeroMayor} - ${value.denominacion}` : '', codigoAuxiliar: 0, auxiliarLabel: '' })}
                renderInput={params => <TextField {...params} label='Mayor' />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                disabled={isReadOnlyAutomatic}
                options={auxiliaresQuery.data ?? []}
                getOptionLabel={(option: CntAuxiliarDto) => `${option.segmento1} ${option.segmento2} - ${option.denominacion}`}
                onInputChange={(_, value) => setAuxiliarSearch(value)}
                onChange={(_, value) => setDetail({ ...detail, codigoAuxiliar: value?.codigoAuxiliar ?? 0, auxiliarLabel: value ? `${value.segmento1} ${value.segmento2} - ${value.denominacion}` : '' })}
                renderInput={params => <TextField {...params} label='Auxiliar' />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth disabled={isReadOnlyAutomatic} label='Descripcion' value={detail.descripcion} onChange={event => setDetail({ ...detail, descripcion: event.target.value })} />
            </Grid>
            <Grid item xs={6} md={1}>
              <TextField fullWidth disabled={isReadOnlyAutomatic} type='number' label='Debe' value={detail.debe} onChange={event => setDetail({ ...detail, debe: Number(event.target.value), haber: 0 })} />
            </Grid>
            <Grid item xs={6} md={1}>
              <TextField fullWidth disabled={isReadOnlyAutomatic} type='number' label='Haber' value={detail.haber} onChange={event => setDetail({ ...detail, haber: Number(event.target.value), debe: 0 })} />
            </Grid>
            <Grid item xs={12} md={1}>
              <Tooltip title='Agregar linea'>
                <IconButton color='primary' disabled={isReadOnlyAutomatic} sx={{ mt: 1 }} onClick={addDetail}>
                  <Icon icon='mdi:plus' />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Box sx={{ height: 360, mt: 4 }}>
            <DataGrid getRowId={row => row.id} columns={columns} rows={details} hideFooter />
          </Box>
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'flex-end', mt: 4, flexWrap: 'wrap' }}>
            <Typography>Debe: {formatMoney(totals.debe)}</Typography>
            <Typography>Haber: {formatMoney(totals.haber)}</Typography>
            <Typography color={Math.abs(totals.diferencia) < 0.01 ? 'success.main' : 'error.main'}>
              Diferencia: {formatMoney(totals.diferencia)}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button variant='outlined' onClick={() => router.push('/apps/cnt/comprobantes')}>Cancelar</Button>
          <Button variant='contained' disabled={isReadOnlyAutomatic} onClick={handleSubmit}>Guardar</Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default CntComprobanteForm
