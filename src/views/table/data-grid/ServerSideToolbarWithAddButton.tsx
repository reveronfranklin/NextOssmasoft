import { Tooltip, IconButton } from '@mui/material';
import Icon from 'src/@core/components/icon';
import ServerSideToolbar from './ServerSideToolbar';
import type { ChangeEvent } from 'react';

// Definir la interfaz de props para este componente
interface ServerSideToolbarWithAddButtonProps {
  value: string;
  clearSearch: () => void;
  onChange: (e: ChangeEvent) => void;
  onAdd: () => void;
  onDownloadFile: () => void;
  downloadFile?: boolean;
  sx: any;
}

const ServerSideToolbarWithAddButton = (props: ServerSideToolbarWithAddButtonProps) => {
  // Extraer todas las props
  const { onAdd, onDownloadFile, value, clearSearch, onChange, sx, downloadFile = false, ...otherProps } = props

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
      {/* Botón de agregar */}
      <Tooltip title='Agregar Lotes'>
        <IconButton color='primary' size='small' onClick={onAdd} sx={sx}>
          <Icon icon='ci:add-row' fontSize={20} />
        </IconButton>
      </Tooltip>

      {/* Boton download */}
      { downloadFile && (
        <Tooltip title='Descargar .txt'>
          <IconButton color='primary' size='small' onClick={onDownloadFile} sx={sx}>
          <Icon icon='ci:download' fontSize={20}/>
          </IconButton>
        </Tooltip>
      )}

      {/* Pasar las props requeridas al ServerSideToolbar */}
      <ServerSideToolbar
        value={value}
        clearSearch={clearSearch}
        onChange={onChange}
        {...otherProps}
      />
    </div>
  )
}

export default ServerSideToolbarWithAddButton