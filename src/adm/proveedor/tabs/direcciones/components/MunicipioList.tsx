import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../services';
import { IGenericoDescripcion } from '../interfaces';

interface MunicipioListProps {
  codigoPais?: number | null;
  codigoEstado?: number | null;
  onMunicipioSelect: (municipio: IGenericoDescripcion | null) => void;
  selectedMunicipioId?: number | null;
}

const MunicipioList: React.FC<MunicipioListProps> = ({
  codigoPais,
  codigoEstado,
  onMunicipioSelect,
  selectedMunicipioId
}) => {
  const { getMunicipios } = useServices();
  const qc = useQueryClient();

  const enabled = !!codigoPais && !!codigoEstado;

  const { data: municipios = [] } = useQuery({
    queryKey: ['municipios', codigoPais, codigoEstado],
    queryFn: () => getMunicipios({ CodigoPais: codigoPais!, CodigoEstado: codigoEstado! }),
    initialData: () => qc.getQueryData(['municipios', codigoPais, codigoEstado]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  }, qc);

  const selectedMunicipio = municipios.find(m => m.id === selectedMunicipioId) || null;

  if (!enabled) return null;

  return (
    <Autocomplete
      fullWidth
      options={municipios}
      id='autocomplete-municipio'
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedMunicipio}
      onChange={(_, value) => onMunicipioSelect(value)}
      renderInput={params => <TextField {...params} label='Municipio' />}
      clearOnEscape
    />
  );
};

export default MunicipioList;