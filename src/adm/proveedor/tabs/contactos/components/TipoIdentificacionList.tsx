import React, { useEffect, useState, useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';

export interface DescriptivaItem {
  id: number;
  descripcion: string;
}

interface TipoIdentificacionListProps {
  selectedTipoIdentificacionId?: number | null;
  onSelect?: (item: DescriptivaItem | null) => void;
}

const TipoIdentificacionList: React.FC<TipoIdentificacionListProps> = ({
  selectedTipoIdentificacionId,
  onSelect
}) => {
  const [items, setItems] = useState<DescriptivaItem[]>([]);
  const [selected, setSelected] = useState<DescriptivaItem | null>(null);

  const getTiposIdentificacion = useCallback(async (): Promise<DescriptivaItem[]> => {
    const response = await ossmmasofApi.post(
      UrlServices.GET_TIPO_IDENTIFICACION,
      { tituloId: 9 }
    );

    return response.data || [];
  }, []);

  useEffect(() => {
    getTiposIdentificacion().then(setItems);
  }, [getTiposIdentificacion]);

  useEffect(() => {
    if (selectedTipoIdentificacionId && items.length > 0) {
      const found = items.find(i => i.id === selectedTipoIdentificacionId) || null;
      setSelected(found);
    }
  }, [selectedTipoIdentificacionId, items]);

  return (
    <Autocomplete
      options={items}
      value={selected}
      getOptionLabel={(option) => option.descripcion}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, value) => {
        setSelected(value);
        onSelect?.(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tipo de Identificación"
          fullWidth
          margin="dense"
        />
      )}
    />
  );
};

export default TipoIdentificacionList;
