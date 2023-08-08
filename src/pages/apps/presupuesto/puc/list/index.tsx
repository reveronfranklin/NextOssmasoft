import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';

//import { useTheme } from '@mui/material/styles'

//import { usePresupuesto } from 'src/hooks/usePresupuesto';


import { useDispatch } from 'react-redux';


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto';
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto';
import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto';

import { IFilterClave } from 'src/interfaces/SIS/i-filter-clave';

import { setListCodigosPucHistorico, setListGrupos, setListNivel1, setListNivel2, setListNivel3, setListNivel4, setListNivel5, setListNivel6, setListPuc, setOperacionCrudPuc, setPucSeleccionado, setVerPucActive } from 'src/store/apps/PUC';
import { IPrePlanUnicoCuentasGetDto } from 'src/interfaces/Presupuesto/i-pre-plan-unico-cuentas-get-dto';
import DialogPrePucInfo from 'src/presupuesto/Puc/views/DialogPrePucInfo';
import TreeViewPuc from 'src/presupuesto/Puc/components/TreViewPuc';

interface CellType {
  row: IPrePlanUnicoCuentasGetDto
}

const PresupuestoList = () => {
  //const theme = useTheme()
  //const { direction } = theme
  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const columns = [

    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Add hijo'>
            <IconButton size='small' onClick={() => handleAddChild(row)}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
      )
    },
    {

      field: 'codigoPuc',
      headerName: 'Codigo',
      width: 80

    },

    {

      field: 'codigoPucConcat',
      headerName: 'Puc',
      width: 300

    },


    {

      field: 'denominacion',
      headerName: 'Denominacion',
      width: 400

    },
    {

      field: 'descripcion',
      headerName: 'Descripcion',
      width: 400
    },




  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IPrePlanUnicoCuentasGetDto)=>{

    console.log(row)
    dispatch(setPucSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPuc(2));
    dispatch(setVerPucActive(true))


  }

  const handleAddChild=  (row : IPrePlanUnicoCuentasGetDto)=>{


    const newRow = {...row};
    newRow.codigoPuc=0;
    dispatch(setPucSeleccionado(newRow))


   // Operacion Crud 1 = Crear presupuesto
   dispatch(setOperacionCrudPuc(1));
   dispatch(setVerPucActive(true))


  }

  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


      const defaultValues:IPrePlanUnicoCuentasGetDto = {
        codigoPuc: 0,
        codigoGrupo:'0',
        codigoNivel1:'00',
        codigoNivel2:'00',
        codigoNivel3:'00',
        codigoNivel4:'00',
        codigoNivel5:'00',
        codigoNivel6:'',
        denominacion:'',
        descripcion:'',
        codigoPucPadre:0,
        codigoPucConcat:'',
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      }


      dispatch(setPucSeleccionado(defaultValues))


    dispatch(setOperacionCrudPuc(1));
    dispatch(setVerPucActive(true))


  }


  const dispatch = useDispatch();


  const {verPucActive=false} = useSelector((state: RootState) => state.puc)
  const {listpresupuestoDtoSeleccionado,listpresupuestoDto} = useSelector((state: RootState) => state.presupuesto)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);

  const [puc, setPuc] = useState([]);
  const handleViewTree=()=>{
    setViewTable(false);

  }
  const handleViewTable=()=>{
    setViewTable(true);

  }
  useEffect(() => {

    const getPuc = async (filter:FilterByPresupuestoDto) => {
      setLoading(true);


      const responseAll= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/GetAllFilter',filter);
      const data = responseAll.data.data;

      dispatch(setListPuc(data));

      setPuc(data);


      const filterGrupos:IFilterClave={
        clave:'CODIGO_GRUPO'
      }
      const responseGrupos= await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterGrupos);
      dispatch(setListGrupos(responseGrupos.data.data));

      const filterNivel1:IFilterClave={
        clave:'CODIGO_NIVEL1'
      }
      const responseNivel1= await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterNivel1);
      dispatch(setListNivel1(responseNivel1.data.data));

      const filterNivel2:IFilterClave={
        clave:'CODIGO_NIVEL2'
      }
      const responseNivel2= await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterNivel2);
      dispatch(setListNivel2(responseNivel2.data.data));

      const filterNivel3:IFilterClave={
        clave:'CODIGO_NIVEL3'
      }
      const responseNivel3= await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterNivel3);
      dispatch(setListNivel3(responseNivel3.data.data));

      const filterNivel4:IFilterClave={
        clave:'CODIGO_NIVEL4'
      }
      const responseNivel4 =await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterNivel4);
      dispatch(setListNivel4(responseNivel4.data.data));

      const filterNivel5:IFilterClave={
        clave:'CODIGO_NIVEL5'
      }
      const responseNivel5 =await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterNivel5);
      dispatch(setListNivel5(responseNivel5.data.data));

      const filterNivel6:IFilterClave={
        clave:'CODIGO_NIVEL6'
      }
      const responseNivel6 =await ossmmasofApi.post<any>('/OssConfig/GetListByClave',filterNivel6);
      dispatch(setListNivel6(responseNivel6.data.data));



      const responseCodigosPucHistorico =await ossmmasofApi.get<any>('/PrePlanUnicoCuentas/ListCodigosHistoricoPuc');
      dispatch(setListCodigosPucHistorico(responseCodigosPucHistorico.data.data))


      setLoading(false);
    };



    const filter:FilterByPresupuestoDto={
      codigoPresupuesto:0
    }

    if(listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto!=null){
      filter.codigoPresupuesto=listpresupuestoDtoSeleccionado.codigoPresupuesto;
    }else{
      filter.codigoPresupuesto==listpresupuestoDto[0].codigoPresupuesto;
      dispatch(setListpresupuestoDtoSeleccionado(listpresupuestoDto[0]));
    }
     getPuc(filter);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPucActive, listpresupuestoDtoSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Maestro Plan Unico de Cuentas' />
        <FilterOnlyPresupuesto/>
        <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Arbol'>
            <IconButton size='small'  color='primary' onClick={() => handleViewTable()}>
            <Icon icon='grommet-icons:tree' fontSize={20} />
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
              ?  <TreeViewPuc></TreeViewPuc>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoPuc + row.codigoPucConcat}

                  columns={columns}
                  rows={puc}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogPrePucInfo/>
        </DatePickerWrapper>
    </Grid>


  )
}

export default PresupuestoList
