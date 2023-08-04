import * as React from 'react';
import { useEffect } from 'react';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { Box } from '@mui/material';
import Spinner from 'src/@core/components/spinner';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { useDispatch } from 'react-redux';
import { setOperacionCrudPreTitulo, setPreTituloSeleccionado, setVerPreTituloActive } from 'src/store/apps/pre-titulos';

//import { DataGrid } from '@mui/x-data-grid';

//const rows: GridRowsProp = [];

const columns: GridColDef[] = [

  { field: 'descripcion', headerName: 'Descripcion', width: 300 },

];



const TreeViewTitulo = ()  => {

  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<GridRowsProp[]>([]);
  const {listPreTitulos} = useSelector((state: RootState) => state.preTitulo)
 const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.path;

 const onFilterChange= ()=>{
   console.log('onFilterChange')
 }

 const handleView=  (row : any)=>{


   const {id} = row;

  console.log(row)

  if(!isNaN(+row.id)){
    const titulo=listPreTitulos.find((elemento)=> elemento.tituloId==row.id);


    dispatch(setPreTituloSeleccionado(titulo))

   // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreTitulo(2));
    dispatch(setVerPreTituloActive(true))
  }else{
    const splitted = id.split('/', 2);
    console.log('splitted',splitted[1])
  }





}

  useEffect(() => {
    const getDataTree = async () => {
      setLoading(true);

      const responseTree= await ossmmasofApi.get<any>('/PreTitulos/GetTreeTitulos');
      setRows(responseTree.data.data)
      console.log(responseTree.data.data)
      setLoading(false);
    };
    getDataTree();

  }, [])

  return (
    <div style={{ height: 400, width: '100%' }}>
        {
                loading
                ?   <Spinner sx={{ height: '100%' }} />
                :
                <div>
                <Box sx={{ height: 800 }}>
                  <DataGridPro
                    treeData
                    rows={rows}
                    columns={columns}
                    getTreeDataPath={getTreeDataPath}
                    onFilterModelChange={onFilterChange}
                    onRowDoubleClick={handleView}
                    pagination

                  />
              </Box>
                </div>


        }


    </div>
  );
}

export default TreeViewTitulo
