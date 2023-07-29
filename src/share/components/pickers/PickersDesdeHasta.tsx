// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '../pickers/PickersCustomInput'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setFechaDesde, setFechaHasta } from 'src/store/apps/ossmasoft'


const PickersDesdeHasta = () => {


  const dispatch = useDispatch();

  const {fechaDesde,fechaHasta} = useSelector((state: RootState) => state.ossmmasofGlobal)


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


              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} >
                  <div>
                    <DatePicker
                      selected={dateDesde}
                      id='basic-input-desde'

                      onChange={(dateDesde: Date) => (handlerDesde(dateDesde))}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='Desde' />}
                    />
                  </div>

                 <div style={{ paddingLeft: 20 }}>
                    <DatePicker
                      selected={dateHasta}
                      id='basic-input-hasta'

                      onChange={(dateHasta: Date) => (handlerHasta(dateHasta))}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='Hasta' />}
                    />
                  </div>

              </Box>



  )
}

export default PickersDesdeHasta
