import React, { useEffect, useState } from 'react'
import { Box, Container, Paper, Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, SelectChangeEvent } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

import usePlantillaBuilder from './hooks/UsePlantillaBuilder';
import useFormulaBuilder from './../formulas/hooks/useFormulaBuilder';

import DetalleProcesoAsociado from './components/DetalleProcesoAsociado'
import PlantillasDetalleProceso from './components/PlantillasDetalleProceso'
import ListaVariablePorProceso from './components/ListaVariablePorProceso';

import useFormulaService from '../services/formula/UseFormulaService';
import useVariableService from '../services/variable/UseVariableService';
import usePlantillaService from '../services/plantilla/UsePlantillaService';

import { DTOProcesoFindAll, IProcesoFindAllResponse } from 'src/formulacion/interfaces/plantilla/ProcesoFindAll.interfaces'
import { DTOProcesoDetalleFindAll, IProcesoDetalleFindAllResponse } from 'src/formulacion/interfaces/plantilla/ProcesoDetalleFindAll.interfaces'
import { DTOGetAllByCodigoDetalleProceso, IGetAllByCodigoDetalleProcesoResponse } from 'src/formulacion/interfaces/plantilla/GetAllByCodigoDetalleProceso.interfaces'

import CrudModal from '../views/CrudModal';
import useCrudModal from '../shared/hooks/useCrudModal';
import FormularioPlantilla from '../views/Plantillas/Formulario';

