import { Grid } from '@mui/material'
import SisUsuarioList from 'src/sis/usuarios/views/SisUsuarioList'

const SisUsuariosPage = () => {
  return (
    <Grid container spacing={6}>
      <SisUsuarioList />
    </Grid>
  )
}

export default SisUsuariosPage
