// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'


import { Autocomplete, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import {  setPersonaSeleccionado } from 'src/store/apps/rh'
import { fetchDataPersonas } from 'src/store/apps/rh/thunks'
import { IListSimplePersonaDto } from '../../../../interfaces/rh/i-list-personas';


const FilterPersona = ({personaProp}) => {


  const dispatch = useDispatch();

  const {personas} = useSelector((state: RootState) => state.nomina)
  const [persona,setPersona] = useState<IListSimplePersonaDto>();

  // ** States


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



  useEffect(() => {

    const getPersonas = async () => {

      await fetchDataPersonas(dispatch);
      setPersona(personaProp)
    };
    getPersonas();



  }, [dispatch, personaProp]);

  return (
    <Grid item xs={12}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
            <Autocomplete
                value={persona}
                sx={{ width: 450 }}
                options={personas}
                id='autocomplete-persona'
                getOptionLabel={option => option.codigoPersona + ' ' + option.nombreCompleto}
                onChange={handlerPersona}
                renderInput={params => <TextField {...params} label='Personas' />}
              />

        </Box>
  </Grid>

  )
}

export default FilterPersona
