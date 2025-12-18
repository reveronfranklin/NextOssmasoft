import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDireccionesService } from '../services/direccionesService';

interface SectorListProps {
  codigoPais?: number | null;
  codigoEstado?: number | null;
  codigoMunicipio?: number | null;
  codigoCiudad?: number | null;
  codigoParroquia?: number | null;
  onSectorSelect: (sector: any | null) => void;
  selectedSectorId?: number | null;
}

const SectorList: React.FC<SectorListProps> = ({
  codigoPais,
  codigoEstado,
  codigoMunicipio,
  codigoCiudad,
  codigoParroquia,
  onSectorSelect,
  selectedSectorId
}) => {
  const { getSectores } = useDireccionesService();
  const qc = useQueryClient();

  const enabled = !!codigoPais && !!codigoEstado && !!codigoMunicipio && !!codigoCiudad && !!codigoParroquia;

  const { data: sectores = [] } = useQuery({
    queryKey: ['sectores', codigoPais, codigoEstado, codigoMunicipio, codigoCiudad, codigoParroquia],
    queryFn: () =>
      getSectores({
        CodigoPais: codigoPais!,
        CodigoEstado: codigoEstado!,
        CodigoMunicipio: codigoMunicipio!,
        CodigoCiudad: codigoCiudad!,
        CodigoParroquia: codigoParroquia!
      }),
    initialData: () =>
      qc.getQueryData(['sectores', codigoPais, codigoEstado, codigoMunicipio, codigoCiudad, codigoParroquia]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled
  });

  const selectedSector = sectores.find((s: any) => s.id === selectedSectorId) || null;

  if (!enabled) return null;

  return (
    <Autocomplete
      fullWidth
      options={sectores}
      id="autocomplete-sector"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.descripcion || 'Sin nombre'}
      value={selectedSector}
      onChange={(_, value) => onSectorSelect(value)}
      renderInput={params => <TextField {...params} label="Sector" />}
      clearOnEscape
      disabled={!enabled}
    />
  );
};

export default SectorList;