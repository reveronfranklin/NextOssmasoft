// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { useEffect, useState } from 'react'

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 185,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))

const EcommerceCongratulations = () => {
  
  const [data, setData] = useState<any>('')

  

  useEffect(() => {
    // Recuperar el objeto de localStorage cuando el componente se monte
    const objetoJSONRecuperado = window.localStorage.getItem('userData');
    if (objetoJSONRecuperado) {
      setData(JSON.parse(objetoJSONRecuperado));
    }
  }, []);

 
  return (
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 } }}>
      <CardContent sx={{ p: theme => `${theme.spacing(8.25, 7.5, 6.25, 7.5)} !important` }}>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={10}>
            <Typography variant='h5' sx={{ mb: 6.5 }}>
              Felicitaciones{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {data.email}
              </Box>
              ! 🎉
            </Typography>
            <Typography variant='body2'>Este es tu nuevo portal informativo  gasgdagdjh hdasg asgg🤩 </Typography>
            <Typography variant='body2'>pendiente de nuevas notificaciones. hsghgshfgsdhfghdsgsdg</Typography>
            <Typography variant='body2'>pendiente de nuevas notificaciones.yewyywieyrieuw we ry</Typography>
            <Typography variant='body2'>pendiente de nuevas notificaciones. h shdkfhdskhs</Typography>
            <Typography variant='body2'>pendiente de nuevas notificacionesshfsdhfdhs  ksdh.</Typography>
            <Typography variant='body2'>pendiente de nuevas notificaciones. kj hfsd hf </Typography>
            <Typography variant='body2'>pendiente de nuevas notificaciones.  jshfkdhsd</Typography>
          </Grid>
          <StyledGrid item xs={12} sm={2}>
            <Img alt='Congratulations John' src='/images/cards/illustration-john-2.png' />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceCongratulations
