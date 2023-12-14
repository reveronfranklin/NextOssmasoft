import { Box, Card, CardActions, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { IFechaDto } from 'src/interfaces/fecha-dto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import DialogRhEducacionInfo from './DialogRhEducacionInfo';
import { IRhEducacionResponseDto } from 'src/interfaces/rh/RhEducacionResponseDto';
import { setListRhMencionEspecialidad, setListRhNivel, setListRhProfesion, setListRhTitulo, setOperacionCrudRhEducacion, setRhEducacionSeleccionado, setVerRhEducacionActive } from 'src/store/apps/rh-educacion';
import { monthByIndex } from 'src/utilities/ge-date-by-object';

interface CellType {
  row: IRhEducacionResponseDto
}

const EducacionList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

  const columns = [


    {
      flex: 0.1,
      field: 'codigoEducacion',
      minWidth: 40,
      headerName: '# ID',
    },

    {
      flex: 0.3,
      minWidth: 150,
      field: 'nombreInstituto',
      headerName: 'Instituto',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.nombreInstituto.toString()}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 125,
      field: 'localidadInstituto',
      headerName: 'Localidad',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.localidadInstituto}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 125,
      field: 'descripcionNivel',
      headerName: 'Nivel',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionNivel}</Typography>
    },



  ]

  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhEducacionResponseDto)=>{

   if(personaSeleccionado && personaSeleccionado.codigoPersona>0){

      dispatch(setRhEducacionSeleccionado(row))

        // Operacion Crud 2 = Modificar presupuesto
      dispatch(setOperacionCrudRhEducacion(2));
      dispatch(setVerRhEducacionActive(true))
   }

  }



  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }

  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto
    if(personaSeleccionado && personaSeleccionado.codigoPersona<=0){
        return;
    }

      const defaultValues:IRhEducacionResponseDto = {

        codigoEducacion :0,
        codigoPersona :personaSeleccionado.codigoPersona,
        nivelId:0,
        descripcionNivel:'',
        nombreInstituto :'',
        localidadInstituto :'',
        profesionID:0,
        fechaIni :fechaActual,
        fechaIniString :defaultDateString,
        fechaFin :fechaActual,
        fechaFinString :defaultDateString,
        fechaIniObj:defaultDate,
        fechaFinObj:defaultDate,
        ultimoAñoAprobado:0,
        graduado :'',
        tituloId :0,
        mencionEspecialidadId:0


      }


      dispatch(setRhEducacionSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhEducacion(1));
      dispatch(setVerRhEducacionActive(true))


  }


  const dispatch = useDispatch();


  const {verRhEducacionActive=false} = useSelector((state: RootState) => state.rhEducacion)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhEducacionResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)

  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      if(personaSeleccionado.codigoPersona>0){
        const filterNivel={descripcionId:0,tituloId:5}
        const responseNivel= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterNivel);
        dispatch(setListRhNivel(responseNivel.data))
        console.log(responseNivel.data)

        const filterProfesion={descripcionId:0,tituloId:8}
        const responseProfesion= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterProfesion);
        dispatch(setListRhProfesion(responseProfesion.data))
        console.log(responseProfesion.data)
        const filterTitulo={descripcionId:0,tituloId:16}
        const responseTitulo= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTitulo);
        dispatch(setListRhTitulo(responseTitulo.data))
        console.log(responseTitulo.data)
        const filterMencion={descripcionId:0,tituloId:25}
        const responseMencion= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterMencion);
        dispatch(setListRhMencionEspecialidad(responseMencion.data))
        console.log(responseMencion.data)

        const filter={codigoPersona:personaSeleccionado.codigoPersona}
        const responseAll= await ossmmasofApi.post<any>('/RhEducacion/GetByPersona',filter);
        console.log(responseAll.data)
        setData(responseAll.data);
      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhEducacionActive, personaSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>


        <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Tabla'>
            <IconButton size='small'  color='primary' onClick={() => handleViewTree()}>
            <Icon icon='fluent:table-24-regular' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>


        </CardActions>


              {viewTable
              ?  <div></div>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoEducacion }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhEducacionInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default EducacionList
