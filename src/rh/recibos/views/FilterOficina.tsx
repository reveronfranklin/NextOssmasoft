// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Component Imports

// ** Types

import { Autocomplete, Card, CardContent, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { setListRhListOficina, setRhListOficinaSeleccionado } from 'src/store/apps/rh-list-oficina'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

const FilterOficina = () => {
  const dispatch = useDispatch()

  const { listRhListOficina } = useSelector((state: RootState) => state.rhListOficina)
  const { rhTipoNominaSeleccionado } = useSelector((state: RootState) => state.rhTipoNomina)
  const { rhPeriodoSeleccionado } = useSelector((state: RootState) => state.rhPeriodo)
  const handleOficina = (e: any, value: any) => {
    if (value != null) {
      dispatch(setRhListOficinaSeleccionado(value))
    } else {
      dispatch(setRhListOficinaSeleccionado({}))
    }
  }

  useEffect(() => {
    const getData = async () => {
      const filter = {
        codigoTipoNomina: rhTipoNominaSeleccionado.codigoTipoNomina,
        CodigoPeriodo: rhPeriodoSeleccionado.codigoPeriodo
      }
      const responseAllListIcp = await ossmmasofApi.post<any>('/RhReporteNominaHistorico/ListIcp', filter)
      if (responseAllListIcp.data != null) {
        dispatch(setListRhListOficina(responseAllListIcp.data))
      } else {
        dispatch(setListRhListOficina([]))
      }
      console.log(responseAllListIcp.data)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, rhPeriodoSeleccionado])

  return (
    <Grid item xs={12}>
      <Card>
        {/* <CardHeader title='Filtrar por Tipo Nómina' /> */}
        <CardContent>
          <Grid container spacing={12}>
            <Grid item sm={2} xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  {listRhListOficina ? (
                    <Autocomplete
                      sx={{ width: 380, ml: 2, mr: 2 }}
                      options={listRhListOficina}
                      id='autocomplete-tipo-nomina'
                      isOptionEqualToValue={(option, value) => option.codigoIcp === value.codigoIcp}
                      getOptionLabel={option => option.codigoIcpConcat + '-' + option.denominacion}
                      onChange={handleOficina}
                      renderInput={params => <TextField {...params} label='Oficina' />}
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default FilterOficina
