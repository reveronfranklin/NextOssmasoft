import { Tooltip, IconButton, Grid, TextField } from '@mui/material';
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
  onButtonRight: () => void;
  onButtonRightTwo: () => void;
  addButton?: boolean;
  downloadFile?: boolean;
  sx: any;
  sxRight?: any;
  titleButton: string;
  buttonRight?: boolean;
  titleButtonRight?: string;
  serverSideToolbarActive?: boolean;
  buttonRightTwo?: boolean;
  titleButtonRightTwo?: string;
  sxRightTwo?: any;
  disabledButtonRight?: boolean;
  disabledButtonRightTwo?: boolean;
  searchCustom?: boolean,
  searchCustomText?: string
}

const ServerSideToolbarWithAddButton = (props: ServerSideToolbarWithAddButtonProps) => {
  // Extraer todas las props
  const {
    onAdd,
    onDownloadFile,
    clearSearch,
    onChange,
    onButtonRight,
    onButtonRightTwo,
    value,
    sx,
    downloadFile = false,
    titleButton = 'Agregar Lotes',
    titleButtonRight = 'Botón Derecho',
    titleButtonRightTwo = 'Botón Dos',
    addButton = true,
    buttonRight = false,
    sxRight,
    sxRightTwo,
    buttonRightTwo = false,
    disabledButtonRight = false,
    disabledButtonRightTwo = false,
    serverSideToolbarActive = true,
    searchCustom = false,
    searchCustomText = '',
    ...otherProps
  } = props

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        {/* Botón de agregar */}
        { addButton && (
          <Tooltip title={titleButton}>
            <IconButton color='primary' size='small' onClick={onAdd} sx={sx}>
              <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>
        )}

        {/* Boton download */}
        { downloadFile && (
          <Tooltip title='Descargar .txt'>
            <IconButton color='primary' size='small' onClick={onDownloadFile} sx={sx}>
            <Icon icon='ci:download' fontSize={20}/>
            </IconButton>
          </Tooltip>
        )}

        {/* Pasar las props requeridas al ServerSideToolbar */}
        { serverSideToolbarActive && (
          <ServerSideToolbar
            value={value}
            clearSearch={clearSearch}
            onChange={onChange}
            {...otherProps}
          />
        ) }

        {/* Botón a la derecha */}
        { buttonRight && (
          <Tooltip title={titleButtonRight}>
            <span style={{ display: 'inline-flex' }}>
              <IconButton color='primary' size='small' onClick={onButtonRight} sx={sxRight} disabled={disabledButtonRight}>
                <Icon icon='mdi:filter-outline' fontSize={20} />
              </IconButton>
            </span>
          </Tooltip>
        )}

        { buttonRightTwo && (
          <Tooltip title={titleButtonRightTwo}>
            <span style={{ display: 'inline-flex' }}>
              <IconButton color='primary' size='small' onClick={onButtonRightTwo} sx={sxRightTwo} disabled={disabledButtonRightTwo}>
                <Icon icon='mdi:magnify' fontSize={20} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>

      { searchCustom && (
        <Grid container spacing={2} sx={{ mb: 5 , px: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label='Criterio de búsqueda'
              placeholder='Ingrese el criterio de búsqueda'
              multiline
              rows={4}
              disabled
              value={searchCustomText ?? ''}
            />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default ServerSideToolbarWithAddButton