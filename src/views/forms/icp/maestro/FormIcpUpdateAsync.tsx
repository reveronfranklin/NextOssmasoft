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
import { setIcpSeleccionado, setVerIcpActive } from 'src/store/apps/ICP';
import { IUpdateIcp } from 'src/interfaces/Presupuesto/i-update-pre-indice-categoria-programatica-dto'
import { IDeletePreIcpDto } from 'src/interfaces/Presupuesto/i-delete-pre-iicp-dto'
import { IOssConfig } from 'src/interfaces/SIS/i-oss-config-get-dto'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'

interface FormInputs {
  codigoIcp :number;
  ano :number;
  codigoSector:string;
  codigoPrograma :string;
  codigoSubPrograma :string
  codigoProyecto:string;
  codigoActividad :string;
  codigoOficina :string;
  denominacion :string;
  unidadEjecutora:string;
  descripcion:string;
  codigoFuncionario:number;
  codigoPresupuesto:number;

}



const FormIcpUpdateAsync = () => {
  // ** States
  const dispatch = useDispatch();
  const {icpSeleccionado,
        listSectores,
        listProgramas,
        listSubProgramas,
        listProyectos,
        listActividades,
        listOficinas,
        listCodigosIcpHistorico
      } = useSelector((state: RootState) => state.icp)

  const {personas} = useSelector((state: RootState) => state.nomina)

  const getPersona=(codigoPersona:number)=>{
    const result = personas.filter((persona)=>{

      return persona.codigoPersona==codigoPersona;
    });

    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);
  const [sector, setSector] = useState<IOssConfig>({ clave: 'CODIGO_SECTOR', valor: icpSeleccionado.codigoSector });
  const [programa, setPrograma] = useState<IOssConfig>({ clave: 'CODIGO_PROGRAMA', valor: icpSeleccionado.codigoPrograma });
  const [subPrograma, setSubPrograma] = useState<IOssConfig>({ clave: 'CODIGO_SUBPROGRAMA', valor: icpSeleccionado.codigoSubPrograma });
  const [proyecto, setProyecto] = useState<IOssConfig>({ clave: 'CODIGO_PROYECTO', valor: icpSeleccionado.codigoProyecto});
  const [actividad, setActividad] = useState<IOssConfig>({ clave: 'CODIGO_ACTIVIDAD', valor: icpSeleccionado.codigoActividad});
  const [oficina, setOficina] = useState<IOssConfig>({ clave: 'CODIGO_OFICINA', valor: icpSeleccionado.codigoOficina});
  const [persona,setPersona] = useState<IListSimplePersonaDto>(getPersona(icpSeleccionado.codigoFuncionario));


  const defaultValues = {
    codigoIcp: icpSeleccionado.codigoIcp,
    ano:icpSeleccionado.ano,
    codigoSector:icpSeleccionado.codigoSector,
    codigoPrograma:icpSeleccionado.codigoPrograma,
    codigoSubPrograma:icpSeleccionado.codigoSubPrograma,
    codigoProyecto:icpSeleccionado.codigoProyecto,
    codigoActividad:icpSeleccionado.codigoActividad,
    codigoOficina:icpSeleccionado.codigoOficina,
    unidadEjecutora:(icpSeleccionado.unidadEjecutora === null || icpSeleccionado.unidadEjecutora === 'undefined') ? '' : icpSeleccionado.unidadEjecutora,
    denominacion:(icpSeleccionado.denominacion === null || icpSeleccionado.denominacion === 'undefined') ? '' : icpSeleccionado.denominacion,
    descripcion:(icpSeleccionado.descripcion === null || icpSeleccionado.descripcion === 'undefined') ? '' : icpSeleccionado.descripcion,
    codigoFuncionario:icpSeleccionado.codigoFuncionario,


    codigoPresupuesto:icpSeleccionado.codigoPresupuesto,

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



  const handleChangeCodigoSector= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoSector',value.valor);
      setSector({ clave: 'CODIGO_SECTOR', valor: value.valor});
    }
  }
  const handleChangeCodigoPrograma= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoPrograma',value.valor);
      setPrograma({ clave: 'CODIGO_PROGRAMA', valor: value.vaolr });
    }
  }

  const handleChangeCodigoSubPrograma= async (e: any,value:any)=>{

    if(value!=null){

      setValue('codigoSubPrograma',value.valor);
      setSubPrograma({ clave: 'CODIGO_SUBPROGRAMA', valor: value.valor })

    }
  }
  const handleChangeCodigoProyecto= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoProyecto',value.valor);
      setProyecto({ clave: 'CODIGO_PROYECTO', valor:value.valor})
    }
  }

  const handleChangeCodigoActividad= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoActividad',value.valor);
      setActividad({ clave: 'CODIGO_ACTIVIDAD', valor: value.valor});
    }
  }
  const handleChangeCodigoOficina= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoOficina',value.valor);
      setOficina({ clave: 'CODIGO_OFICINA', valor:value.valor});
    }
  }

  const handlerPersona=async (e: any,value:any)=>{
    console.log('handlerPersona',value)
    if(value!=null){
      setValue('codigoFuncionario',value.codigoPersona);
      setPersona(value);
    }else{
      setValue('codigoFuncionario',0);
    }
  }

  const handleChangeIcpHistorico= async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoSector',value.codigoSector);
      setValue('codigoPrograma',value.codigoPrograma);
      setValue('codigoSubPrograma',value.codigoSubPrograma);
      setValue('codigoProyecto',value.codigoProyecto);
      setValue('codigoActividad',value.codigoActividad);
      setValue('codigoOficina',value.codigoOficina);

      setSector({ clave: 'CODIGO_SECTOR', valor: value.codigoSector});

      setPrograma({ clave: 'CODIGO_PROGRAMA', valor: value.codigoPrograma });

      setSubPrograma({ clave: 'CODIGO_SUBPROGRAMA', valor: value.codigoSubPrograma })
      setProyecto({ clave: 'CODIGO_PROYECTO', valor: value.codigoProyecto });
      setActividad({ clave: 'CODIGO_ACTIVIDAD', valor: value.codigoActividad } );
      setOficina({ clave: 'CODIGO_OFICINA', valor: value.codigoOficina});

    }


  }



  const handleDelete = async  () => {

    setOpen(false);
    const deleteIcp : IDeletePreIcpDto={
      codigoIcp:icpSeleccionado.codigoIcp
    }
    const responseAll= await ossmmasofApi.post<any>('/PreIndiceCategoriaProgramatica/Delete',deleteIcp);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerIcpActive(false))
      dispatch(setIcpSeleccionado({}))
    }


  };
  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateIcp:IUpdateIcp= {
      codigoIcp:icpSeleccionado.codigoIcp,
      ano:Number(data.ano),
      codigoSector:data.codigoSector,
      codigoPrograma:data.codigoPrograma,
      codigoSubPrograma:data.codigoSubPrograma,
      codigoProyecto:data.codigoProyecto,
      codigoActividad:data.codigoActividad,
      codigoOficina:data.codigoOficina,
      unidadEjecutora:(data.unidadEjecutora === null || data.unidadEjecutora === 'undefined') ? '' : data.unidadEjecutora,
      codigoPresupuesto:data.codigoPresupuesto,
      denominacion:data.denominacion,
      descripcion:data.descripcion,
      codigoFuncionario:data.codigoFuncionario,

    };



    const responseAll= await ossmmasofApi.post<any>('/PreIndiceCategoriaProgramatica/Update',updateIcp);
    console.log('responseAll',responseAll)
    if(responseAll.data.isValid){
      dispatch(setIcpSeleccionado(responseAll.data.data))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }

  return (
    <Card>
      <CardHeader title='Modificar Indice Categoria Programatica(ICP)' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* Codigo de Indice Categoria Programada(ICP) */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoIcp'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Codigo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoIcp)}
                      aria-describedby='validation-async-codigo-icp'
                      disabled
                    />
                  )}
                />
                {errors.codigoIcp && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigo-icp'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Año de Indice Categoria Programada(ICP) */}
            <Grid item  sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ano'
                  control={control}
                  rules={{ min:2000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Año'
                      onChange={onChange}
                      placeholder='Año'
                      error={Boolean(errors.ano)}
                      aria-describedby='validation-async-año'
                    />
                  )}
                />
                {errors.ano && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-año'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Denominacion de Indice Categoria Programada(ICP) */}
            <Grid item xs={8}>
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

                        options={listCodigosIcpHistorico}

                        id='autocomplete-listicphistorico'
                        isOptionEqualToValue={(option, value) => option.concat=== value.concat}
                        getOptionLabel={option => option.concat }
                        onChange={handleChangeIcpHistorico}
                        renderInput={params => <TextField {...params} label='Codigos ICP' />}
                      />

                </FormControl>
            </Grid>
             {/* Codigo Sector de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 100 }}
                        options={listSectores}
                        value={sector}
                        id='autocomplete-sectores'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoSector}
                        renderInput={params => <TextField {...params} label='Sectores' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo Programa de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 100 }}
                        options={listProgramas}

                        value={programa}
                        id='autocomplete-programas'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoPrograma}
                        renderInput={params => <TextField {...params} label='Programas' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo SubPrograma de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 100 }}
                        options={listSubProgramas}
                        value={subPrograma}
                        id='autocomplete-subprogramas'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoSubPrograma}
                        renderInput={params => <TextField {...params} label='SubProgramas' />}
                      />

                </FormControl>
            </Grid>
            {/* Codigo Proyecto de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 100 }}
                        options={listProyectos}
                        value={proyecto}
                        id='autocomplete-proyectos'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoProyecto}
                        renderInput={params => <TextField {...params} label='Proyectos' />}
                      />

                </FormControl>
            </Grid>
           {/* Codigo Actividad de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 100 }}
                        options={listActividades}
                        value={actividad}
                        id='autocomplete-proyectos'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoActividad}
                        renderInput={params => <TextField {...params} label='Actividades' />}
                      />

                </FormControl>
            </Grid>

            {/* Codigo Oficina de Indice Categoria Programada(ICP) */}

            <Grid item xs={2}>
                <FormControl fullWidth>
                  <Autocomplete
                        sx={{ width: 100 }}
                        options={listOficinas}
                        value={oficina}
                        id='autocomplete-oficinas'
                        isOptionEqualToValue={(option, value) => option.valor=== value.valor}
                        getOptionLabel={option => option.valor }
                        onChange={handleChangeCodigoOficina}
                        renderInput={params => <TextField {...params} label='Oficinas' />}
                      />

                </FormControl>
            </Grid>

            {/* Unidad Ejecutora de Indice Categoria Programada(ICP) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='unidadEjecutora'
                  control={control}
                  rules={{ maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Unidad Ejecutora'
                      onChange={onChange}
                      placeholder='Unidad Ejecutora'
                      error={Boolean(errors.unidadEjecutora)}
                      aria-describedby='validation-async-unidad-ejecutora'
                    />
                  )}
                />
                {errors.unidadEjecutora && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-unidad-ejecutora'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>



            {/* Descripcion de Indice Categoria Programada(ICP) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ required:true, maxLength: 4000 }}
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
                      value={persona}

                      options={personas}
                      id='autocomplete-persona'
                      getOptionLabel={option => option.codigoPersona + ' ' + option.nombreCompleto}
                      onChange={handlerPersona}
                      renderInput={params => <TextField {...params} label='Funcionario' />}
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
                  {"Esta Seguro de Eliminar este ICP?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminara el ICP solo si no tiene movimiento asociado
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

export default FormIcpUpdateAsync