import FormulaProvider from '../context/FormulaProvider';
import { UpdatePlantillaDTO } from 'src/formulacion/interfaces/plantilla/Update.interfaces'
import { DeletePlantillaDTO } from 'src/formulacion/interfaces/plantilla/Delete.interfaces'

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
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<IGetAllByCodigoDetalleProcesoResponse | null>(null);

  const [procesos, setProcesos] = useState<IProcesoFindAllResponse[]>([]);
  const [loadingProcesos, setLoadingProcesos] = useState(false);
  const [detalles, setDetalles] = useState<IProcesoDetalleFindAllResponse[]>([])
  const [loadingDetalle] = useState(false)

  const [plantillas, setPlantillas] = useState<IGetAllByCodigoDetalleProcesoResponse[]>([])

  const [loadingPlantillas] = useState(false)

  const [modoEdicion, setModoEdicion] = useState(false);

  const defaultPlantilla = {
    procesoDetalleId: detalleSeleccionado,
    variableId: null,
    formulaId: null,
    ordenCalculo: 0,
    redondeo: 0,
    value: 0,
    usuarioInsert: 1,
    codigoEmpresa: 13,
  };

  //servicios
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

  const {
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso,
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  } = usePlantillaBuilder(services)

  const { variables: availableVariables } = useFormulaBuilder(services)

  const {
    modalOpen,
    handleOpenModal,
    handleCloseModal,
  } = useCrudModal();

  useEffect(() => {
    const fetchProcesos = async () => {
      setLoadingProcesos(true);

      const payload: DTOProcesoFindAll = {
        page: 1,
        limit: 50,
        searchText: ""
      }

      const response = await getListProcesos(payload);

      console.log('lista de procesos', response.data)

      if (response && response.isValid && Array.isArray(response.data)) {
        const procesosFindAll: IProcesoFindAllResponse[] = response.data
        setProcesos(procesosFindAll);
      } else {
        setProcesos([]);
      }

      setLoadingProcesos(false);
    };
    fetchProcesos();
  }, [getListProcesos]);

  //DETALLE DEL PROCESO
  useEffect(() => {
    if (detalleSeleccionado != null) {
      const fetchPlantillas = async () => {
        const payload: DTOGetAllByCodigoDetalleProceso = {
          page: 1,
          limit: 20,
          searchText: "",
          id: detalleSeleccionado
        }

        const response = await getPlantillasByDetalleProceso(payload);
        console.log('Detalle por proceso', response)

        if (response && response.isValid && Array.isArray(response.data)) {
          setPlantillas(response.data);
        } else {
          setPlantillas([]);
        }
      };
      fetchPlantillas();
    }
  }, [detalleSeleccionado, getPlantillasByDetalleProceso]);

  //SELECCIONAR PROCESO
  const handleProcesoChange = async (e: SelectChangeEvent) => {
    const value = e.target.value
    setProcesoId(value === '' ? '' : Number(value))

    setDetalles([]);
    setDetalleSeleccionado(null);

    const payload: DTOProcesoDetalleFindAll = {
      "limit": 10,
      "page": 1,
      "searchText": "",
      "codigoProceso": Number(value)
    }

    const response = await getListDetalleProcesos(payload);

    if (response && response.isValid && Array.isArray(response.data)) {
      setDetalles(response.data);
    } else {
      setDetalles([]);
    }
  }

  const handleNuevaPlantilla = () => {
    setPlantillaSeleccionada(null);
    setModoEdicion(false);
    handleOpenModal();
  };

  const handleOpenModalPlantilla = (plantilla: IGetAllByCodigoDetalleProcesoResponse) => {
    setPlantillaSeleccionada(plantilla);
    setModoEdicion(true);
    handleOpenModal();
  };

  const handleDelete = async (form: any, action: any) => {
    try {
      const dtoDelete: DeletePlantillaDTO = (({ id }) => ({
          id: Number(id)
        }))(form);

      const deleteResponse = await deletePlantilla(dtoDelete);
      console.log('Deleted plantilla:', deleteResponse);
    } catch (error) {
      console.error('Error deleting plantilla:', error);
    }
  }

  const handleSubmit = async (form: any, action: any) => {
    try {
      if (action === 'edit' && form) {
        const dtoUpdate: UpdatePlantillaDTO = (({ id, procesoDetalleId, variableId, formulaId, ordenCalculo, value, usuarioUpdate, codigoEmpresa }) => ({
          id: Number(id),
          procesoDetalleId: Number(procesoDetalleId),
          variableId: Number(variableId),
          formulaId: Number(formulaId),
          ordenCalculo: Number(ordenCalculo),
          value: Number(value),
          redondeo: 0,
          usuarioUpdate: Number(usuarioUpdate),
          codigoEmpresa: Number(codigoEmpresa)
        }))(form);

        const updateResponse = await updatePlantilla(dtoUpdate);
        console.log('Editing plantilla:', updateResponse);
      } else if (action === 'create') {
        const createResponse = await createPlantilla(form);
        console.log('Created plantilla:', createResponse)
      }
    } catch (error) {
      console.error('Error submitting plantilla:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
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
                {Array.isArray(procesos) && procesos.length > 0 ? (
                  procesos.map((p: IProcesoFindAllResponse) => (
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

          {procesoId !== '' && <Grid container sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Grid item xs={12} md={6}>
              <ListaVariablePorProceso procesoId={procesoId} />
            </Grid>
          </Grid>}

          <Grid container sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Grid item xs={12} md={6}
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

            <Grid item xs={12} md={6}
              sx={{
                height: '100%',
                overflowY: 'auto',
                p: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Plantillas del Detalle
                </Typography>
                <Box sx={{ flex: 1 }} />
                <AddIcon
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    fontSize: 28,
                    mr: 1
                  }}
                  titleAccess="Nueva Plantilla"
                  onClick={handleNuevaPlantilla}
                />
              </Box>

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
                onSelectPlantilla={handleOpenModalPlantilla}
              />
            </Grid>
          </Grid>
        </Paper>

        <CrudModal
          maxWidth={plantillaSeleccionada ? "sm" : "sm"}
          open={modalOpen}
          title={modoEdicion ? "Editar Plantilla" : "Nueva Plantilla"}
          initialValues={{ ...defaultPlantilla, ...plantillaSeleccionada }}
          fields={null}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isEdit={modoEdicion}
          formValues={plantillaSeleccionada || {}}
        >
          <FormulaProvider>
            <FormularioPlantilla
              initialValues={{ ...defaultPlantilla, ...plantillaSeleccionada }}
              onChange={setPlantillaSeleccionada}
              availableVariables={availableVariables}
            />
          </FormulaProvider>
        </CrudModal>
      </Container>
    </Box>
  )
}
