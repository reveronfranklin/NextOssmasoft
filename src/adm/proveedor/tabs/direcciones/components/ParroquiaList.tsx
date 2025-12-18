import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../services';
import { IGenericoDescripcion } from '../interfaces';

interface ParroquiaListProps {
  codigoPais?: number | null;
  codigoEstado?: number | null;
  codigoMunicipio?: number | null;
  codigoCiudad?: number | null;
  onParroquiaSelect: (parroquia: IGenericoDescripcion | null) => void;
  selectedParroquiaId?: number | null;
}

const ParroquiaList: React.FC<ParroquiaListProps> = ({
  codigoPais,
  codigoEstado,
  codigoMunicipio,
  codigoCiudad,
  onParroquiaSelect,
  selectedParroquiaId
}) => {
  const { getParroquias } = useServices();
  const qc = useQueryClient();

  const enabled = !!codigoPais && !!codigoEstado && !!codigoMunicipio && !!codigoCiudad;

  const { data: parroquias = [] } = useQuery({
    queryKey: ['parroquias', codigoPais, codigoEstado, codigoMunicipio, codigoCiudad],
    queryFn: () => getParroquias({
      CodigoPais: codigoPais!,
      CodigoEstado: codigoEstado!,
      CodigoMunicipio: codigoMunicipio!,
      CodigoCiudad: codigoCiudad!
    }),
    initialData: () => qc.getQueryData(['parroquias', codigoPais, codigoEstado, codigoMunicipio, codigoCiudad]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  }, qc);

  const selectedParroquia = parroquias.find(p => p.id === selectedParroquiaId) || null;

  if (!enabled) return null;

  return (
    <Autocomplete
      fullWidth
      options={parroquias}
      id='autocomplete-parroquia'
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedParroquia}
      onChange={(_, value) => onParroquiaSelect(value)}
      renderInput={params => <TextField {...params} label='Parroquia' />}
      clearOnEscape
    />
  );
};

export default ParroquiaList;