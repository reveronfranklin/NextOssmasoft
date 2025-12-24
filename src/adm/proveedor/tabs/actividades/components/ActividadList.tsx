import React, { useEffect, useState, useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';

export interface ActividadItem {
  id: number;
  descripcion: string;
}

interface ActividadListProps {
  selectedActividadId?: number | null;
  onActividadSelect?: (actividad: ActividadItem | null) => void;
}

const ActividadList: React.FC<ActividadListProps> = ({
  selectedActividadId,
  onActividadSelect
}) => {
  const [actividades, setActividades] = useState<ActividadItem[]>([]);
  const [selected, setSelected] = useState<ActividadItem | null>(null);

  const getActividadesCatalogo = useCallback(async (): Promise<ActividadItem[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_ACTIVIDADES_CATALOGO);

    return response.data || [];
  }, []);

  useEffect(() => {
    getActividadesCatalogo().then(setActividades);
  }, [getActividadesCatalogo]);

  useEffect(() => {
    if (selectedActividadId && actividades.length > 0) {
      const found = actividades.find(a => a.id === selectedActividadId) || null;
      setSelected(found);
    }
  }, [selectedActividadId, actividades]);

  return (
    <Autocomplete
      options={actividades}
      value={selected}
      getOptionLabel={(option) => option.descripcion}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, value) => {
        setSelected(value);
        onActividadSelect?.(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Actividad"
          fullWidth
          margin="dense"
        />
      )}
    />
  );
};

export default ActividadList;
