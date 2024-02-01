import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip, Typography} from '@mui/material'
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

import DialogRhConceptoPUCInfo from './DialogRhConceptoPUCInfo';
import { IRhConceptosPUCResponseDto } from 'src/interfaces/rh/ConceptosPUC/RhConceptosPUCResponseDto';
import { setOperacionCrudRhConceptosPUC, setRhConceptosPUCSeleccionado, setVerRhConceptosPUCActive } from 'src/store/apps/rh-conceptos-PUC';
import { fetchDataListPresupuestoDto } from 'src/store/apps/presupuesto/thunks';


//import { IFechaDto } from 'src/interfaces/fecha-dto';
//import { monthByIndex } from 'src/utilities/ge-date-by-object';

interface CellType {
  row: IRhConceptosPUCResponseDto
}

const ConceptosPUCList = () => {
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
  const defaultDateString = fechaActual.toISOString();
 */

  const columns = [

    {
      flex: 0.1,
      field: 'codigoConceptoPUC',
      minWidth: 80,
      headerName: '# ID',
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'presupuestoDescripcion',
      headerName: 'Presupuesto',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.presupuestoDescripcion}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'codigoPUCConcat',
      headerName: 'PUC',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoPUCConcat}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'codigoPUCDenominacion',
      headerName: 'Denominacion',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoPUCDenominacion}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'descripcionStatus',
      headerName: 'Estatus',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionStatus}</Typography>
    },






  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhConceptosPUCResponseDto)=>{


    dispatch(setRhConceptosPUCSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhConceptosPUC(2));
    dispatch(setVerRhConceptosPUCActive(true))


  }



  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }

  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


    const defaultValues:IRhConceptosPUCResponseDto = {

      codigoConceptoPUC :0,
      codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
      codigoPUC :0,
      codigoPUCConcat:'',
      codigoPUCDenominacion:'',
      codigoPresupuesto:0,
      presupuestoDescripcion :'',
      status :0,
      descripcionStatus:''

    }


      dispatch(setRhConceptosPUCSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhConceptosPUC(1));
      dispatch(setVerRhConceptosPUCActive(true))


  }


  const dispatch = useDispatch();



  const {verRhConceptosPUCActive=false} = useSelector((state: RootState) => state.rhConceptosPUC)
  const {rhConceptosSeleccionado} = useSelector((state: RootState) => state.rhConceptos)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhConceptosPUCResponseDto[]>([])

  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/






  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      await fetchDataListPresupuestoDto(dispatch);
      if(rhConceptosSeleccionado.codigoConcepto>0){

        const filter={codigoConcepto:rhConceptosSeleccionado.codigoConcepto}
        const responseAll= await ossmmasofApi.post<any>('/RhConceptoPUC/GetAllByConcepto',filter);

        setData(responseAll.data.data);

      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhConceptosPUCActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='P U C' />

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

             {/*  {
                loading
                ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                  <DataGrid

                  getRowId={(row) => row.codigoIcp}
                  columns={columns}
                  rows={icp} />


                </Box>


              } */}
              {viewTable
              ?  <div></div>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoConceptoPUC }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhConceptoPUCInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ConceptosPUCList
