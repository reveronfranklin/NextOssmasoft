import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Box, Typography } from '@mui/material'
import ReportViewAsync from 'src/share/components/Reports/forms/ReportViewAsync'
import HandleReport from 'src/utilities/generateReport/download-report'
import { RootState } from "src/store"
import { useSelector } from "react-redux"

const reportOptions = [
  { value: 'report',      label: 'Orden de Pago' },
  { value: 'retenciones', label: 'Retenciones' },
  { value: 'report3',     label: 'Reporte 3' },
  { value: 'report4',     label: 'Reporte 4' },
]

const FormViewerPdf: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(reportOptions[0].value)
  const [reportUrl, setReportUrl] = useState('')

  const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
  const { codigoOrdenPago } = compromisoSeleccionadoListaDetalle

  console.log(codigoOrdenPago)
  const fetchReport = async (reportType: string) => {
    try {
      const objectURL = await HandleReport({ tipoReporte: reportType, CodigoOrdenPago: codigoOrdenPago }) || '';
      setReportUrl(objectURL);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  }

  useEffect(() => {
    fetchReport(selectedReport)
  }, [codigoOrdenPago])

  const handleReportChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const reportType = event.target.value
    setSelectedReport(reportType)
    fetchReport(reportType)
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} sm={3} sx={{ backgroundColor: '#f9fafc', border: '1px solid #ccc', padding: 2, borderRadius: '4px', paddingTop: 0 }}>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body1"># Orden de Pago: {codigoOrdenPago}</Typography>
          </Box>
          <TextField
            select
            label="Seleccionar Reporte"
            value={selectedReport}
            onChange={handleReportChange}
            fullWidth
            variant="outlined"
            sx={{ marginTop: 4, backgroundColor: 'white' }}
          >
            {reportOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: '4px' }}>
            <ReportViewAsync
              url={reportUrl}
              width="100%"
              height="700px"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormViewerPdf