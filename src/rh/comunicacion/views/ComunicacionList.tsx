import { Box, Card, CardActions, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
//import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';

//import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';




import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import { IRhComunicacionResponseDto } from 'src/interfaces/rh/RhComunicacionResponseDto';
import { setListRhTipoComunicacion, setOperacionCrudRhComunicacion, setRhComunicacionSeleccionado, setVerRhComunicacionActive } from 'src/store/apps/rh-comunicacion';
import DialogRhComunicacionInfo from './DialogRhComunicacionInfo';

interface CellType {
  row: IRhComunicacionResponseDto
}

const ComunicacionList = () => {
  //const theme = useTheme()
  //const { direction } = theme
  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'



  const columns = [


    {
      flex: 0.1,
      field: 'codigoComunicacion',
      minWidth: 25,
      headerName: '# ID',
    },

    {
      flex: 0.2,
      minWidth: 150,
      field: 'descripcionTipoComunicacion',
      headerName: 'Tipo ',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionTipoComunicacion}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 25,
      field: 'codigoArea',
      headerName: 'Area',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoArea}</Typography>
    },
    {
      flex: 0.4,
      minWidth: 125,
      field: 'lineaComunicacion',
      headerName: 'Linea',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.lineaComunicacion}</Typography>
    },




  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhComunicacionResponseDto)=>{

    console.log(row)
    dispatch(setRhComunicacionSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhComunicacion(2));
    dispatch(setVerRhComunicacionActive(true))


  }



  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


      const defaultValues:IRhComunicacionResponseDto = {
        codigoComunicacion :0,
        codigoPersona :personaSeleccionado.codigoPersona,
        tipoComunicacionId :1115,
        descripcionTipoComunicacion:'',
        codigoArea :'',
        lineaComunicacion :'',
        extencion :0,
        principal:false,

      }


      dispatch(setRhComunicacionSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhComunicacion(1));
      dispatch(setVerRhComunicacionActive(true))


  }


  const dispatch = useDispatch();


  const {verRhComunicacionActive=false} = useSelector((state: RootState) => state.rhComunicacion)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhComunicacionResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)

  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      if(personaSeleccionado.codigoPersona>0){
        const filterBanco={descripcionId:0,tituloId:27}
      const responseTipoComunicacion= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
      dispatch(setListRhTipoComunicacion(responseTipoComunicacion.data))


        const filter={codigoPersona:personaSeleccionado.codigoPersona}
        const responseAll= await ossmmasofApi.post<any>('/RhComunicaciones/GetByPersona',filter);
        setData(responseAll.data?.data);
      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhComunicacionActive, personaSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        {/* <CardHeader title='Comunicaciones' /> */}

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
                <Box sx={{ height: 450 }}>
                <DataGrid
                  getRowId={(row) => row.codigoComunicacion }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhComunicacionInfo  />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ComunicacionList
