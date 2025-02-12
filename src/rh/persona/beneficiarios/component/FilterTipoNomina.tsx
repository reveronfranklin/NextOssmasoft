// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/utilities/pickers//PickersCustomInput'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import {
  setConceptoSeleccionado,
  setConceptos,
  setFechaDesde,
  setFechaHasta,
  setPersonaSeleccionado,
  setProcesoSeleccionado,
  setTipoQuery,
  setTiposNomina,
  setTiposNominaSeleccionado
} from 'src/store/apps/rh'
import { fetchDataConceptos } from 'src/store/apps/rh/thunks'

import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos'
import { IListSimplePersonaDto } from '../../../../interfaces/rh/i-list-personas'
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IPersonaFilterDto } from 'src/interfaces/rh/i-filter-persona'
import { IRhProcesoGetDto } from 'src/interfaces/rh/i-rh-procesos-get-dto'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'

const FilterTipoNomina = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  const dispatch = useDispatch()

  const { fechaDesde, fechaHasta, tiposNomina, conceptos, personaSeleccionado, conceptoSeleccionado } = useSelector(
    (state: RootState) => state.nomina
  )

  const fechaActual = new Date()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const currentMonthString = '00' + monthByIndex(currentMonth).toString()

  const currentDay = new Date().getDate()
  const currentDayString = '00' + currentDay.toString()
  const defaultDate: IFechaDto = {
    year: currentYear.toString(),
    month: currentMonthString.slice(-2),
    day: currentDayString.slice(-2)
  }
  const defaultDateString = fechaActual.toISOString()

  // ** States

  const handleTiposNomina = (e: any, value: any) => {
    console.log('handler tipo nomina', value)
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
      console.log('responseAll tipo nomina por persona', dataTipoNomina)
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
