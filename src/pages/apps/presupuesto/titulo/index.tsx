import { Box, Card, CardActions, CardHeader,  Grid, IconButton, Tooltip} from '@mui/material'
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




import { setListPreTitulo, setOperacionCrudPreTitulo, setPreTituloSeleccionado, setVerPreTituloActive } from 'src/store/apps/pre-titulos';
import { IPreTitulosGetDto } from '../../../../interfaces/Presupuesto/i-pre-titulos-get-dto';
import DialogPreTituloInfo from 'src/presupuesto/titulos/views/DialogPreTituloInfo';
import TreeViewTitulo from 'src/presupuesto/titulos/components/TreViewTitulo';

interface CellType {
  row: IPreTitulosGetDto
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

      field: 'tituloId',
      headerName: 'Id',
      width: 80

    },
    {

      field: 'tituloIdFk',
      headerName: 'Padre',
      width: 80

    },
    {

      field: 'titulo',
      headerName: 'Titulo',
      width: 500

    },
    {

      field: 'codigo',
      headerName: 'Codigo',
      width: 100

    },






  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IPreTitulosGetDto)=>{

    console.log('Descriptiva seleccionada',row)
    dispatch(setPreTituloSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreTitulo(2));
    dispatch(setVerPreTituloActive(true))


  }

  const handleAddChild=  (row : IPreTitulosGetDto)=>{


    const newRow = {...row};
    newRow.tituloId=0;
    newRow.tituloIdFk=row.tituloId;
    dispatch(setPreTituloSeleccionado(newRow))


   // Operacion Crud 1 = Crear presupuesto
   dispatch(setOperacionCrudPreTitulo(1));
   dispatch(setVerPreTituloActive(true))


  }

  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


      const defaultValues:IPreTitulosGetDto = {
        tituloId: 0,
        tituloIdFk:0,
        titulo:'',
        codigo:'',
        extra1:'',
        extra2:'',
        extra3:'',

      }


      dispatch(setPreTituloSeleccionado(defaultValues))
      dispatch(setOperacionCrudPreTitulo(1));
      dispatch(setVerPreTituloActive(true))


  }


  const dispatch = useDispatch();


  const {verPreTituloActive=true} = useSelector((state: RootState) => state.preTitulo)

  const [loading, setLoading] = useState(false);


  const [viewTable, setViewTable] = useState(false);


  const [titulos, setTitulos] =useState<IPreTitulosGetDto[]> ([]);

  const handleViewTree=()=>{
    setViewTable(false);

  }
  const handleViewTable=()=>{
    setViewTable(true);

  }


  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      const responseAllTitulos= await ossmmasofApi.get<any>('/PreTitulos/GetAll');
      const dataTitulos = responseAllTitulos.data.data;
      dispatch(setListPreTitulo(dataTitulos))
      setTitulos(dataTitulos);



      setLoading(false);
    };

    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreTituloActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Maestro de Titulos' />

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
                <TreeViewTitulo></TreeViewTitulo>

            </Box>

              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>



                  <DataGrid
                    getRowId={(row) => row.tituloId}

                    columns={columns}
                    rows={titulos}
                    onRowDoubleClick={(row) => handleDoubleClick(row)}

                    />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogPreTituloInfo/>
        </DatePickerWrapper>
    </Grid>


  )
}

export default PresupuestoList
