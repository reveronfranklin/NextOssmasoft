import React, { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDireccionesService } from '../../services/direccionesService';

interface Titulo {
  id: number;
  descripcion?: string;
  [key: string]: any;
}

interface TituloAutocompleteProps {
  tituloId: number;
  onTituloSelect: (titulo: Titulo | null) => void;
  selectedTituloId?: number | null;
  label?: string;
}

const TituloAutocomplete: React.FC<TituloAutocompleteProps> = ({
  tituloId,
  onTituloSelect,
  selectedTituloId,
  label = 'Tipo de Dirección'
}) => {
  const { getTituloDescriptiva } = useDireccionesService();
  const qc = useQueryClient();

  const { data: titulos = [] } = useQuery({
    queryKey: ['titulos', tituloId],
    queryFn: () => getTituloDescriptiva(tituloId),
    initialData: () => qc.getQueryData(['titulos', tituloId]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const selectedTitulo: Titulo | null = useMemo(
    () => titulos.find((t: Titulo) => t.id === selectedTituloId) || null,
    [titulos, selectedTituloId]
  );

  return (
    <Autocomplete
      fullWidth
      options={titulos}
      id={`autocomplete-titulo-${tituloId}`}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedTitulo}
      onChange={(_, value) => onTituloSelect(value)}
      renderInput={params => <TextField {...params} label={label} />}
      clearOnEscape
    />
  );
};

export default TituloAutocomplete;