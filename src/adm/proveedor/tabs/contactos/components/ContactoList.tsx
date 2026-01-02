import React, { useEffect, useState, useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';

export interface DescriptivaItem {
  id: number;
  descripcion: string;
}

interface TipoContactoListProps {
  selectedTipoContactoId?: number | null;
  onSelect?: (item: DescriptivaItem | null) => void;
}

const TipoContactoList: React.FC<TipoContactoListProps> = ({
  selectedTipoContactoId,
  onSelect
}) => {
  const [items, setItems] = useState<DescriptivaItem[]>([]);
  const [selected, setSelected] = useState<DescriptivaItem | null>(null);

  const getTiposContacto = useCallback(async (): Promise<DescriptivaItem[]> => {
    const response = await ossmmasofApi.post(
      UrlServices.GET_TIPO_CONTACTO,
      { tituloId: 10 }
    );

    return response.data || [];
  }, []);

  useEffect(() => {
    getTiposContacto().then(setItems);
  }, [getTiposContacto]);

  useEffect(() => {
    if (selectedTipoContactoId && items.length > 0) {
      const found = items.find(i => i.id === selectedTipoContactoId) || null;
      setSelected(found);
    }
  }, [selectedTipoContactoId, items]);

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
          label="Tipo de Contacto"
          fullWidth
          margin="dense"
        />
      )}
    />
  );
};

export default TipoContactoList;
