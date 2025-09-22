import React, {useState} from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm"

import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const ActionButtonGroup = ({
    onEvaluate,
    onDeleteFormula,
    onClear,
    onUndo,
    clearAllHistory,
    formulaHistory,
    isEdit,
    clearDisabled = false
  }) => {
    const [openConfirm, setOpenConfirm] = useState(false);

  const handleConfirm = () => {
    clearAllHistory();
    setOpenConfirm(false);
    onClear();
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Tooltip title={isEdit ? "Actualizar fórmula" : "Crear fórmula"}>
        <ButtonWithConfirm
          variant="contained"
          color="primary"
          onAction={onEvaluate}
          startIcon={isEdit ? <SaveIcon /> : <AddCircleIcon />}
          confirmMessage={isEdit ? "¿Desea actualizar la fórmula?" : "¿Desea crear una nueva fórmula?"}
        >
          {isEdit ? "Actualizar" : "Crear"}
        </ButtonWithConfirm>
      </Tooltip>
      {isEdit && (
        <Tooltip title="Eliminar fórmula">
          <ButtonWithConfirm
            variant="contained"
            color="primary"
            onAction={onDeleteFormula}
            startIcon={<DeleteIcon />}
            confirmMessage="¿Está seguro de eliminar esta fórmula?"
          >
            {"Eliminar"}
          </ButtonWithConfirm>
        </Tooltip>
      )}
      <Tooltip title="Limpiar">
        <span>
          <IconButton
            color="error"
            onClick={onClear}
            size="large"
            disabled={clearDisabled}
          >
            <ClearIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Deshacer último cambio">
        <span>
          <IconButton
            color={formulaHistory.length === 0 ? "secondary" : "primary"}
            onClick={onUndo}
            disabled={formulaHistory.length === 0}
            size="large"
          >
            <UndoIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Limpiar Todo">
        <span>
          <IconButton
            color={formulaHistory.length === 0 ? "secondary" : "error"}
            onClick={() => setOpenConfirm(true)}
            disabled={formulaHistory.length === 0}
            size="large"
          >
            <DeleteSweepIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 2, minWidth: 350 }
        }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          Confirmar limpieza total
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas limpiar <b>todo el historial</b>?<br />
            <span style={{ color: '#d32f2f' }}>Esta acción no se puede deshacer.</span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            Limpiar todo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActionButtonGroup;