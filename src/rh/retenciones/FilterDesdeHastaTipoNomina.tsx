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
import { setFechaDesde, setFechaHasta, setTipoNominaSeleccionado, setTiposNomina } from 'src/store/apps/rh'

import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

const FilterDesdeHastaTipoNomina = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  const dispatch = useDispatch()

  const { fechaDesde, fechaHasta, tiposNomina } = useSelector((state: RootState) => state.nomina)
  const { tipoNominaSeleccionado = {} as IListTipoNominaDto } = useSelector((state: RootState) => state.nomina)

  // ** States
  const [dateDesde, setDateDesde] = useState<DateType>(fechaDesde)
  const [dateHasta, setDateHasta] = useState<DateType>(fechaHasta)

  const handlerDesde = (desde: Date) => {
    setDateDesde(desde)
    dispatch(setFechaDesde(desde))
  }
  const handlerHasta = (hasta: Date) => {
    setDateHasta(hasta)
    dispatch(setFechaHasta(hasta))
  }
  const handleTiposNomina = (e: any, value: any) => {
    console.log('handler tipo nomina', value)
    if (value != null) {
      dispatch(setTipoNominaSeleccionado(value))
    } else {
      const tipoNomina: IListTipoNominaDto = {
        codigoTipoNomina: 0,
        descripcion: ''
      }
      dispatch(setTipoNominaSeleccionado(tipoNomina))
    }
  }

  const dataTipoNomina = async () => {
    const responseAllTipoNomina = await ossmmasofApi.get<any>('/RhTipoNomina/GetAll')

    const { data } = responseAllTipoNomina

    if (data) {
      console.log('responseAll tipo nomina por persona', dataTipoNomina)
      dispatch(setTiposNomina(data))
      if (!tipoNominaSeleccionado.codigoTipoNomina) {
        dispatch(setTipoNominaSeleccionado(data[0]))
      }
    }
  }

  useEffect(() => {
    const getData = async () => {
      await dataTipoNomina()
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Filtrar Desde-Hasta/Tipo Nomina' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={dateDesde}
                    id='basic-input-desde'
                    popperPlacement={popperPlacement}
                    onChange={(dateDesde: Date) => handlerDesde(dateDesde)}
                    placeholderText='Click to select a date'
                    customInput={<CustomInput label='Desde' />}
                  />
                </div>
                <div>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={dateHasta}
                    id='basic-input-hasta'
                    popperPlacement={popperPlacement}
                    onChange={(dateHasta: Date) => handlerHasta(dateHasta)}
                    placeholderText='Click to select a date'
                    customInput={<CustomInput label='Hasta' />}
                  />
                </div>

                <div>
                  <Autocomplete
                    multiple={false}
                    sx={{ width: 350 }}
                    value={tipoNominaSeleccionado}
                    options={tiposNomina}
                    id='autocomplete-tipo-nomina'
                    isOptionEqualToValue={(option, value) => option.codigoTipoNomina === value.codigoTipoNomina}
                    getOptionLabel={option => option.codigoTipoNomina + '-' + option.descripcion}
                    onChange={handleTiposNomina}
                    renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                  />
                </div>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default FilterDesdeHastaTipoNomina
