import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, List, ListItem, ListItemText } from '@mui/material';

const PlantillasDetalleProceso = ({
  plantillas,
  detalleId,
  loading,
  onSelectPlantilla,
  onReorder // Nueva prop para notificar el nuevo orden
}) => {
  const [items, setItems] = React.useState(plantillas);

  React.useEffect(() => {
    setItems(plantillas);
  }, [plantillas]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    if (onReorder) onReorder(reordered);
  };

  return (
    <Paper variant="outlined" sx={{ minHeight: 200 }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="plantillas-droppable">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ width: '100%' }}
            >
              {items.map((plantilla, index) => (
                <Draggable key={plantilla.id} draggableId={plantilla.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        mb: 1,
                        bgcolor: snapshot.isDragging ? 'primary.light' : 'background.paper',
                        borderRadius: 1,
                        boxShadow: snapshot.isDragging ? 2 : 0,
                        cursor: 'grab'
                      }}
                      onClick={() => onSelectPlantilla(plantilla)}
                    >
                      <ListItemText
                        primary={plantilla.descripcion}
                        secondary={`Orden: ${plantilla.ordenCalculo}`}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

export default PlantillasDetalleProceso;