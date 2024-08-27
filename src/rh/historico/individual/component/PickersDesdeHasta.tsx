// ** React Imports
import { useState } from 'react'

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
    if(fechaDesde>fechaHasta){
      handlerDesde(new Date(2010, 0, 1))
    }
  }

  return (
      <Card>
        <CardHeader title='Filtrar' />
        <CardContent>
          <Grid container spacing={5} >
            <Grid item sm={6} xs={12}>
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
            </Grid>
            <Grid item sm={6} xs={12}>
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  )
}

export default PickersDesdeHasta
