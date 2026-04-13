export const operatorButtonStyle = (theme: any) => ({
  textTransform: 'none',
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'light'
    ? '2px 2px 5px rgba(0,0,0,0.08)'
    : '2px 2px 8px rgba(0,0,0,0.4)',

  '&:active': {
    cursor: 'grabbing',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.15)',
    backgroundColor: theme.palette.action.selected
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? 'rgba(102, 108, 255, 0.04)'
      : 'rgba(102, 108, 255, 0.15)',
    borderColor: theme.palette.primary.main,
    '& .drag-icon': {
      opacity: 1,
      color: theme.palette.primary.main
    }
  },
  transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'transform'], {
    duration: theme.transitions.duration.short
  })
})

export const boxQueryStyle = (theme: any, isDraggingOver: boolean) => ({
  transition: 'all 0.2s ease-in-out',
  '& .MuiOutlinedInput-root': {
    ...(isDraggingOver && {
      backgroundColor: theme.palette.mode === 'light'
        ? 'rgba(102, 108, 255, 0.08)'
        : 'rgba(102, 108, 255, 0.15)',
      outline: `2px dashed ${theme.palette.primary.main}`,
      outlineOffset: '-10px',
      borderRadius: '12px'
    }),
    transition: 'all 0.2s ease-in-out'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: isDraggingOver ? 0 : 1
  },
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.6 },
    '100%': { opacity: 1 }
  },
  ...(isDraggingOver && {
    animation: 'pulse 1.5s infinite ease-in-out'
  }),
  '& .MuiInputBase-input': {
    userSelect: isDraggingOver ? 'none' : 'text',
    pointerEvents: isDraggingOver ? 'none' : 'auto'
  },
  '& *': { pointerEvents: isDraggingOver ? 'none' : 'auto' }
})