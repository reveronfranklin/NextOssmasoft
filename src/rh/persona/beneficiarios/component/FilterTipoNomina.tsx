// ** React Imports
import { useEffect } from 'react'

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Types

import { Autocomplete, Box, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setTiposNomina, setTiposNominaSeleccionado } from 'src/store/apps/rh'

import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

const FilterTipoNomina = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  const dispatch = useDispatch()
  console.log(popperPlacement)
  const { tiposNomina } = useSelector((state: RootState) => state.nomina)

  // ** States

  const handleTiposNomina = (e: any, value: any) => {
    if (value != null) {
      dispatch(setTiposNominaSeleccionado(value))
    } else {
      const tipoNomina: IListTipoNominaDto[] = [
        {
          codigoTipoNomina: 0,
          descripcion: ''
        }
      ]
      dispatch(setTiposNominaSeleccionado(tipoNomina))
    }
  }

  const dataTipoNomina = async () => {
    const responseAllTipoNomina = await ossmmasofApi.get<any>('/RhTipoNomina/GetAll')

    const { data } = responseAllTipoNomina

    if (data) {
      dispatch(setTiposNomina(data))
    }
  }

  useEffect(() => {
    const getData = async () => {
      await dataTipoNomina()
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Filtrar Tipo Nomina' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  {tiposNomina ? (
                    <Autocomplete
                      multiple={true}
                      sx={{ width: 350 }}
                      options={tiposNomina}
                      id='autocomplete-tipo-nomina'
                      isOptionEqualToValue={(option, value) => option.codigoTipoNomina === value.codigoTipoNomina}
                      getOptionLabel={option => option.codigoTipoNomina + '-' + option.descripcion}
                      onChange={handleTiposNomina}
                      renderInput={params => <TextField {...params} label='Tipo Nomina' />}
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

export default FilterTipoNomina
