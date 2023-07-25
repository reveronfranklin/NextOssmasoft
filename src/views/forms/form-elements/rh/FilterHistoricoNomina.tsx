// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '../pickers/PickersCustomInput'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setConceptoSeleccionado, setFechaDesde, setFechaHasta, setPersonaSeleccionado, setTiposNominaSeleccionado } from 'src/store/apps/rh'
import { fetchDataConceptos, fetchDataPersonas, fetchDataTipoNomina } from 'src/store/apps/rh/thunks'

import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos'
import { IListSimplePersonaDto } from '../../../../interfaces/rh/i-list-personas';
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'

const FilterHistoricoNomina = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {


  const dispatch = useDispatch();

  const {fechaDesde,fechaHasta,tiposNomina,conceptos,personas} = useSelector((state: RootState) => state.nomina)


  // ** States
  const [dateDesde, setDateDesde] = useState<DateType>(fechaDesde)
  const [dateHasta, setDateHasta] = useState<DateType>(fechaHasta)
  const [conceptosPorTipoNomina, setConceptosPorTipoNomina] = useState<IListConceptosDto[]>(conceptos)
  const handlerDesde=(desde:Date)=>{
    setDateDesde(desde)
    dispatch(setFechaDesde(desde));

  }
  const handlerHasta=(hasta:Date)=>{
    setDateHasta(hasta)
    dispatch(setFechaHasta(hasta));

  }
  const handleTiposNomina= (e: any,value:any)=>{

    if(value!=null){
      dispatch(setTiposNominaSeleccionado(value));
      buscarConceptos(value.codigoTipoNomina);
    }else{
      const tipoNomina: IListTipoNominaDto={
        codigoTipoNomina: 0,
        descripcion :  ''
      }
      dispatch(setTiposNominaSeleccionado(tipoNomina));
      buscarConceptos(tipoNomina.codigoTipoNomina);
    }



  }
  const handlerPersona= (e: any,value:any)=>{
    if(value){
      dispatch(setPersonaSeleccionado(value));
    }else{

      const persona:IListSimplePersonaDto ={
        apellido:'',
        codigoPersona:0,
        nombre:'',
        nombreCompleto:''
      };


      dispatch(setPersonaSeleccionado(persona));
    }



  }

  const buscarConceptos=(codigoTipoNomina:number)=>{
    const dataFilter= conceptos.filter(concepto=>concepto.codigoTipoNomina==codigoTipoNomina);
    setConceptosPorTipoNomina(dataFilter);
  }
  const handlerConceptos =(e: any,value:any)=>{

    if(value){
      dispatch(setConceptoSeleccionado(value));
    }



  }

  useEffect(() => {

    const getTipoNomina = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));
      await fetchDataTipoNomina(dispatch);
      await fetchDataConceptos(dispatch);
      await fetchDataPersonas(dispatch);
    };
     getTipoNomina();



  }, [dispatch]);

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar Nomina' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
              <div>
                <DatePicker

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
                  selected={dateHasta}
                  id='basic-input-hasta'
                  popperPlacement={popperPlacement}
                  onChange={(dateHasta: Date) => (handlerHasta(dateHasta))}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Hasta' />}
                />
              </div>
              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={tiposNomina}
                    id='autocomplete-tipo-nomina'
                    getOptionLabel={option => option.descripcion}
                    onChange={handleTiposNomina}
                    renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                  />
              </div>
              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={conceptosPorTipoNomina}
                    id='autocomplete-concepto'
                    getOptionLabel={option => option.dercripcion}
                    onChange={handlerConceptos}
                    renderInput={params => <TextField {...params} label='Conceptos' />}
                  />
              </div>
              <div>
                <Autocomplete

                    sx={{ width: 450 }}
                    options={personas}
                    id='autocomplete-persona'
                    getOptionLabel={option => option.codigoPersona + ' ' + option.nombreCompleto}
                    onChange={handlerPersona}
                    renderInput={params => <TextField {...params} label='Personas' />}
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

export default FilterHistoricoNomina
