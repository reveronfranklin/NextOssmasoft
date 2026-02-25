import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDireccionesService } from '../services/direccionesService';
import { IGenericoDescripcion } from '../interfaces/direcciones.interfaces';

interface CiudadListProps {
  codigoPais?: number | null;
  codigoEstado?: number | null;
  codigoMunicipio?: number | null;
  onCiudadSelect: (ciudad: IGenericoDescripcion | null) => void;
  selectedCiudadId?: number | null;
}

const CiudadList: React.FC<CiudadListProps> = ({
  codigoPais,
  codigoEstado,
  codigoMunicipio,
  onCiudadSelect,
  selectedCiudadId
}) => {
  const { getCiudades } = useDireccionesService();
  const qc = useQueryClient();

  const enabled = !!codigoPais && !!codigoEstado && !!codigoMunicipio;

  const { data: ciudades = [] } = useQuery({
    queryKey: ['ciudades', codigoPais, codigoEstado, codigoMunicipio],
    queryFn: () => getCiudades({
      CodigoPais: codigoPais!,
      CodigoEstado: codigoEstado!,
      CodigoMunicipio: codigoMunicipio!
    }),
    initialData: () => qc.getQueryData(['ciudades', codigoPais, codigoEstado, codigoMunicipio]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  }, qc);

  const selectedCiudad = ciudades.find(c => c.id === selectedCiudadId) || null;

  if (!enabled) return null;

  return (
    <Autocomplete
      fullWidth
      options={ciudades}
      id='autocomplete-ciudad'
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedCiudad}
      onChange={(_, value) => onCiudadSelect(value)}
      renderInput={params => <TextField {...params} label='Ciudad' />}
      clearOnEscape
    />
  );
};

export default CiudadList;