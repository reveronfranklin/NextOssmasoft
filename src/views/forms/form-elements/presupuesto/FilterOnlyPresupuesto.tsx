// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
//import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../pickers/PickersCustomInput'

// ** Types
//import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { fetchDataListPresupuestoDto } from 'src/store/apps/presupuesto/thunks'

import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'

//const FilterPresupuesto = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {

const FilterOnlyPresupuesto = () => {
  const dispatch = useDispatch()

  const { listpresupuestoDto, listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)

  // ** States

  //const [conceptosPorTipoNomina, setConceptosPorTipoNomina] = useState<IListConceptosDto[]>(conceptos)

  const handlePresupuestos = async (e: any, value: any) => {
    if (value) {
      dispatch(setListpresupuestoDtoSeleccionado(value))
    } else {
      const presupuesto: IListPresupuestoDto = {
        ano: 0,
        codigoPresupuesto: 0,
        descripcion: '',
        preFinanciadoDto: [],
        presupuestoEnEjecucion: false
      }

      dispatch(setListpresupuestoDtoSeleccionado(presupuesto))
    }
  }

  useEffect(() => {
    const getData = async () => {
      await fetchDataListPresupuestoDto(dispatch)
    }
    getData()
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Filtrar Presupuesto' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  <Autocomplete
                    sx={{ width: 350 }}
                    options={listpresupuestoDto}
                    defaultValue={listpresupuestoDtoSeleccionado}
                    id='autocomplete-MaestroPresupuesto'
                    isOptionEqualToValue={(option, value) => option.codigoPresupuesto === value.codigoPresupuesto}
                    getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion}
                    onChange={handlePresupuestos}
                    renderInput={params => <TextField {...params} label='Presupuesto' />}
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

export default FilterOnlyPresupuesto
