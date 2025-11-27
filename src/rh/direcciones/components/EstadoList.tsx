import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDireccionesService } from '../services/direccionesService';
import { IGenericoDescripcion } from '../interfaces/direcciones.interfaces';

interface EstadoListProps {
  paisId?: number | null;
  onEstadoSelect: (estado: IGenericoDescripcion | null) => void;
  selectedEstadoId?: number | null;
}

const EstadoList: React.FC<EstadoListProps> = ({ paisId, onEstadoSelect, selectedEstadoId }) => {
  const { getEstados } = useDireccionesService();
  const qc = useQueryClient();

  const enabled = !!paisId;

  const { data: estados = [] } = useQuery({
    queryKey: ['estados', paisId],
    queryFn: () => getEstados(String(paisId!)),
    initialData: () => qc.getQueryData(['estados', paisId]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  }, qc);

  const selectedEstado = estados.find(e => e.id === selectedEstadoId) || null;

  if (!enabled) return null;

  return (
    <Autocomplete
      fullWidth
      options={estados}
      id='autocomplete-estado'
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedEstado}
      onChange={(_, value) => onEstadoSelect(value)}
      renderInput={params => <TextField {...params} label='Estado' />}
      clearOnEscape
    />
  );
};

export default EstadoList;