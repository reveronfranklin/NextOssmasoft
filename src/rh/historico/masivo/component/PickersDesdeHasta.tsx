// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/utilities/pickers/PickersCustomInput'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setFechaDesde, setFechaHasta } from 'src/store/apps/rh'

const PickersDesdeHasta = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {


  const dispatch = useDispatch();

  const {fechaDesde,fechaHasta} = useSelector((state: RootState) => state.nomina)


  // ** States
  const [dateDesde, setDateDesde] = useState<DateType>(fechaDesde)
  const [dateHasta, setDateHasta] = useState<DateType>(fechaHasta)

  const handlerDesde=(desde:Date)=>{
    setDateDesde(desde)
    dispatch(setFechaDesde(desde));

  }
  const handlerHasta=(hasta:Date)=>{
    setDateHasta(hasta)
    dispatch(setFechaHasta(hasta));

  }

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar Nomina' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
              <div>
                <DatePicker
                dateFormat="dd/MM/yyyy"
                  selected={dateDesde}
                  id='basic-input-desde'
                  popperPlacement={popperPlacement}
                  onChange={(dateDesde: Date) => (handlerDesde(dateDesde))}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Desde' />}
                />
              </div>
              <div>
                <DatePicker
                dateFormat="dd/MM/yyyy"
                  selected={dateHasta}
                  id='basic-input-hasta'
                  popperPlacement={popperPlacement}
                  onChange={(dateHasta: Date) => (handlerHasta(dateHasta))}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Hasta' />}
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

export default PickersDesdeHasta
