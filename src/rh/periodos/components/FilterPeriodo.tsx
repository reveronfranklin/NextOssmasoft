// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Component Imports

// ** Types

import { Autocomplete, Card, CardContent, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IRhPeriodosFilterDto } from 'src/interfaces/rh/Periodos/RhPeriodosFilterDto'
import { IRhPeriodosResponseDto } from 'src/interfaces/rh/Periodos/RhPeriodosResponseDto'
import { setRhPeriodoSeleccionado } from 'src/store/apps/rh-periodo'
import dayjs from 'dayjs'

const FilterPeriodo = () => {
  const dispatch = useDispatch()

  const { rhTipoNominaSeleccionado } = useSelector((state: RootState) => state.rhTipoNomina)
  const [allRows, setAllRows] = useState<IRhPeriodosResponseDto[]>([])
  const handlePeriodo = (e: any, value: any) => {
    if (value != null) {
      dispatch(setRhPeriodoSeleccionado(value))
    } else {
      dispatch(setRhPeriodoSeleccionado({}))
    }
  }

  useEffect(() => {
    const getData = async () => {
      const filter: IRhPeriodosFilterDto = {
        codigoTipoNomina: rhTipoNominaSeleccionado.codigoTipoNomina
      }
      const responseAll = await ossmmasofApi.post<any>('/RhPeriodosNomina/GetAll', filter)
      const data = responseAll.data
      setAllRows(data)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, rhTipoNominaSeleccionado])

  return (
    <Grid item xs={12}>
      <Card>
        {/* <CardHeader title='Filtrar por Tipo Nómina' /> */}
        <CardContent>
          <Grid container spacing={12}>
            <Grid item sm={2} xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  {allRows ? (
                    <Autocomplete
                      sx={{ width: 380, ml: 2, mr: 2 }}
                      options={allRows}
                      id='autocomplete-periodo'
                      isOptionEqualToValue={(option, value) => option.codigoPeriodo === value.codigoPeriodo}
                      getOptionLabel={option =>
                        dayjs(option.fechaNominaString).format('DD/MM/YYYY') + '-' + option.descripcionPeriodo
                      }
                      onChange={handlePeriodo}
                      renderInput={params => <TextField {...params} label='Periodos' />}
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

export default FilterPeriodo
