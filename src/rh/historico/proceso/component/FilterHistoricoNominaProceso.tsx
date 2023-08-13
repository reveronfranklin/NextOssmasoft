// ** React Imports
import {  useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/utilities/pickers//PickersCustomInput'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField} from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import {  setConceptos, setFechaDesde, setFechaHasta, setPersonaSeleccionado, setProcesoSeleccionado, setTiposNomina } from 'src/store/apps/rh'
import {  fetchDataPersonas } from 'src/store/apps/rh/thunks'


import { IListSimplePersonaDto } from '../../../../interfaces/rh/i-list-personas';

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IPersonaFilterDto } from 'src/interfaces/rh/i-filter-persona'
import { IRhProcesoGetDto } from 'src/interfaces/rh/i-rh-procesos-get-dto'
import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos'

const FilterHistoricoNominaProceso = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {


  const dispatch = useDispatch();

  const {fechaDesde,fechaHasta,personas,personaSeleccionado} = useSelector((state: RootState) => state.nomina)


  // ** States
  const [dateDesde, setDateDesde] = useState<DateType>(fechaDesde)
  const [dateHasta, setDateHasta] = useState<DateType>(fechaHasta)
  const [procesos, setProcesos] = useState<IRhProcesoGetDto[]>([])
  const [conceptosProceso, setConceptosProceso] = useState<IListConceptosDto[]>([])

  const handlerDesde=(desde:Date)=>{
    setDateDesde(desde)
    dispatch(setFechaDesde(desde));


  }
  const handlerHasta=(hasta:Date)=>{
    setDateHasta(hasta)
    dispatch(setFechaHasta(hasta));

  }


  const handlerProceso =(e: any,value:any)=>{
    console.log('',value)
    if(value!=null){
      dispatch(setProcesoSeleccionado(value))
      setConceptosProceso(value.conceptos)
    }else{
      const procesoDefault: IRhProcesoGetDto={
        codigoProceso: procesos[0].codigoProceso,
        descripcion :  procesos[0].descripcion,
        conceptos:[]
      }
      dispatch(setProcesoSeleccionado(procesoDefault))
      setConceptosProceso([]);

    }
  }

  const dataTipoNomina= async (value:any)=>{
    const filterTipoNomina:IPersonaFilterDto = {
      codigoPersona:value.codigoPersona,
      desde:fechaDesde,
      hasta:fechaHasta
    }
    const responseAllTipoNomina= await ossmmasofApi.post<any>('/RhTipoNomina/GetTipoNominaByCodigoPersona',filterTipoNomina);


    const {data} = responseAllTipoNomina;

    if(data){
      console.log('responseAll tipo nomina por persona',dataTipoNomina)
      dispatch(setTiposNomina(data));

    }
  }

  const dataConceptos= async (value:any)=>{
    const filter:IPersonaFilterDto = {
      codigoPersona:value.codigoPersona,
      desde:fechaDesde,
      hasta:fechaHasta
    }
    const responseAll= await ossmmasofApi.post<any>('/RhConceptos/GetConceptosByPersonas',filter);


    const {data} = responseAll;

    if(data){
      console.log('responseAll conceptos por persona',data)
      dispatch(setConceptos(data));

    }
  }

  const dataProcesos= async ()=>{

    const responseAll= await ossmmasofApi.get<any>('/RhProcesos/GetAll');

    const {data} = responseAll;

    if(data){
      console.log('responseAll conceptos por persona',data.data)
      setProcesos(data.data);

    }
  }

  const handlerPersona= async (e: any,value:any)=>{

    if(value){

      await  dataConceptos(value)
      await  dataTipoNomina(value);
      dispatch(setPersonaSeleccionado(value));
    }else{

      const persona:IListSimplePersonaDto ={
        apellido:'',
        cedula:0,
        codigoPersona:0,
        nombre:'',
        nombreCompleto:''
      };


      dispatch(setPersonaSeleccionado(persona));

    }



  }




  useEffect(() => {





    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));

      await fetchDataPersonas(dispatch);
      await dataProcesos()
      if(procesos && procesos.length>0){
        const procesoDefault: IRhProcesoGetDto={
          codigoProceso: procesos[0].codigoProceso,
          descripcion :  procesos[0].descripcion,
          conceptos:[]
        }
        dispatch(setProcesoSeleccionado(procesoDefault))
      }

      if(personaSeleccionado){
        await  dataTipoNomina(personaSeleccionado);
        await  dataConceptos(personaSeleccionado)
        dispatch(setPersonaSeleccionado(personaSeleccionado));
      }else{
        const persona:IListSimplePersonaDto ={
          apellido:'',
          codigoPersona:0,
          nombre:'',
          nombreCompleto:'',
          cedula:0
        };


        dispatch(setPersonaSeleccionado(persona));
      }


    };

     getData();




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch,fechaDesde,fechaHasta]);

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar Nomina Individual' />
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

                    sx={{ width: 550 }}
                    options={personas}
                    id='autocomplete-persona'
                    isOptionEqualToValue={(option, value) => option.codigoPersona=== value.codigoPersona}
                    getOptionLabel={option => option.cedula + ' ' + option.nombreCompleto}
                    onChange={handlerPersona}
                    renderInput={params => <TextField {...params} label='Personas' />}
                  />
              </div>

              <div>
                <Autocomplete

                    sx={{ width: 250 }}
                    options={procesos}
                    id='autocomplete-procesos'
                    isOptionEqualToValue={(option, value) => option.codigoProceso === value.codigoProceso}
                    getOptionLabel={option => option.codigoProceso + '-' +option.descripcion}
                    onChange={handlerProceso}
                    renderInput={params => <TextField {...params} label='Procesos' />}
                  />
              </div>
              <div>
                <Autocomplete
                    multiple={true}
                    sx={{ width: 250 }}
                    options={conceptosProceso}
                    id='autocomplete-conceptoProceso'
                    isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo+ value.codigoTipoNomina}
                    getOptionLabel={option => option.codigo + '-' +option.codigoTipoNomina +'-'+ option.denominacion}

                    renderInput={params => <TextField {...params} label='Conceptos Por Proceso' />}
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

export default FilterHistoricoNominaProceso
