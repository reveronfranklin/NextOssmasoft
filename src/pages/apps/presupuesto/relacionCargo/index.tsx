// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** Data Import
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'
import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

//import { DataGridPro } from '@mui/x-data-grid-pro'
import Spinner from 'src/@core/components/spinner';
import { RootState } from 'src/store'
import { IPreRelacionCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-get-dto'
import FilterPresupuestoRelacionCargo from 'src/presupuesto/relacionCargo/components/FilterPresupuestoRelacionCargo'
import { IFilterPresupuestoIcp } from 'src/interfaces/Presupuesto/i-filter-presupuesto-icp'

const columns = [
  {
    flex: 0.1,
    field: 'codigoRelacionCargo',
    minWidth: 80,
    headerName: 'ID'
  },
  {
    flex: 0.1,
    field: 'ano',
    minWidth: 80,
    headerName: 'Año'
  },
  {
    flex: 0.25,
    minWidth: 200,

    field: 'descripcionTipoPersonal',
    headerName: 'Tipo De Personal'
  },
  {
    flex: 0.25,
    minWidth: 230,
    field: 'descripcionTipoCargo',

    headerName: 'Tipo de Cargo'
  },
  {
    flex: 0.15,
    minWidth: 230,

    field: 'denominacionCargo',
    headerName: 'Denominacion Cargo'
  },
  {
    flex: 0.015,
    minWidth: 70,
    editable: true,
    type: 'number',
    field: 'cantidad',
    headerName: 'Cargos'
  },
  {
    flex: 0.1,
    field: 'sueldo',
    minWidth: 80,
    type: 'number',
    editable: true,
    headerName: 'Sueldo'
  },

  {
    flex: 0.1,
    field: 'totalMensual',
    minWidth: 80,
    disableColumnMenu:true,
    headerName: 'Total Mensual'
  },
  {
    flex: 0.1,
    field: 'totalAnual',
    minWidth: 80,
    disableColumnMenu:true,
    headerHeight: 80,
    headerName: 'Total Anual'
  }
]

const TableEditable = () => {

  const handleOnCellEditCommit=(row:any)=>{
    console.log(row);
  }


  const dispatch = useDispatch();


  const {listpresupuestoDtoSeleccionado,listpresupuestoDto} = useSelector((state: RootState) => state.presupuesto)
  const {icpSeleccionado} = useSelector((state: RootState) => state.icp)
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IPreRelacionCargosGetDto[]>([]);

  useEffect(() => {

    const getRelacionCargo = async (filter:FilterByPresupuestoDto) => {
      setLoading(true);


      const responseAll= await ossmmasofApi.post<any>('/PreRelacionCargos/GetAllByPresupuesto',filter);
      let data = responseAll.data.data;
      if(data==null) data=[];
      setRows(data);



      /*const filterTipoPersonal:IFilterPreTituloDto={
        tituloId:0,
        codigo:'TP'
      }
      const responseTipoPersonal= await ossmmasofApi.post<any>('/PreDescriptivas/GetAllByCodigoTitulo',filterTipoPersonal);

      dispatch(setListTipoPersonal(responseTipoPersonal.data.data));*/


      setLoading(false);
    };



    const filter:IFilterPresupuestoIcp={
      codigoPresupuesto:0,
      codigoIcp:0
    }

    if(listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto!=null){
      filter.codigoPresupuesto=listpresupuestoDtoSeleccionado.codigoPresupuesto;
      if(icpSeleccionado && icpSeleccionado.codigoIcp!=null){
        filter.codigoIcp=icpSeleccionado.codigoIcp;
      }
    }else{
      filter.codigoPresupuesto==listpresupuestoDto[0].codigoPresupuesto;
      dispatch(setListpresupuestoDtoSeleccionado(listpresupuestoDto[0]));
    }
    getRelacionCargo(filter);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listpresupuestoDtoSeleccionado,icpSeleccionado]);



  return (
    <Card>
      <CardHeader title='Relacion Cargo' />
      <FilterPresupuestoRelacionCargo/>
      <Box sx={{ height: 700 }}>
      { loading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (

        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          getRowId={(row) => row.codigoRelacionCargo}
          onCellEditCommit={row =>handleOnCellEditCommit(row)}
        />


      )}

      </Box>
    </Card>
  )
}

export default TableEditable
