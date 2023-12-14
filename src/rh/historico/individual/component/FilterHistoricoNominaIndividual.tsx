// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/utilities/pickers//PickersCustomInput'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setConceptoSeleccionado, setConceptos, setFechaDesde, setFechaHasta, setPersonaSeleccionado, setProcesoSeleccionado, setTipoQuery, setTiposNomina, setTiposNominaSeleccionado } from 'src/store/apps/rh'
import { fetchDataConceptos, fetchDataPersonas } from 'src/store/apps/rh/thunks'

import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos'
import { IListSimplePersonaDto } from '../../../../interfaces/rh/i-list-personas';
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IPersonaFilterDto } from 'src/interfaces/rh/i-filter-persona'
import { IRhProcesoGetDto } from 'src/interfaces/rh/i-rh-procesos-get-dto'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'

const FilterHistoricoNominaIndividual = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {


  const dispatch = useDispatch();

  const {fechaDesde,fechaHasta,tiposNomina,conceptos,personas,personaSeleccionado,conceptoSeleccionado} = useSelector((state: RootState) => state.nomina)
  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

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
    console.log('handler tipo nomina',value)
    if(value!=null){
      dispatch(setTiposNominaSeleccionado(value));
      buscarConceptos(value);
    }else{
      const tipoNomina: IListTipoNominaDto[]=[{
        codigoTipoNomina: 0,
        descripcion :  ''
      }]
      dispatch(setTiposNominaSeleccionado(tipoNomina));
      dispatch(setConceptoSeleccionado([]));
      buscarConceptos(tipoNomina);

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
        nombreCompleto:'',
        avatar:'',
        descripcionStatus:'',
        nacionalidad:'',
        sexo:'',
        fechaNacimiento:fechaActual,
        fechaNacimientoString:defaultDateString,
        fechaNacimientoObj:defaultDate,
        email:'',
        paisNacimiento:'',
        edad:0,
        descripcionEstadoCivil:'',
        paisNacimientoId:0,
        estadoNacimientoId:0,
        manoHabil:'',
        status:'',
        fechaGacetaNacional:'',
        estadoCivilId:0,
        estatura:0,
        peso:0,
        identificacionId:0,
        numeroIdentificacion:0,
        numeroGacetaNacional:0,

      };


      dispatch(setPersonaSeleccionado(persona));

    }



  }

  const buscarConceptos=async (codigoTipoNomina:IListTipoNominaDto[])=>{

    console.log('buscar conceptos',codigoTipoNomina);
    if(personaSeleccionado){
      await  dataConceptos(personaSeleccionado)
      await fetchDataConceptos(dispatch);
    }

    let conceptosNew:IListConceptosDto[]=[];
    for (let index = 0; index < codigoTipoNomina.length; index++) {
      const element = codigoTipoNomina[index];
      console.log(element)
      const dataFilter= conceptos.filter(concepto=>concepto.codigoTipoNomina==element.codigoTipoNomina);
      conceptosNew= [...conceptosNew,...dataFilter]
    }
    console.log(conceptosNew)

    setConceptosPorTipoNomina(conceptosNew);
  }


  const handlerConceptos =(e: any,value:any)=>{
    console.log('conceptos',value)
    if(value){
      dispatch(setConceptoSeleccionado(value));
    }


  }

  useEffect(() => {


    /*const persona:IListSimplePersonaDto ={
      apellido:'',
      cedula:0,
      codigoPersona:0,
      nombre:'',
      nombreCompleto:''
    };*/


    dispatch(setPersonaSeleccionado({}));

    const procesoDefault: IRhProcesoGetDto={
      codigoProceso: 0,
      descripcion : '',
      conceptos:[]
    }
    dispatch(setProcesoSeleccionado(procesoDefault))



    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));
      dispatch(setTipoQuery('INDIVIDUAL'))
      await fetchDataPersonas(dispatch);

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

                    sx={{ width: 450 }}
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
                    multiple={true}
                    sx={{ width: 350 }}
                    options={tiposNomina}
                    id='autocomplete-tipo-nomina'
                    isOptionEqualToValue={(option, value) => option.codigoTipoNomina=== value.codigoTipoNomina}
                    getOptionLabel={option => option.codigoTipoNomina + '-'+option.descripcion}
                    onChange={handleTiposNomina}
                    renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                  />
              </div>
              <div>
                <Autocomplete
                    multiple={true}
                    sx={{ width: 350 }}
                    options={conceptosPorTipoNomina}
                    id='autocomplete-concepto'
                    value={conceptoSeleccionado}
                    isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo+ value.codigoTipoNomina}
                    getOptionLabel={option => option.codigo + '-' +option.codigoTipoNomina +'-'+ option.denominacion}
                    onChange={handlerConceptos}
                    renderInput={params => <TextField {...params} label='Conceptos' />}
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

export default FilterHistoricoNominaIndividual
