import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Container,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  PlayArrow,
  FilterList,
  Group,
} from '@mui/icons-material';

const App = () => {
  const [selected, setSelected] = useState([1, 2]);

  return (
    <Box>
      {/* Barra Superior */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mr: 2 }}>
              Movimientos Masivos
            </Typography>
            <Chip
              icon={<Group sx={{ fontSize: '1rem !important' }} />}
              label={`${selected.length} Seleccionados`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, borderRadius: '8px' }}
            />
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<PlayArrow />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Procesar Selección
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>

      </Container>
    </Box>
  )
}

export default App