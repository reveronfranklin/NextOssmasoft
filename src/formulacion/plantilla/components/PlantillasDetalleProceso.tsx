import React from 'react';
import { List, ListItemButton, ListItemText, Paper, Box, Typography, Stack } from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface PlantillasDetalleProcesoProps {
  plantillas: any[];
  detalleId: number | null;
  loading: boolean;
  onSelectPlantilla: (plantilla: any) => void;
  onReorder?: (plantillas: any[]) => void;
}

const PlantillasDetalleProceso = ({
  plantillas,
  detalleId,
  loading,
  onSelectPlantilla,
  onReorder
}: PlantillasDetalleProcesoProps) => {
  const [items, setItems] = React.useState<any[]>(plantillas);

  React.useEffect(() => {
    setItems(plantillas);
  }, [plantillas]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    if (onReorder) onReorder(reordered);
  };

  if (detalleId == null) return null;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      {/* Leyenda de orden */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, pt: 2, pb: 1 }}>
        <FormatListNumberedIcon color="primary" fontSize="small" />
        <Typography variant="caption" color="text.secondary">
          Orden
        </Typography>
      </Stack>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="plantillas-droppable">
          {(provided: any) => (
            <List
              dense
              disablePadding
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((pl: any, index: number) => (
                <Draggable key={pl.id} draggableId={pl.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <ListItemButton
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        py: 1,
                        px: 2,
                        mb: 1,
                        bgcolor: snapshot.isDragging ? 'primary.light' : 'background.paper',
                        borderRadius: 1,
                        boxShadow: snapshot.isDragging ? 2 : 0,
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => onSelectPlantilla(pl)}
                    >
                      {/* Columna izquierda: valor de ordenamiento */}
                      <Typography
                        variant="body2"
                        sx={{
                          minWidth: 55,
                          textAlign: 'center',
                          fontWeight: 600,
                          color: 'primary.main',
                          mr: 2
                        }}
                      >
                        {pl.ordenCalculo}
                      </Typography>
                      <ListItemText
                        primary={pl.code}
                        secondary={pl.descripcionFormula}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItemButton>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {!loading && items.length === 0 && (
                <Box sx={{ p: 2, fontSize: 13, color: 'text.secondary' }}>
                  No hay plantillas para el detalle seleccionado.
                </Box>
              )}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

export default PlantillasDetalleProceso;