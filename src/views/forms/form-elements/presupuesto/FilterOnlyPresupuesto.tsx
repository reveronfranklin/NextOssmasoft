import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField, Box } from '@mui/material'

import { RootState } from 'src/store'
import { fetchDataListPresupuestoDto } from 'src/store/apps/presupuesto/thunks'
import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'

const FilterOnlyPresupuesto = () => {
  const dispatch = useDispatch()
  const {
    listpresupuestoDto,
    listpresupuestoDtoSeleccionado
  } = useSelector((state: RootState) => state.presupuesto)

  const presupuestoVacio: IListPresupuestoDto = {
    ano: 0,
    codigoPresupuesto: 0,
    descripcion: '',
    preFinanciadoDto: [],
    presupuestoEnEjecucion: false
  }

  const handlePresupuestos = (e: any, valor: IListPresupuestoDto | null) => {
    dispatch(setListpresupuestoDtoSeleccionado(valor || presupuestoVacio))
  }

  // Verificar si listpresupuestoDtoSeleccionado es un objeto válido con codigoPresupuesto
  const isValidSelection = (selection: any): boolean => {
    return (
      selection &&
      typeof selection === 'object' &&
      'codigoPresupuesto' in selection &&
      selection.codigoPresupuesto !== undefined &&
      selection.codigoPresupuesto !== 0
    )
  }

  // Determinar el valor actual para el Autocomplete
  const currentValue = isValidSelection(listpresupuestoDtoSeleccionado)
    ? listpresupuestoDtoSeleccionado
    : null

  useEffect(() => {
    const getData = async () => {
      await fetchDataListPresupuestoDto(dispatch)
    }
    getData()
  }, [dispatch])

  return (
    <Grid item xs={12} paddingBottom={5}>
      <Card>
        <CardHeader title='Filtrar Presupuesto' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <Autocomplete
                  sx={{ width: 450 }}
                  options={listpresupuestoDto?.filter(Boolean) || []}
                  value={currentValue}
                  id='autocomplete-MaestroPresupuesto'
                  isOptionEqualToValue={(option, value) => {
                    // Si value es un objeto vacío o no tiene codigoPresupuesto, devolver false
                    if (!value || typeof value !== 'object' || !('codigoPresupuesto' in value)) {
                      return false
                    }

                    return option.codigoPresupuesto === value.codigoPresupuesto
                  }}
                  getOptionLabel={(option) =>
                    option?.codigoPresupuesto && option?.descripcion
                      ? `${option.codigoPresupuesto} - ${option.descripcion}`
                      : ''
                  }
                  onChange={handlePresupuestos}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Seleccionar'
                      placeholder="Buscar presupuesto..."
                    />
                  )}
                  noOptionsText="No hay presupuestos disponibles"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default FilterOnlyPresupuesto
