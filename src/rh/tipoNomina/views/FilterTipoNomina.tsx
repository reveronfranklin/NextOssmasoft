// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'


// ** Custom Component Imports

// ** Types

import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { setListRhTipoNomina, setRhTipoNominaSeleccionado } from 'src/store/apps/rh-tipoNomina'

const FilterTipoNomina = () => {


  const dispatch = useDispatch();

  const {listRhTipoNomina} = useSelector((state: RootState) => state.rhTipoNomina)


  const handleTiposNomina= (e: any,value:any)=>{

    if(value!=null){
      dispatch(setRhTipoNominaSeleccionado(value));

    }else{

      dispatch(setRhTipoNominaSeleccionado({}));

    }



  }





  useEffect(() => {




    const getData = async () => {

      const responseAll= await ossmmasofApi.get<any>('/RhTipoNomina/GetAll');
      const data = responseAll.data;
      dispatch(setListRhTipoNomina(data));


    };

    getData();




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar por Tipo Nómina' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>



               <div>

                {listRhTipoNomina ?
                    ( <Autocomplete

                      sx={{ width: 350 }}
                      options={listRhTipoNomina}
                      id='autocomplete-tipo-nomina'
                      isOptionEqualToValue={(option, value) => option.codigoTipoNomina=== value.codigoTipoNomina}
                      getOptionLabel={option => option.codigoTipoNomina + '-'+option.descripcion}
                      onChange={handleTiposNomina}
                      renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                    /> ) : <div></div>
                }
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
