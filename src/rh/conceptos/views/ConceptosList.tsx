import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip} from '@mui/material'
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


import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';

import DialogRhConceptosInfo from './DialogRhConceptosInfo';
import { IRhConceptosResponseDto } from 'src/interfaces/rh/Conceptos/RhConceptosResponseDto';
import { setListOssModeloCalculo, setListRhConceptos, setListRhFrecuencia, setListRhModulo, setOperacionCrudRhConceptos, setRhConceptosSeleccionado, setVerRhConceptosActive } from 'src/store/apps/rh-conceptos';
import { setListPuc } from 'src/store/apps/PUC';
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto';


const ConceptosList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const columns = [


    {

      field: 'codigoConcepto'
      , headerName: 'Id',
       width: 130

    },
    {

      field: 'codigo'
      , headerName: 'Codigo',
      width: 130

    },
    {

      field: 'denominacion',
      headerName: 'Denominacion',
      width: 430
    },
    {

      field: 'codigoTipoNomina'
      , headerName: 'Codigo TN',
      width: 130

    },
    {

      field: 'tipoNominaDescripcion',
      headerName: 'Tipo Nomina',
      width: 330
    },





  ]


  const handleView=  (row : IRhConceptosResponseDto)=>{

    dispatch(setRhConceptosSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhConceptos(2));
    dispatch(setVerRhConceptosActive(true))


  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
  const handleAdd=  ()=>{


    const defaultValues = {


      codigo :'',
      codigoTipoNomina:0,
      denominacion:'',
      descripcion :'',
      tipoConcepto:'',
      moduloId :0,
      codigoPuc:0,
      status :'',
      frecuenciaId :0,
      dedusible :0,
      automatico :0

    }


    dispatch(setRhConceptosSeleccionado(defaultValues));

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudRhConceptos(1));
    dispatch(setVerRhConceptosActive(true))


  }
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhConceptosResponseDto[]>([])

  const {verRhConceptosActive=false} = useSelector((state: RootState) => state.rhConceptos)
  const {rhTipoNominaSeleccionado} = useSelector((state: RootState) => state.rhTipoNomina)



  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);


      const filterPre:FilterByPresupuestoDto={
        codigoPresupuesto:0
      }
      const responseAllPUC= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/GetAllFilter',filterPre);
      const dataPUC = responseAllPUC.data.data;

      dispatch(setListPuc(dataPUC));

      const responseAllModelo= await ossmmasofApi.get<any>('/OssModeloCalculo/GetAll');
      const dataModelo = responseAllModelo.data.data;

      dispatch(setListOssModeloCalculo(dataModelo));


      const filterFrecuencia={descripcionId:0,tituloId:49}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterFrecuencia);
      dispatch(setListRhFrecuencia(responseTipoCuenta.data))

      const filterModulo={descripcionId:0,tituloId:51}
      const responseModulo= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterModulo);
      dispatch(setListRhModulo(responseModulo.data))


      const filter={codigoTipoNomina:rhTipoNominaSeleccionado.codigoTipoNomina,tipoNomina:''}
      const responseAll= await ossmmasofApi.post<any>('/RhConceptos/GetByTipoNomina',filter);
      const data = responseAll.data;
      setData(responseAll.data);
      dispatch(setListRhConceptos(data));


      setLoading(false);
    };

    getData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhConceptosActive,rhTipoNominaSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Conceptos' />

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
                  getRowId={(row) => row.codigoConcepto }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhConceptosInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ConceptosList
