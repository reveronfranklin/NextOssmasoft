import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../services';

interface UrbanizacionListProps {
  codigoPais?: number | null;
  codigoEstado?: number | null;
  codigoMunicipio?: number | null;
  codigoCiudad?: number | null;
  codigoParroquia?: number | null;
  codigoSector?: number | null;
  onUrbanizacionSelect: (urbanizacion: any | null) => void;
  selectedUrbanizacionId?: number | null;
}

const UrbanizacionList: React.FC<UrbanizacionListProps> = ({
  codigoPais,
  codigoEstado,
  codigoMunicipio,
  codigoCiudad,
  codigoParroquia,
  codigoSector,
  onUrbanizacionSelect,
  selectedUrbanizacionId
}) => {
  const { getUrbanizaciones } = useServices();
  const qc = useQueryClient();

  const enabled = !!codigoPais && !!codigoEstado && !!codigoMunicipio && !!codigoCiudad && !!codigoParroquia && !!codigoSector;


  const { data: urbanizaciones = [] } = useQuery({
    queryKey: ['urbanizaciones', codigoPais, codigoEstado, codigoMunicipio, codigoCiudad, codigoParroquia, codigoSector],
    queryFn: () =>
      getUrbanizaciones({
        CodigoPais: codigoPais!,
        CodigoEstado: codigoEstado!,
        CodigoMunicipio: codigoMunicipio!,
        CodigoCiudad: codigoCiudad!,
        CodigoParroquia: codigoParroquia!,
        CodigoSector: codigoSector!
      }),
    initialData: () =>
      qc.getQueryData(['urbanizaciones', codigoPais, codigoEstado, codigoMunicipio, codigoCiudad, codigoParroquia]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled
  });

  const selectedUrbanizacion = urbanizaciones.find((u: any) => u.id === selectedUrbanizacionId) || null;

  if (!enabled) return null;

  return (
    <Autocomplete
      fullWidth
      options={urbanizaciones}
      id="autocomplete-urbanizacion"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedUrbanizacion}
      onChange={(_, value) => onUrbanizacionSelect(value)}
      renderInput={params => <TextField {...params} label="Urbanización" />}
      clearOnEscape
      disabled={!enabled}
    />
  );
};

export default UrbanizacionList;