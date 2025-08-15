import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Box,
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  SelectChangeEvent
} from '@mui/material'

import usePlantillaBuilder from './hooks/UsePlantillaBuilder';
import DetalleProcesoAsociado from './components/DetalleProcesoAsociado'
import PlantillasDetalleProceso from './components/PlantillasDetalleProceso'

//servicios
import useFormulaService from '../services/formula/UseFormulaService';
import useVariableService from '../services/variable/UseVariableService';
import usePlantillaService from '../services/plantilla/UsePlantillaService';

interface Proceso {
  id: number
  nombre: string
}
interface DetalleProceso {
  id: number
  codigo: string
  descripcion: string
}
interface Plantilla {
  id: number
  codigo: string
  descripcion: string
}

const procesosMock: Proceso[] = [
  { id: 1, nombre: 'Proceso de Nómina' },
  { id: 2, nombre: 'Proceso de Presupuesto' },
  { id: 3, nombre: 'Proceso de Ejecución' }
]

// Mock detalles por proceso
const detalleProcesoMock: Record<number, DetalleProceso[]> = {
  14: [
    { id: 11, codigo: 'DET-NOM-01', descripcion: 'Detalle Sueldos' },
    { id: 12, codigo: 'DET-NOM-02', descripcion: 'Detalle Beneficios' }
  ],
  2: [
    { id: 21, codigo: 'DET-PRE-01', descripcion: 'Detalle Proyección' },
    { id: 22, codigo: 'DET-PRE-02', descripcion: 'Detalle Ajustes' }
  ],
  3: [
    { id: 31, codigo: 'DET-EJE-01', descripcion: 'Detalle Compromisos' },
    { id: 32, codigo: 'DET-EJE-02', descripcion: 'Detalle Pagos' }
  ]
}

// Mock plantillas por detalle
const plantillasMock: Record<number, Plantilla[]> = {
  11: [
    { id: 1001, codigo: 'PL-SUEL-BASE', descripcion: 'Plantilla Sueldos Base' },
    { id: 1002, codigo: 'PL-SUEL-VAR', descripcion: 'Plantilla Sueldos Variables' }
  ],
  12: [
    { id: 1003, codigo: 'PL-BEN-A', descripcion: 'Beneficios Alimentación' },
    { id: 1004, codigo: 'PL-BEN-S', descripcion: 'Beneficios Salud' }
  ],
  21: [{ id: 1005, codigo: 'PL-PROY-INI', descripcion: 'Proyección Inicial' }],
  22: [{ id: 1006, codigo: 'PL-AJUSTE-M', descripcion: 'Ajuste Mensual' }],
  31: [{ id: 1007, codigo: 'PL-COMP-GEN', descripcion: 'Compromiso General' }],
  32: [{ id: 1008, codigo: 'PL-PAG-PROG', descripcion: 'Pagos Programados' }]
}

interface PlantillaIndexProps {
  formulaService?: ReturnType<typeof useFormulaService> | null;
  variableService?: ReturnType<typeof useVariableService> | null;
  plantillaService?: ReturnType<typeof usePlantillaService> | null;
}

export default function PlantillaIndex({
  formulaService: formulaServiceProp = null,
  variableService: variableServiceProp = null,
  plantillaService: plantillaServiceProp = null
}: PlantillaIndexProps) {
  const [procesoId, setProcesoId] = useState<number | ''>('')
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<number | null>(null)

  const [loadingDetalle, setLoadingDetalle] = useState(false)
  const [loadingPlantillas, setLoadingPlantillas] = useState(false)

  const [detalles, setDetalles] = useState<DetalleProceso[]>([])
  // const [plantillas, setPlantillas] = useState<Plantilla[]>([])

  const formulaServiceFromHook = useFormulaService();
  const variableServiceFromHook = useVariableService();
  const plantillaServiceFromHook = usePlantillaService();

  const formulaService = formulaServiceProp ?? formulaServiceFromHook;
  const variableService = variableServiceProp ?? variableServiceFromHook;
  const plantillaService = plantillaServiceProp ?? plantillaServiceFromHook;

  const services = React.useMemo(() => ({
    formulaService,
    variableService,
    plantillaService
  }), [formulaService, variableService, plantillaService]);

  // Custom hook to manage plantilla builder logic
  const {
    plantillas, setPlantillas,
    error, message,
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso
  } = usePlantillaBuilder(services)

  // TODO: Reemplazar mocks por servicios:
  // const { getDetallesProceso } = useDetalleProcesoService()
  // const { getPlantillasPorDetalle } = usePlantillaService()

  const procesos = useMemo(() => procesosMock, [])

  const fetchDetalles = useCallback((procId: number) => {
    setLoadingDetalle(true)
    setDetalles([])
    setDetalleSeleccionado(null)
    setPlantillas([])
    setTimeout(() => {
      setDetalles(detalleProcesoMock[procId] || [])
      setLoadingDetalle(false)
    }, 500)
  }, [])

  const fetchPlantillas = useCallback((detalleId: number) => {
    setLoadingPlantillas(true)
    setPlantillas([])
    setTimeout(() => {
      setPlantillas(plantillasMock[detalleId] || [])
      setLoadingPlantillas(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (procesoId !== '') fetchDetalles(Number(procesoId))
  }, [procesoId, fetchDetalles])

  useEffect(() => {
    if (detalleSeleccionado != null) fetchPlantillas(detalleSeleccionado)
  }, [detalleSeleccionado, fetchPlantillas])

  //Cuando se selecciona del proceso
  const handleProcesoChange = (e: SelectChangeEvent) => {
    const value = e.target.value
    console.log('Proceso seleccionado:', Number(value))

    getListDetalleProcesos(Number(value))

    setProcesoId(value === '' ? '' : Number(value))
  }

  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3
          }}
        >

          <Box sx={{ p: 3, borderBottom: theme => `1px solid ${theme.palette.divider}` }}>
            <FormControl fullWidth size="small">
              <InputLabel id="proceso-label">Proceso</InputLabel>
              <Select
                labelId="proceso-label"
                label="Proceso"
                value={procesoId === '' ? '' : String(procesoId)}
                onChange={handleProcesoChange}
              >
                {Array.isArray(plantillas) && plantillas.length > 0 ? (
                  plantillas.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.descripcion}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No hay procesos disponibles
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Grid container sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                height: '100%',
                overflowY: 'auto',
                p: 3,
                borderRight: theme => ({ md: `1px solid ${theme.palette.divider}` })
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Detalles del Proceso
              </Typography>

              {procesoId === '' && (
                <Typography variant="body2" color="text.secondary">
                  Selecciona un proceso para ver sus detalles.
                </Typography>
              )}

              {loadingDetalle && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Cargando detalles...</Typography>
                </Box>
              )}

              {!loadingDetalle && procesoId !== '' && detalles.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No hay detalles disponibles.
                </Typography>
              )}

              <DetalleProcesoAsociado
                detalles={detalles}
                selectedId={detalleSeleccionado}
                onSelect={setDetalleSeleccionado}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                height: '100%',
                overflowY: 'auto',
                p: 3
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Plantillas del Detalle
              </Typography>

              {detalleSeleccionado == null && (
                <Typography variant="body2" color="text.secondary">
                  Selecciona un detalle para ver sus plantillas.
                </Typography>
              )}

              {loadingPlantillas && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Cargando plantillas...</Typography>
                </Box>
              )}

              <PlantillasDetalleProceso
                plantillas={plantillas}
                detalleId={detalleSeleccionado}
                loading={loadingPlantillas}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}
