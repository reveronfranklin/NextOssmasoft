// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'

import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

import FormHelperText from '@mui/material/FormHelperText'

import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

//import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'



// ** Third Party Imports
//import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types

//import { IFechaDto } from 'src/interfaces/fecha-dto'
//import { fechaToFechaObj } from 'src/utlities/fecha-to-fecha-object'
import { useDispatch } from 'react-redux'

//import { getDateByObject } from 'src/utlities/ge-date-by-object'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useState } from 'react'
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import { IOssConfig } from 'src/interfaces/SIS/i-oss-config-get-dto'
import { IPrePlanUnicoCuentasGetDto } from 'src/interfaces/Presupuesto/i-pre-plan-unico-cuentas-get-dto'
import { IDeletePrePucDto } from 'src/interfaces/Presupuesto/i-delete-pre-puc-dto'
import { setPucSeleccionado, setVerPucActive } from 'src/store/apps/PUC'
import { IPrePlanUnicoCuentaUpdateDto } from 'src/interfaces/Presupuesto/i-pre-plan-unico-cuenta-update-dto'

interface FormInputs {
  codigoPuc :number;
  codigoPucPadre :number;
  codigoGrupo :string;
  codigoNivel1:string;
  codigoNivel2 :string;
  codigoNivel3 :string
  codigoNivel4:string;
  codigoNivel5 :string;
  codigoNivel6 :string;
  denominacion :string;
  unidadEjecutora:string;
  descripcion:string;
  codigoPresupuesto:number;

}



