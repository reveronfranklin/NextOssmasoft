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
import { setOperacionCrudPuc, setPucSeleccionado, setVerPucActive } from 'src/store/apps/PUC';

//const rows: GridRowsProp = [];

const columns: GridColDef[] = [
  { field: 'denominacion', headerName: 'Denominacion', width: 400 },
  { field: 'descripcion', headerName: 'Descripcion', width: 300 },

];


const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.path;

const TreeViewPuc = ()  => {

  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<GridRowsProp[]>([]);
  const {listPuc} = useSelector((state: RootState) => state.puc)

  const handleView=  (row : any)=>{


    if(!isNaN(+row.id)){
      const puc=listPuc.find((elemento)=> elemento.codigoPuc==row.id);


      dispatch(setPucSeleccionado(puc))

     // Operacion Crud 2 = Modificar presupuesto
      dispatch(setOperacionCrudPuc(2));
      dispatch(setVerPucActive(true))
    }





  }

  useEffect(() => {
    const getDataTreePuc = async () => {
      setLoading(true);
      const filter:FilterByPresupuestoDto={
        codigoPresupuesto:0
      }
      const responseTree= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/GetTree',filter);
      console.log('responseTree puc',responseTree )
      setData(responseTree.data.data)
      setLoading(false);
    };
    getDataTreePuc();

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

export default TreeViewPuc
