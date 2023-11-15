// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import

// ** MUI Imports
import Card from '@mui/material/Card'

import { DataGrid } from '@mui/x-data-grid'

import CardHeader from '@mui/material/CardHeader'

import Typography from '@mui/material/Typography'

// ** Icon Imports
//import Icon from 'src/@core/components/icon'

// ** Type Imports


// ** Custom Component Imports

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IRhResumenPagoPorPersona } from 'src/interfaces/rh/IRhResumenPagoPorPersona'
import { IReportRequestDto } from 'src/interfaces/SIS/ReportRequestDto'
import { setReportName, setVerReportViewActive } from 'src/store/apps/report'
import { useDispatch } from 'react-redux'
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo'




interface CellType {
  row: IRhResumenPagoPorPersona
}




const columns = [

  {
    flex: 0.25,
    minWidth: 90,
    field: 'codigoTipoNomina',
    headerName: 'codigoTipoNomina',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoTipoNomina || 0}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'tipoNomina',
    headerName: 'tipoNomina',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.tipoNomina}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'fechaNomina',
    headerName: 'fechaNomina',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.fechaNominaString}</Typography>
  }


]

const PersonaHistoricoPagoListTable = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(7)

  const [data, setData] = useState<IRhResumenPagoPorPersona[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)
  const dispatch = useDispatch();


  const getReport = async (row : IRhResumenPagoPorPersona) => {


    const filter:IReportRequestDto={
      reportName:'ReciboCobro-'+row.cedula + '.pdf',
      reportUrl:row.linkData
    }
    const responseAll= await ossmmasofApi.post<any>('/AppReport/Report',filter);
    console.log('responseAll report recibo',responseAll)
    dispatch(setReportName(responseAll.data));

    //dispatch(setReportName('report.pdf'));

    dispatch(setVerReportViewActive(true))


  };

  const handleView=  (row : IRhResumenPagoPorPersona)=>{

    console.log(row)
    getReport(row)


  }
  const handleDoubleClick=(row:any)=>{


    handleView(row.row)
}

  useEffect(() => {




    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));

      const filter={codigoPersona:personaSeleccionado.codigoPersona}
      const responseAll= await ossmmasofApi.post<any>('/HistoricoMovimiento/GetResumenPago',filter);



      setData(responseAll.data.data);

    };

     getData();




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaSeleccionado]);

  return (
    <Card>
      <DialogReportInfo></DialogReportInfo>
      <CardHeader
        title='Recibos de Pagos'
        sx={{ '& .MuiCardHeader-action': { m: 0 } }}

      />
      <DataGrid
        autoHeight
        getRowId={(row) => row.fechaNominaString}
        columns={columns}
        rows={data}
        pageSize={pageSize}

        onRowDoubleClick={(row) => handleDoubleClick(row)}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default PersonaHistoricoPagoListTable