const FormPreDescriptivaUpdateAsync = () => {
  // ** States
  const dispatch = useDispatch();
  const {pucSeleccionado,
        listGrupos,
        listNivel1,
        listNivel2,
        listNivel3,
        listNivel4,
        listNivel5,
        listNivel6,
        listCodigosPucHistorico,
        listPuc
      } = useSelector((state: RootState) => state.puc)



  const  getPuc=(codigoPuc:number)=>{
    const result = listPuc.filter((puc)=>{

      return puc.codigoPuc==codigoPuc;
    });

    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);
  const [grupo, setGrupo] = useState<IOssConfig>({ clave: 'CODIGO_GRUPO', valor: pucSeleccionado.codigoGrupo });
  const [nivel1, setNivel1] = useState<IOssConfig>({ clave: 'CODIGO_NIVEL1', valor: pucSeleccionado.codigoNivel1 });
  const [nivel2, setNivel2] = useState<IOssConfig>({ clave: 'CODIGO_NIVEL2', valor: pucSeleccionado.codigoNivel2 });
  const [nivel3, setNivel3] = useState<IOssConfig>({ clave: 'CODIGO_NIVEL3', valor: pucSeleccionado.codigoNivel3});
  const [nivel4, setNivel4] = useState<IOssConfig>({ clave: 'CODIGO_NIVEL4', valor: pucSeleccionado.codigoNivel4});
  const [nivel5, setNivel5] = useState<IOssConfig>({ clave: 'CODIGO_NIVEL5', valor: pucSeleccionado.codigoNivel5});
  const [nivel6, setNivel6] = useState<IOssConfig>({ clave: 'CODIGO_NIVEL6', valor: pucSeleccionado.codigoNivel6});
  const [pucPadre,setPucPadre] = useState<IPrePlanUnicoCuentasGetDto>(getPuc(pucSeleccionado.codigoPucPadre));

  const defaultValues = {
    codigoPuc: pucSeleccionado.codigoPuc,
    codigoGrupo:pucSeleccionado.codigoGrupo,
    codigoNivel1:pucSeleccionado.codigoNivel1,
    codigoNivel2:pucSeleccionado.codigoNivel2,
    codigoNivel3:pucSeleccionado.codigoNivel3,
    codigoNivel4:pucSeleccionado.codigoNivel4,
    codigoNivel5:pucSeleccionado.codigoNivel5,
    codigoNivel6:pucSeleccionado.codigoNivel6,
    denominacion:(pucSeleccionado.denominacion === null || pucSeleccionado.denominacion === 'undefined') ? '' : pucSeleccionado.denominacion,
    descripcion:(pucSeleccionado.descripcion === null || pucSeleccionado.descripcion === 'undefined') ? '' : pucSeleccionado.descripcion,
    codigoPucPadre: pucSeleccionado.codigoPucPadre,
    codigoPresupuesto:pucSeleccionado.codigoPresupuesto,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleChangeCodigoGrupo= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoGrupo',value.valor);
      setGrupo({ clave: 'CODIGO_GRUPO', valor: value.valor});
    }
  }
  const handleChangeCodigoNivel1= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoNivel1',value.valor);
      setNivel1({ clave: 'CODIGO_NIVEL1', valor: value.valor });
    }
  }

  const handleChangeCodigoNivel2= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoNivel2',value.valor);
      setNivel2({ clave: 'CODIGO_NIVEL2', valor: value.valor });
    }
  }
  const handleChangeCodigoNivel3= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoNivel3',value.valor);
      setNivel3({ clave: 'CODIGO_NIVEL3', valor: value.valor });
    }
  }
  const handleChangeCodigoNivel4= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoNivel4',value.valor);
      setNivel4({ clave: 'CODIGO_NIVEL4', valor: value.valor });
    }
  }
  const handleChangeCodigoNivel5= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoNivel5',value.valor);
      setNivel5({ clave: 'CODIGO_NIVEL5', valor: value.valor });
    }
  }
  const handleChangeCodigoNivel6= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoNivel6',value.valor);
      setNivel6({ clave: 'CODIGO_NIVEL6', valor: value.valor });
    }
  }
  const handlerPucPadre=async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoPucPadre',value.codigoPuc);
      setPucPadre(value);


    }else{
      setValue('codigoPucPadre',0);
    }
  }
  const handleChangePucHistorico= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoGrupo',value.codigoGrupo);
      setValue('codigoNivel1',value.codigoNivel1);
      setValue('codigoNivel2',value.codigoNivel2);
      setValue('codigoNivel3',value.codigoNivel3);
      setValue('codigoNivel4',value.codigoNivel4);
      setValue('codigoNivel5',value.codigoNivel5);
      setValue('codigoNivel6',value.codigoNivel6);

      setGrupo({ clave: 'CODIGO_GRUPO', valor: value.codigoGrupo});
      setNivel1({ clave: 'CODIGO_NIVEL1', valor: value.codigoNivel1 });
      setNivel2({ clave: 'CODIGO_NIVEL2', valor: value.codigoNivel2 });
      setNivel3({ clave: 'CODIGO_NIVEL3', valor: value.codigoNivel3 });
      setNivel4({ clave: 'CODIGO_NIVEL4', valor: value.codigoNivel4 });
      setNivel5({ clave: 'CODIGO_NIVEL5', valor: value.codigoNivel5 });
      setNivel6({ clave: 'CODIGO_NIVEL6', valor: value.codigoNivel6 });

    }


  }



  const handleDelete = async  () => {

    setOpen(false);
    const deletePuc : IDeletePrePucDto={
      codigoPuc:pucSeleccionado.codigoPuc
    }
    const responseAll= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/Delete',deletePuc);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerPucActive(false))
      dispatch(setPucSeleccionado({}))
    }


  };


  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updatePuc:IPrePlanUnicoCuentaUpdateDto= {
      codigoPuc:pucSeleccionado.codigoPuc,
      codigoGrupo:data.codigoGrupo,
      codigoNivel1:data.codigoNivel1,
      codigoNivel2:data.codigoNivel2,
      codigoNivel3:data.codigoNivel3,
      codigoNivel4:data.codigoNivel4,
      codigoNivel5:data.codigoNivel5,
      codigoNivel6:data.codigoNivel6,
      codigoPresupuesto:data.codigoPresupuesto,
      denominacion:data.denominacion,
      descripcion:data.descripcion,
    };



    const responseAll= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/Update',updatePuc);

    if(responseAll.data.isValid){
      dispatch(setPucSeleccionado(responseAll.data.data))
      dispatch(setVerPucActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }

  return (
    <Card>
      <CardHeader title='Modificar Plan Unico de Cuentas(PUC)' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* Codigo de Plan Unico de Cuentas(Puc) */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPuc'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Codigo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPuc)}
                      aria-describedby='validation-async-codigo-puc'
                      disabled
                    />
                  )}
                />
                {errors.codigoPuc && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigo-puc'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>



            {/* Denominacion de Indice Categoria Programada(ICP) */}
            <Grid item xs={10}>
              <FormControl fullWidth>
                <Controller
                  name='denominacion'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Denominacion'
                      onChange={onChange}
                      placeholder='Denominacion'
                      error={Boolean(errors.denominacion)}
                      aria-describedby='validation-async-denominacion'
                    />
                  )}
                />
                {errors.denominacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-denominacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listCodigosPucHistorico}

                        id='autocomplete-listpuchistorico'
                        isOptionEqualToValue={(option, value) => option.concat=== value.concat}
                        getOptionLabel={option => option.concat }
                        onChange={handleChangePucHistorico}
                        renderInput={params => <TextField {...params} label='Codigos PUC' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo grupo plan unico de cuentas(PUC) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70}}
                        options={listGrupos}
                        value={grupo}
                        id='autocomplete-grupo'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoGrupo}
                        renderInput={params => <TextField {...params} label='Grupos' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo Programa de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70 }}
                        options={listNivel1}

                        value={nivel1}
                        id='autocomplete-nivel1'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoNivel1}
                        renderInput={params => <TextField {...params} label='Nivel 1' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo SubPrograma de Indice Categoria Programada(ICP) */}

         <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70 }}
                        options={listNivel2}
                        value={nivel2}
                        id='autocomplete-nivel2'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoNivel2}
                        renderInput={params => <TextField {...params} label='Nivel 2' />}
                      />

                </FormControl>
            </Grid>
            {/* Codigo Proyecto de Indice Categoria Programada(ICP) */}

             <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70 }}
                        options={listNivel3}
                        value={nivel3}
                        id='autocomplete-nivel3'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoNivel3}
                        renderInput={params => <TextField {...params} label='Nivel 3' />}
                      />

                </FormControl>
            </Grid>
           {/* Codigo Actividad de Indice Categoria Programada(ICP) */}

             <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70 }}
                        options={listNivel4}
                        value={nivel4}
                        id='autocomplete-nivel4'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoNivel4}
                        renderInput={params => <TextField {...params} label='Nivel 4' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo Oficina de Indice Categoria Programada(ICP) */}

             <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70 }}
                        options={listNivel5}
                        value={nivel5}
                        id='autocomplete-nivel5'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoNivel5}
                        renderInput={params => <TextField {...params} label='Nivel 5' />}
                      />

                </FormControl>
            </Grid>

             <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 70 }}
                        options={listNivel6}
                        value={nivel6}
                        id='autocomplete-nivel6'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoNivel6}
                        renderInput={params => <TextField {...params} label='Nivel 6' />}
                      />

                </FormControl>
            </Grid>


            {/* Descripcion de Indice Categoria Programada(ICP) */}
            <Grid item xs={10}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ maxLength: 4000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Descripcion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-descripcion'
                    />
                  )}
                />
                {errors.descripcion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


              <Grid item xs={12}>
                <FormControl fullWidth>
                      <Autocomplete
                      value={pucPadre}

                      options={listPuc}
                      id='autocomplete-icppadre'
                      getOptionLabel={option => option.codigoPucConcat + ' ' + option.denominacion}
                      onChange={handlerPucPadre}
                      renderInput={params => <TextField {...params} label='Padre' />}
                    />

                </FormControl>
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
              <Button variant="outlined"  size='large' onClick={handleClickOpen} sx={{ color: 'error.main' ,ml:2}} >
                Eliminar
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Esta Seguro de Eliminar este PUC?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminara el PUC solo si no tiene movimiento asociado
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleDelete} autoFocus>
                    Si
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

          </Grid>
          <Box>
              {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>
        </form>
      </CardContent>
    </Card>
  )


}

export default FormPreDescriptivaUpdateAsync
