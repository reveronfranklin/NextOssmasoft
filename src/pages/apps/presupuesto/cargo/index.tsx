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
import { IPreCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-cargos-get-dto';
import { IFilterPreTituloDto } from 'src/interfaces/Presupuesto/i-filter-pre-titulo-dto';
import { setListPreCargos, setListTipoCargo, setListTipoPersonal, setOperacionCrudPreCargo, setPreCargoSeleccionado, setVerPreCargoActive } from 'src/store/apps/pre-cargo';
import DialogPreCargoInfo from 'src/presupuesto/cargo/views/DialogPreCargoInfo';

interface CellType {
  row: IPreCargosGetDto
}

const CargoList = () => {
  //const theme = useTheme()
  //const { direction } = theme
  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const columns = [

    {

      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Ver'>
            <IconButton size='small' onClick={() => handleAddChild(row)}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
      )
    },
    {

      field: 'codigoCargo',
      headerName: 'Codigo',
      width: 80

    },

    {

      field: 'descripcionTipoPersonal',
      headerName: 'Tipo Personal',
      width: 300

    },

    {

      field: 'descripcionTipoCargo',
      headerName: 'Tipo Cargo',
      width: 400

    },
    {

      field: 'denominacion',
      headerName: 'Denominacion',
      width: 400

    },
    {

      field: 'descripcion',
      headerName: 'descripcion',
      width: 100

    },




  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IPreCargosGetDto)=>{

    console.log(row)
    dispatch(setPreCargoSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreCargo(2));
    dispatch(setVerPreCargoActive(true))


  }

  const handleAddChild=  (row : IPreCargosGetDto)=>{


    const newRow = {...row};
    newRow.codigoCargo=0;
    dispatch(setPreCargoSeleccionado(newRow))


   // Operacion Crud 1 = Crear presupuesto
   dispatch(setOperacionCrudPreCargo(1));
   dispatch(setVerPreCargoActive(true))


  }

  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


      const defaultValues:IPreCargosGetDto = {
        codigoCargo: 0,
        tipoPersonalId:0,
        descripcionTipoPersonal:'',
        tipoCargoId:0,
        descripcionTipoCargo:'',
        denominacion:'',
        descripcion:'',
        grado:0,
        extra1:'',
        extra2:'',
        extra3:'',
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      }


      dispatch(setPreCargoSeleccionado(defaultValues))


    dispatch(setOperacionCrudPreCargo(1));
    dispatch(setVerPreCargoActive(true))


  }


  const dispatch = useDispatch();


  const {verPreCargoActive=false} = useSelector((state: RootState) => state.preCargo)
  const {listpresupuestoDtoSeleccionado,listpresupuestoDto} = useSelector((state: RootState) => state.presupuesto)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);

  const [cargos, setCargos] = useState([]);
  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getCargo = async (filter:FilterByPresupuestoDto) => {
      setLoading(true);


      const responseAll= await ossmmasofApi.post<any>('/PreCargos/GetAllByPresupuesto',filter);
      const data = responseAll.data.data;

      dispatch(setListPreCargos(data));

      setCargos(data);


      const filterTipoPersonal:IFilterPreTituloDto={
        tituloId:1
      }
      const responseTipoPersonal= await ossmmasofApi.post<any>('/PreDescriptivas/GetAllByTitulo',filterTipoPersonal);
      dispatch(setListTipoPersonal(responseTipoPersonal.data.data));

      const filterTipoCargo:IFilterPreTituloDto={
        tituloId:2
      }
      const responseTipoCargo= await ossmmasofApi.post<any>('/PreDescriptivas/GetAllByTitulo',filterTipoCargo);
      dispatch(setListTipoCargo(responseTipoCargo.data.data));

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
    getCargo(filter);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreCargoActive, listpresupuestoDtoSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Maestro Cargos' />
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
                  getRowId={(row) => row.codigoCargo + row.denominacion}

                  columns={columns}
                  rows={cargos}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogPreCargoInfo/>
        </DatePickerWrapper>
    </Grid>


  )
}

export default CargoList
