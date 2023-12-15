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
import { monthByIndex } from 'src/utilities/ge-date-by-object';
import DialogRhExperienciaInfo from './DialogRhExperienciaInfo';
import { IRhExpLaboralResponseDto } from 'src/interfaces/rh/RhExpLaboralResponseDto';
import { setOperacionCrudRhExperiencia, setRhExperienciaSeleccionado, setVerRhExperienciaActive } from 'src/store/apps/rh-experiencia';

interface CellType {
  row: IRhExpLaboralResponseDto
}

const ExperienciaList = () => {
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
      field: 'codigoExpLaboral',
      minWidth: 40,
      headerName: '# ID',
    },

    {
      flex: 0.3,
      minWidth: 150,
      field: 'nombreEmpresa',
      headerName: 'Institucion',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.nombreEmpresa.toString()}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 15,
      field: 'tipoEmpresa',
      headerName: 'Tipo',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.tipoEmpresa}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 125,
      field: 'cargo',
      headerName: 'Cargo',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.cargo}</Typography>
    },



  ]

  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhExpLaboralResponseDto)=>{

   if(personaSeleccionado && personaSeleccionado.codigoPersona>0){

      dispatch(setRhExperienciaSeleccionado(row))

        // Operacion Crud 2 = Modificar presupuesto
      dispatch(setOperacionCrudRhExperiencia(2));
      dispatch(setVerRhExperienciaActive(true))
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

      const defaultValues:IRhExpLaboralResponseDto = {

          codigoExpLaboral:0,
          codigoPersona :personaSeleccionado.codigoPersona,
          nombreEmpresa :'',
          tipoEmpresa :'',
          ramoId :0,
          cargo:'',
          fechaDesde :fechaActual,
          fechaDesdeString :defaultDateString,
          fechaHasta :fechaActual,
          fechaHastaString :defaultDateString,
          fechaDesdeObj:defaultDate,
          fechaHastaObj:defaultDate,
          ultimoSueldo:0,
          supervisor :'',
          cargoSupervisor  :'',
          telefono: '',
          descripcion  :''


      }


      dispatch(setRhExperienciaSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhExperiencia(1));
      dispatch(setVerRhExperienciaActive(true))


  }


  const dispatch = useDispatch();


  const {verRhExperienciaActive=false} = useSelector((state: RootState) => state.rhExperiencia)
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IRhExpLaboralResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)



  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      if(personaSeleccionado.codigoPersona>0){

        const filter={codigoPersona:personaSeleccionado.codigoPersona}
        const responseAll= await ossmmasofApi.post<any>('/RhExpLaboral/GetByPersona',filter);
        console.log(responseAll.data)
        setData(responseAll.data);
      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhExperienciaActive, personaSeleccionado]);




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




        </CardActions>


               { loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoExpLaboral }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhExperienciaInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ExperienciaList
