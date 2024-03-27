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

import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto';
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora';
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc';
import { IPreAsignacionesFilterDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesFilterDto';
import { IPreAsignacionesGetDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesGetDto';
import { setOperacionCrudPreAsignaciones, setPreAsignacionesSeleccionado, setVerPreAsignacionesActive } from 'src/store/apps/pre-asignaciones';
import DialogPreAsignacionesInfo from './DialogPreAsignacionesInfo';

//import { IFechaDto } from 'src/interfaces/fecha-dto';
//import { monthByIndex } from 'src/utilities/ge-date-by-object';

interface CellType {
  row: IPreAsignacionesGetDto
}

const AsignacionesList = () => {
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
      flex: 0.05,
      field: 'codigoAsignacion',
      minWidth: 80,
      headerName: '# ID',
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'codigoPucConcat',
      headerName: 'PUC',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoPucConcat}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 180,
      field: 'denominacionPuc',
      headerName: 'Denominacion',


      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.denominacionPuc}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'presupuestado',
      headerName: 'Presupuestado',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.presupuestado}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'ordinario',
      headerName: 'Ordinario',
      editable: true,
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.ordinario}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'laee',
      headerName: 'LAEE',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.laee}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'fides',
      headerName: 'FIDES',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.fides}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'total',
      headerName: 'Total',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.total}</Typography>
    },







  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IPreAsignacionesGetDto)=>{

    console.log(row)
    dispatch(setPreAsignacionesSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreAsignaciones(2));
    dispatch(setVerPreAsignacionesActive(true))


  }



  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


    const defaultValues:IPreAsignacionesGetDto = {

      codigoAsignacion :0,
      codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      año :listpresupuestoDtoSeleccionado.ano,
      escenario:0,
      codigoIcp:0,
      codigoIcpConcat:'',
      DenominacionIcp:'',
      codigoPuc:0,
      codigoPucConcat:'',
      denominacionPuc:'',
      presupuestado:0,
      ordinario:0,
      coordinado:0,
      laee:0,
      fides:0,
      total:0,
      totalDesembolso:0,
      searchText:''

    }


      dispatch(setPreAsignacionesSeleccionado(defaultValues));
      dispatch(setOperacionCrudPreAsignaciones(1));
      dispatch(setVerPreAsignacionesActive(true))


  }


  const dispatch = useDispatch();


  const {preMtrDenominacionPucSeleccionado={} as IListPreMtrDenominacionPuc,
  preMtrUnidadEjecutoraSeleccionado={} as IListPreMtrUnidadEjecutora,
  listpresupuestoDtoSeleccionado={} as IListPresupuestoDto} =
  useSelector((state: RootState) => state.presupuesto)

  const {verPreAsignacionesActive=false} = useSelector((state: RootState) => state.preAsignaciones)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IPreAsignacionesGetDto[]>([])

  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);


      if(listpresupuestoDtoSeleccionado.codigoPresupuesto>0){


        const filter:IPreAsignacionesFilterDto={
          codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
          codigoIcp:preMtrUnidadEjecutoraSeleccionado.codigoIcp,
          codigoPuc:preMtrDenominacionPucSeleccionado.codigoPuc,
          codigoAsignacion:0
        }
        const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/GetAll',filter);
        console.log(responseAll.data)
        if(responseAll.data.data && responseAll.data.data.length>0){
          setData(responseAll.data.data);
        }else{
          setData([]);
        }


      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreAsignacionesActive,listpresupuestoDtoSeleccionado,preMtrUnidadEjecutoraSeleccionado,preMtrDenominacionPucSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Creditos Presupuestarios' />

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
                  getRowId={(row) => row.codigoAsignacion }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogPreAsignacionesInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default AsignacionesList
