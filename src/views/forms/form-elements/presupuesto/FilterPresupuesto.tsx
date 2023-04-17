// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../pickers/PickersCustomInput'

// ** Types
//import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { fetchDataListPresupuestoDto, fetchDataPreMtrDenominacionPuc, fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'


import { IFilterPresupuestoIpcPuc } from 'src/interfaces/Presupuesto/i-filter-presupuesto-ipc-puc'
import { setFilterPresupuestoIpcPuc } from 'src/store/apps/presupuesto'

const FilterPresupuesto = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {


  const dispatch = useDispatch();

  const {listpresupuestoDto,preMtrUnidadEjecutora,preMtrDenominacionPuc,filterPresupuestoIpcPuc} = useSelector((state: RootState) => state.presupuesto)





  // ** States

  //const [conceptosPorTipoNomina, setConceptosPorTipoNomina] = useState<IListConceptosDto[]>(conceptos)


  const handlePresupuestos= (e: any,value:any)=>{

    console.log(value)

    if(value){

      const filter:IFilterPresupuestoIpcPuc ={
        codigoPresupuesto:value.codigoPresupuesto,
        codigoIPC:filterPresupuestoIpcPuc.codigoIPC,
        codigoPuc:filterPresupuestoIpcPuc.codigoPuc,
      };


      dispatch(setFilterPresupuestoIpcPuc(filter));
    }

  }
  const handlerDenominacionPuc= (e: any,value:any)=>{

    console.log(value)
    if(value){

      const filter:IFilterPresupuestoIpcPuc ={
        codigoPresupuesto:filterPresupuestoIpcPuc.codigoPresupuesto,
        codigoIPC:filterPresupuestoIpcPuc.codigoIPC,
        codigoPuc:value.codigoPuc,
      };


      dispatch(setFilterPresupuestoIpcPuc(filter));
    }


  }


  const handlerUnidadEjecutora =(e: any,value:any)=>{

    console.log('handlerUnidadEjecutora en: ',value)
    if(value){

      const filter:IFilterPresupuestoIpcPuc ={
        codigoPresupuesto:filterPresupuestoIpcPuc.codigoPresupuesto,
        codigoIPC:value.codigoIcp,
        codigoPuc:filterPresupuestoIpcPuc.codigoPuc,
      };


      dispatch(setFilterPresupuestoIpcPuc(filter));
    }


  }

  useEffect(() => {

    const getData = async () => {
      await fetchDataListPresupuestoDto(dispatch);
      await fetchDataPreMtrDenominacionPuc(dispatch);
      await fetchDataPreMtrUnidadEjecutora(dispatch);

    };
    getData();



  }, [dispatch]);

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar Saldo Presupuesto' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>


              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={listpresupuestoDto}
                    id='autocomplete-tipo-nomina'
                    getOptionLabel={option => option.descripcion}
                    onChange={handlePresupuestos}
                    renderInput={params => <TextField {...params} label='Presupuesto' />}
                  />
              </div>
              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={preMtrUnidadEjecutora}
                    id='autocomplete-concepto'
                    getOptionLabel={option => option.dercripcion  + '-' + option.id }
                    onChange={handlerUnidadEjecutora}
                    renderInput={params => <TextField {...params} label='Unidad Ejecutora' />}
                  />
              </div>
               <div>
                    <Autocomplete

                      sx={{ width: 350 }}

                      options={preMtrDenominacionPuc  }
                      id='autocomplete-preMtrDenominacionPuc'
                      getOptionLabel={option => option.dercripcion + '-' + option.id }
                      onChange={handlerDenominacionPuc}
                      renderInput={params => <TextField {...params} label='Puc' />}
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

export default FilterPresupuesto
