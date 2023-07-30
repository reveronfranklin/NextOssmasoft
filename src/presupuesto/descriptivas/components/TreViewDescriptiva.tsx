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

//import { DataGrid } from '@mui/x-data-grid';

//const rows: GridRowsProp = [];

const columns: GridColDef[] = [

  { field: 'descripcion', headerName: 'Descripcion', width: 300 },

];



const TreeViewDescriptiva = ()  => {


  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<GridRowsProp[]>([]);

 const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.path;

 const onFilterChange= ()=>{
   console.log('onFilterChange')
 }

  useEffect(() => {
    const getDataTree = async () => {
      setLoading(true);

      const responseTree= await ossmmasofApi.get<any>('/PreDescriptivas/GetTreeDescriptiva');
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
                    pagination

                  />
              </Box>
                </div>


        }


    </div>
  );
}

export default TreeViewDescriptiva
