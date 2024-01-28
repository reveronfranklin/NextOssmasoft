import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import { IRhConceptosAcumulaResponseDto } from 'src/interfaces/rh/ConceptosAcumula/RhConceptosAcumulaResponseDto';
import { setListRhTipoAcumulado, setOperacionCrudRhConceptosAcumulado, setRhConceptosAcumuladoSeleccionado, setVerRhConceptosAcumuladoActive } from 'src/store/apps/rh-conceptos-acumulado';
import DialogRhConceptoAcumuladoInfo from './DialogRhConceptoAcumuladoInfo';

//import { IFechaDto } from 'src/interfaces/fecha-dto';
//import { monthByIndex } from 'src/utilities/ge-date-by-object';

interface CellType {
  row: IRhConceptosAcumulaResponseDto
}

const ConceptosAcumuladoList = () => {
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
      field: 'codigoConceptoAcumula',
      minWidth: 80,
      headerName: '# ID',
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'TipoAcumuladoDescripcion',
      headerName: 'Tipo Acumulado',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.tipoAcumuladoDescripcion}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'CodigoConceptoAsociadoDescripcion',
      headerName: 'Concepto Asociado',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoConceptoAsociadoDescripcion}</Typography>
    },

    {
      with:100,
      headerName: 'Desde',
      field: 'fechaDesdeObj',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
           {params.row.fechaDesdeObj.day }-{params.row.fechaDesdeObj.month }-{params.row.fechaDesdeObj.year }

        </Typography>
      )
    },
    {
      with:100,
      headerName: 'Hasta',
      field: 'fechaHasta',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
           { params.row.fechaHastaObj
              ? params.row.fechaDesdeObj.day + '-'+ params.row.fechaDesdeObj.month +'-' + params.row.fechaDesdeObj.year

                :''
              }

        </Typography>
      )
    },





  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhConceptosAcumulaResponseDto)=>{

    console.log(row)
    dispatch(setRhConceptosAcumuladoSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhConceptosAcumulado(2));
    dispatch(setVerRhConceptosAcumuladoActive(true))


  }



  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


    const defaultValues:IRhConceptosAcumulaResponseDto = {

      codigoConceptoAcumula :0,
      codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
      tipoAcumuladoId:0,
      tipoAcumuladoDescripcion:'',
      codigoConceptoAsociado:0,
      codigoConceptoAsociadoDescripcion:'',
      fechaDesdeString:'',
      fechaDesdeObj:null,
      fechaHastaString :'',
      fechaHastaObj :null,

    }


      dispatch(setRhConceptosAcumuladoSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhConceptosAcumulado(1));
      dispatch(setVerRhConceptosAcumuladoActive(true))


  }


  const dispatch = useDispatch();



  const {verRhConceptosAcumulaActive=false} = useSelector((state: RootState) => state.rhConceptosAcumulado)
  const {rhConceptosSeleccionado} = useSelector((state: RootState) => state.rhConceptos)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhConceptosAcumulaResponseDto[]>([])

  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);


      if(rhConceptosSeleccionado.codigoConcepto>0){
        const filterTipoAcumulado={descripcionId:0,tituloId:36}
      const responseTipoAcumulado= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoAcumulado);
      dispatch(setListRhTipoAcumulado(responseTipoAcumulado.data))


        const filter={codigoConcepto:rhConceptosSeleccionado.codigoConcepto}
        const responseAll= await ossmmasofApi.post<any>('/RhConceptoAcumulado/GetAllByConcepto',filter);

        setData(responseAll.data.data);

      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhConceptosAcumulaActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Acumulados' />

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
                  getRowId={(row) => row.codigoConceptoAcumula }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhConceptoAcumuladoInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ConceptosAcumuladoList
