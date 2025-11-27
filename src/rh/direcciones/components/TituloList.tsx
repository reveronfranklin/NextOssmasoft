import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDireccionesService } from '../services/direccionesService';

interface TituloListProps {
  onTituloSelect: (titulo: any | null) => void;
  selectedTituloId?: number | null;
}

const TituloList: React.FC<TituloListProps> = ({ onTituloSelect, selectedTituloId }) => {
  const { getTituloDescriptiva } = useDireccionesService();
  const qc = useQueryClient();

  const { data: titulos = [] } = useQuery({
    queryKey: ['titulos'],
    queryFn: () => getTituloDescriptiva(3),
    initialData: () => qc.getQueryData(['titulos']),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  }, qc);

  interface Titulo {
    id: number;
    descripcion?: string;
    [key: string]: any;
  }

  const selectedTitulo: Titulo | null = titulos.find((t: Titulo) => t.id === selectedTituloId) || null;

  return (
    <Autocomplete
      fullWidth
      options={titulos}
      id='autocomplete-titulo'
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedTitulo}
      onChange={(_, value) => onTituloSelect(value)}
      renderInput={params => <TextField {...params} label='Título' />}
      clearOnEscape
    />
  );
};

export default TituloList;