import * as React from 'react';
import { useEffect } from 'react';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto';
import { Box } from '@mui/material';
import Spinner from 'src/@core/components/spinner';
import { RootState } from 'src/store';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { setIcpSeleccionado, setOperacionCrudIcp, setVerIcpActive } from 'src/store/apps/ICP';

//const rows: GridRowsProp = [];

const columns: GridColDef[] = [
  { field: 'denominacion', headerName: 'Denominacion', width: 300 },
  { field: 'descripcion', headerName: 'Descripcion', width: 300 },
  { field: 'unidadEjecutora', headerName: 'Unidad Ejecutora', width: 300 },

];


const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.path;

const TreeViewIcp = ()  => {

  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<GridRowsProp[]>([]);
  const {listIcp} = useSelector((state: RootState) => state.icp)

  const handleView=  (row : any)=>{


    if(!isNaN(+row.id)){
      const icp=listIcp.find((elemento)=> elemento.codigoIcp==row.id);


      dispatch(setIcpSeleccionado(icp))

     // Operacion Crud 2 = Modificar presupuesto
      dispatch(setOperacionCrudIcp(2));
      dispatch(setVerIcpActive(true))
    }





  }

  useEffect(() => {
    const getDataTreeIcp = async () => {
      setLoading(true);
      const filter:FilterByPresupuestoDto={
        codigoPresupuesto:0
      }
      const responseTree= await ossmmasofApi.post<any>('/PreIndiceCategoriaProgramatica/GetTree',filter);

      setData(responseTree.data.data)
      setLoading(false);
    };
    getDataTreeIcp();

  }, [])

  return (
    <div style={{ height: 400, width: '100%' }}>
        {
                loading
                ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                  <DataGridPro
                    treeData
                    rows={data}
                    columns={columns}
                    getTreeDataPath={getTreeDataPath}
                    onRowDoubleClick={handleView}
                  />
                </Box>
        }


    </div>
  );
}

export default TreeViewIcp
