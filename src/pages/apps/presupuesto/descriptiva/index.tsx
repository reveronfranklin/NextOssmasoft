import { Autocomplete, Box, Card, CardActions, CardHeader, FormControl, Grid, IconButton, TextField, Tooltip} from '@mui/material'
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



import TreeViewDescriptiva from 'src/presupuesto/descriptivas/components/TreViewDescriptiva';
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto';
import {setListPreDescriptivas, setOperacionCrudPreDescriptiva, setPreDescriptivaSeleccionado, setVerPreDescriptivaActive } from 'src/store/apps/pre-descriptiva';
import DialogPreDescriptivaInfo from 'src/presupuesto/descriptivas/views/DialogPreDescriptivaInfo';
import { setListPreTitulo } from 'src/store/apps/pre-titulos';
import { IPreTitulosGetDto } from '../../../../interfaces/Presupuesto/i-pre-titulos-get-dto';

interface CellType {
  row: IPreDescriptivasGetDto
}

const PresupuestoList = () => {
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
          <Tooltip title='Add hijo'>
            <IconButton size='small' onClick={() => handleAddChild(row)}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
      )
    },
    {

      field: 'descripcionId',
      headerName: 'Id',
      width: 80

    },
    {

      field: 'descripcionIdFk',
      headerName: 'Padre',
      width: 80

    },
    {

      field: 'tituloId',
      headerName: 'TituloId',
      width: 80

    },
    {

      field: 'codigo',
      headerName: 'Codigo',
      width: 100

    },
    {

      field: 'descripcionTitulo',
      headerName: 'Titulo',
      width: 300

    },
    {

      field: 'descripcion',
      headerName: 'Descripcion',
      width: 300

    },





  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IPreDescriptivasGetDto)=>{

    console.log('Descriptiva seleccionada',row)
    dispatch(setPreDescriptivaSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreDescriptiva(2));
    dispatch(setVerPreDescriptivaActive(true))


  }

  const handleAddChild=  (row : IPreDescriptivasGetDto)=>{


    const newRow = {...row};
    newRow.descripcionId=0;
    newRow.descripcionIdFk=row.descripcionId;
    dispatch(setPreDescriptivaSeleccionado(newRow))


   // Operacion Crud 1 = Crear presupuesto
   dispatch(setOperacionCrudPreDescriptiva(1));
   dispatch(setVerPreDescriptivaActive(true))


  }

  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


      const defaultValues:IPreDescriptivasGetDto = {
        descripcionId: 0,
        descripcionIdFk:0,
        tituloId:0,
        descripcionTitulo:'',
        descripcion:'',
        codigo:'',
        extra1:'',
        extra2:'',
        extra3:'',
        listaDescriptiva:[]
      }


      dispatch(setPreDescriptivaSeleccionado(defaultValues))


    dispatch(setOperacionCrudPreDescriptiva(1));
    dispatch(setVerPreDescriptivaActive(true))


  }


  const dispatch = useDispatch();


  const {verPreDescriptivaActive=true} = useSelector((state: RootState) => state.preDescriptiva)

  const [loading, setLoading] = useState(false);

  const [descriptivasAll, setDescriptivasAll] = useState<IPreDescriptivasGetDto[]>([]);  const [viewTable, setViewTable] = useState(false);

  const [descriptivas, setDescriptivas] = useState<IPreDescriptivasGetDto[]>([]);
  const [titulos, setTitulos] =useState<IPreTitulosGetDto[]> ([]);
  const [titulo] = useState<IPreTitulosGetDto> ();
  const handleViewTree=()=>{
    setViewTable(false);

  }
  const handleViewTable=()=>{
    setViewTable(true);

  }

  const handleChangeTitulo= async (e: any,value:any)=>{

    if(value!=null){

      const data = descriptivasAll.filter((elemento)=>{
        return elemento.tituloId==value.tituloId
      });

      setDescriptivas(data)

    }else{
      setDescriptivas(descriptivasAll)
    }

  }
  useEffect(() => {

    const getData = async () => {
      setLoading(true);


      const responseAll= await ossmmasofApi.get<any>('/PreDescriptivas/GetAll');
      const data = responseAll.data.data;
      dispatch(setListPreDescriptivas(data));
      const responseAllTitulos= await ossmmasofApi.get<any>('/PreTitulos/GetAll');
      const dataTitulos = responseAllTitulos.data.data;
      dispatch(setListPreTitulo(dataTitulos))
      setTitulos(dataTitulos);
      setDescriptivas(data);
      setDescriptivasAll(data)


      setLoading(false);
    };

    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreDescriptivaActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Maestro de Descriptivas' />

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
              ?
              <Box sx={{ height: 500 }}>
                <TreeViewDescriptiva></TreeViewDescriptiva>

            </Box>

              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>

                <FormControl fullWidth>
                  <Autocomplete

                        options={titulos}
                        value={titulo}
                        id='autocomplete-titulo'
                        isOptionEqualToValue={(option, value) => option.tituloId=== value.tituloId}
                        getOptionLabel={option => option.tituloId + '-' + option.titulo }
                        onChange={handleChangeTitulo}
                        renderInput={params => <TextField {...params} label='Titulos' />}
                      />

                </FormControl>

                  <DataGrid
                    getRowId={(row) => row.descripcionId}

                    columns={columns}
                    rows={descriptivas}
                    onRowDoubleClick={(row) => handleDoubleClick(row)}

                    />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogPreDescriptivaInfo/>
        </DatePickerWrapper>
    </Grid>


  )
}

export default PresupuestoList
