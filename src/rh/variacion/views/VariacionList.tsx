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

import DialogRhVariacionInfo from './DialogRhVariacionInfo';
import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto';
import { setOperacionCrudRhPersonaMovCtr, setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl';

interface CellType {
  row: IRhPersonasMovControlResponseDto
}

const VariacionList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


/*   const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString(); */

  const columns = [


    {
      flex: 0.1,
      field: 'codigoPersonaMovCtrl',
      minWidth: 40,
      headerName: '# ID',
    },

    {
      flex: 0.3,
      minWidth: 150,
      field: 'descripcionConcepto',
      headerName: 'Concepto',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionConcepto.toString()}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 20,
      field: 'descripcionControlAplica',
      headerName: 'Aplica',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionControlAplica}</Typography>
    },




  ]

  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhPersonasMovControlResponseDto)=>{

   if(personaSeleccionado && personaSeleccionado.codigoPersona>0){

      dispatch(setRhPersonaMovCtrSeleccionado(row))

        // Operacion Crud 2 = Modificar presupuesto
      dispatch(setOperacionCrudRhPersonaMovCtr(2));
      dispatch(setVerRhPersonaMovCtrActive(true))
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

      const defaultValues:IRhPersonasMovControlResponseDto = {

          codigoPersonaMovCtrl:0,
          codigoPersona :personaSeleccionado.codigoPersona,
          codigoConcepto :0,
          controlAplica :0,
          descripcionControlAplica:'',
          descripcionConcepto:''

      }


      dispatch(setRhPersonaMovCtrSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhPersonaMovCtr(1));
      dispatch(setVerRhPersonaMovCtrActive(true))


  }


  const dispatch = useDispatch();


  const {verRhPersonaMovCtrActive=false} = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IRhPersonasMovControlResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)



  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      if(personaSeleccionado.codigoPersona>0){

        const filter={codigoPersona:personaSeleccionado.codigoPersona}
        const responseAll= await ossmmasofApi.post<any>('/RhPersonasMovControl/GetByPersona',filter);
        console.log(responseAll.data)
        setData(responseAll.data);
      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhPersonaMovCtrActive, personaSeleccionado]);




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
                  getRowId={(row) => row.codigoPersonaMovCtrl }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhVariacionInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default VariacionList
