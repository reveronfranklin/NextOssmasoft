// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import FormHelperText from '@mui/material/FormHelperText'

import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

// ** Icon Imports

//import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'



// ** Third Party Imports
//import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types


import { useDispatch } from 'react-redux'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box} from '@mui/material'

// ** Third Party Imports
import  { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { setListPreAsignacionesCreate } from 'src/store/apps/pre-asignaciones'
import Excel from '../components/Excel'
import { IPreAsignacionesExcelUpdateDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesExcelUpdateDto'
import TableServerSideExcelCreate from '../views/TableServerSideExcelCreate'

interface FormInputs {

  codigoPresupuesto:number;

}



const FormPreAsignacionesExcelCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {listpresupuestoDto} = useSelector((state: RootState) => state.presupuesto)
  const {preAsignacionesSeleccionado,listPreAsignacionesCreate} = useSelector((state: RootState) => state.preAsignaciones)


  const  getPresupuesto=(id:number)=>{

    const result = listpresupuestoDto?.filter((elemento)=>{

      return elemento.codigoPresupuesto==id;
    });


    return result[0];
  }




  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [validando, setValidando] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [presupuesto,setPresupuesto] = useState<IListPresupuestoDto>(getPresupuesto(preAsignacionesSeleccionado.codigoPresupuesto));

  const defaultValues = {

      codigoAsignacion :preAsignacionesSeleccionado.codigoAsignacion,
      codigoPresupuesto:preAsignacionesSeleccionado.codigoPresupuesto,
      codigoIcp:preAsignacionesSeleccionado.codigoIcp,
      codigoPuc:preAsignacionesSeleccionado.codigoPuc,
      presupuestado:preAsignacionesSeleccionado.presupuestado,
      ordinario:preAsignacionesSeleccionado.ordinario,
      coordinado:preAsignacionesSeleccionado.coordinado,
      laee:preAsignacionesSeleccionado.laee,
      fides:preAsignacionesSeleccionado.fides
  }

  // ** Hook
  const {

    handleSubmit,
    setValue,
  } = useForm<FormInputs>({ defaultValues })



  const handleValidate = async  () => {

    setValidando(true)
    setErrorMessage('');
    const asignaciones : IPreAsignacionesExcelUpdateDto={
      codigoPresupuesto:presupuesto.codigoPresupuesto,
      asignaciones:listPreAsignacionesCreate
    }
    const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/ValidarListAsignaciones',asignaciones);

    console.log(responseAll)
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){
      setErrorMessage('Archivo Validado satisfactoriamente');
      console.log(responseAll.data)
    }

    setValidando(false)


  };
  const onSubmit = async (data:FormInputs) => {

    setLoading(true)
    setErrorMessage('');
    console.log(data)
    const asignaciones : IPreAsignacionesExcelUpdateDto={
      codigoPresupuesto:presupuesto.codigoPresupuesto,
      asignaciones:listPreAsignacionesCreate
    }
    console.log('updateConceptoAcumulado',asignaciones)
    const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/CreateListAsignaciones',asignaciones);
    if(responseAll.data.isValid){
      console.log('registro agregado',responseAll.data.data)

      const copyAsignaciones = [...listPreAsignacionesCreate];
      copyAsignaciones.push(responseAll.data.data);
      dispatch(setListPreAsignacionesCreate(copyAsignaciones))
    }
    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Actualizado')
  }

  const handlePresupuestos= async (e: any,value:any)=>{



    if(value){



      dispatch(setListpresupuestoDtoSeleccionado(value));
      setValue('codigoPresupuesto',value.codigoPresupuesto);
      setPresupuesto(value);


    }else{

      const presupuesto:IListPresupuestoDto ={
        ano:0,
        codigoPresupuesto:0,
        descripcion:'',
        preFinanciadoDto:[],
        presupuestoEnEjecucion:false
      };


      dispatch(setListpresupuestoDtoSeleccionado(presupuesto));
    }


  }


  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      dispatch(setListPreAsignacionesCreate([]));


      setLoading(false);
    };


    console.log(popperPlacement);

    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='PRE - Crear Credito Presupuestario' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>


            {/* Concepto Presupuesto */}
            <Grid item sm={10} xs={12}>


                <Autocomplete

                    options={listpresupuestoDto}
                    value={presupuesto}
                    id='autocomplete-concepto'
                    isOptionEqualToValue={(option, value) => option.codigoPresupuesto === value.codigoPresupuesto}
                    getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion }
                    onChange={handlePresupuestos}
                    renderInput={params => <TextField {...params} label='Presupuesto' />}
                  />


            </Grid>





            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained'>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Guardar
              </Button>
              <Button size='large' onClick={handleValidate}  variant='contained' sx={{ml:2}} >
                {validando ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Validar
              </Button>

            </Grid>

          </Grid>
          <Box>
              {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>
        </form>
        <Excel></Excel>
      </CardContent>

      <TableServerSideExcelCreate></TableServerSideExcelCreate>
    </Card>
  )


}

export default FormPreAsignacionesExcelCreateAsync
