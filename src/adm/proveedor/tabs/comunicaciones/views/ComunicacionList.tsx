import { Box, Card, CardActions, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { DataGrid  } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import { ComunicacionResponse } from 'src/adm/proveedor/interfaces'
import { setListTipoProveedor, setOperacionCrudProveedor, setProveedorSeleccionado, setVerProveedorActive } from 'src/store/apps/proveedor-comunicacion';
import { UrlServices } from '../enums/UrlServices.enum'

import DialogComunicacionInfo from './DialogComunicacionInfo';

interface CellType {
  row: ComunicacionResponse
}

const ComunicacionList = () => {
  const columns = [
    {
      flex: 0.1,
      field: 'codigoComProveedor',
      minWidth: 25,
      headerName: '# ID',
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
    }
  ]

  const handleView=  (row : ComunicacionResponse)=>{
    dispatch(setProveedorSeleccionado(row))
    dispatch(setOperacionCrudProveedor(2));
    dispatch(setVerProveedorActive(true))
  }

  const handleDoubleClick=(row:any)=>{
    handleView(row.row)
  }
  const handleAdd=  ()=>{
    const defaultValues:ComunicacionResponse = {
      codigoComProveedor :0,
      codigoProveedor :proveedorSeleccionado.codigoProveedor,
      tipoComunicacionId :1115,
      codigoArea :'',
      lineaComunicacion :'',
      extension :0,
      principal:false
    }

    dispatch(setProveedorSeleccionado(defaultValues));
    dispatch(setOperacionCrudProveedor(1));
    dispatch(setVerProveedorActive(true))
  }

  const dispatch = useDispatch();

  const {verProveedorActive=false} = useSelector((state: RootState) => state.admProveedor)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<ComunicacionResponse[]>([])
  const {proveedorSeleccionado} = useSelector((state: RootState) => state.proveedor)

  const handleViewTree=()=>{
    setViewTable(false);
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      if(proveedorSeleccionado.codigoProveedor>0){
        const filterBanco={descripcionId:0,tituloId:27}
        const responseTipoComunicacion= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);

        dispatch(setListTipoProveedor(responseTipoComunicacion.data))

        const filter={codigoProveedor:proveedorSeleccionado.codigoProveedor}
        const responseAll= await ossmmasofApi.post<any>(`${UrlServices.GET_COMUNICACIONES}`, filter);
        setData(responseAll.data?.data);
      }

      setLoading(false);
    };

    getData();
  }, [verProveedorActive, proveedorSeleccionado]);

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
            <Box sx={{ height: 450 }}>
              <DataGrid
                getRowId={(row) => row.codigoComProveedor }
                columns={columns}
                rows={data}
                onRowDoubleClick={(row) => handleDoubleClick(row)}
              />
            </Box>
          }
      </Card>
      <DatePickerWrapper>
        <DialogComunicacionInfo  />
      </DatePickerWrapper>
    </Grid>
  )
}

export default ComunicacionList
