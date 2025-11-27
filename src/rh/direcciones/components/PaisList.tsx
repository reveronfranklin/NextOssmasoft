import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDireccionesService } from '../services/direccionesService';
import { IGenericoDescripcion } from '../interfaces/direcciones.interfaces';

interface PaisListProps {
  onPaisSelect: (pais: IGenericoDescripcion | null) => void;
  selectedPaisId?: number | null;
}

const PaisList: React.FC<PaisListProps> = ({ onPaisSelect, selectedPaisId }) => {
  const { getPaises } = useDireccionesService();
  const qc = useQueryClient();

  const { data: paises = [] } = useQuery({
    queryKey: ['paises'],
    queryFn: getPaises,
    initialData: () => qc.getQueryData(['paises']),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  }, qc);

  const selectedPais = paises.find(p => p.id === selectedPaisId) || null;

  return (
    <Autocomplete
      fullWidth
      options={paises}
      id='autocomplete-pais'
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedPais}
      onChange={(_, value) => onPaisSelect(value)}
      renderInput={params => <TextField {...params} label='País' />}
      clearOnEscape
    />
  );
};

export default PaisList;