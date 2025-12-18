import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';

import { IGenericoDescripcion } from './interfaces';

import PaisList from './components/PaisList';
import EstadoList from './components/EstadoList';
import MunicipioList from './components/MunicipioList';
import CiudadList from './components/CiudadList';
import ParroquiaList from './components/ParroquiaList';

const DireccionesView: React.FC = () => {
  const [paisSeleccionado, setPaisSeleccionado] = useState<IGenericoDescripcion | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IGenericoDescripcion | null>(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<IGenericoDescripcion | null>(null);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<IGenericoDescripcion | null>(null);
  const [parroquiaSeleccionada, setParroquiaSeleccionada] = useState<IGenericoDescripcion | null>(null);

  const limpiarFiltros = () => {
    setPaisSeleccionado(null);
    setEstadoSeleccionado(null);
    setMunicipioSeleccionado(null);
    setCiudadSeleccionada(null);
    setParroquiaSeleccionada(null);
  };

  const handlePaisSelect = (pais: IGenericoDescripcion | null) => {
    setPaisSeleccionado(pais);
    setEstadoSeleccionado(null);
    setMunicipioSeleccionado(null);
    setCiudadSeleccionada(null);
    setParroquiaSeleccionada(null);
  };

  const handleEstadoSelect = (estado: IGenericoDescripcion | null) => {
    setEstadoSeleccionado(estado);
    setMunicipioSeleccionado(null);
    setCiudadSeleccionada(null);
    setParroquiaSeleccionada(null);
  };

  const handleMunicipioSelect = (municipio: IGenericoDescripcion | null) => {
    setMunicipioSeleccionado(municipio);
    setCiudadSeleccionada(null);
    setParroquiaSeleccionada(null);
  };

  const handleCiudadSelect = (ciudad: IGenericoDescripcion | null) => {
    setCiudadSeleccionada(ciudad);
    setParroquiaSeleccionada(null);
  };

  const handleParroquiaSelect = (parroquia: IGenericoDescripcion | null) => {
    setParroquiaSeleccionada(parroquia);
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={limpiarFiltros} sx={{ mb: 2 }}>
        Limpiar selección
      </Button>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={2.4}>
          <PaisList
            onPaisSelect={handlePaisSelect}
            selectedPaisId={paisSeleccionado?.id}
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          {paisSeleccionado && (
            <EstadoList
              paisId={paisSeleccionado.id}
              onEstadoSelect={handleEstadoSelect}
              selectedEstadoId={estadoSeleccionado?.id}
            />
          )}
        </Grid>
        <Grid item xs={12} md={2.4}>
          {paisSeleccionado && estadoSeleccionado && (
            <MunicipioList
              codigoPais={paisSeleccionado.id}
              codigoEstado={estadoSeleccionado.id}
              onMunicipioSelect={handleMunicipioSelect}
              selectedMunicipioId={municipioSeleccionado?.id}
            />
          )}
        </Grid>
        <Grid item xs={12} md={2.4}>
          {paisSeleccionado && estadoSeleccionado && municipioSeleccionado && (
            <CiudadList
              codigoPais={paisSeleccionado.id}
              codigoEstado={estadoSeleccionado.id}
              codigoMunicipio={municipioSeleccionado.id}
              onCiudadSelect={handleCiudadSelect}
              selectedCiudadId={ciudadSeleccionada?.id}
            />
          )}
        </Grid>
        <Grid item xs={12} md={2.4}>
          {paisSeleccionado && estadoSeleccionado && municipioSeleccionado && ciudadSeleccionada && (
            <ParroquiaList
              codigoPais={paisSeleccionado.id}
              codigoEstado={estadoSeleccionado.id}
              codigoMunicipio={municipioSeleccionado.id}
              codigoCiudad={ciudadSeleccionada.id}
              onParroquiaSelect={handleParroquiaSelect}
              selectedParroquiaId={parroquiaSeleccionada?.id}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default DireccionesView;