// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Box, Typography } from '@mui/material'
import ReportViewAsync from 'src/share/components/Reports/forms/ReportViewAsync'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { UrlServices } from '../../enums/UrlServices.enum'
import Icon from 'src/@core/components/icon'
import { reportOptions } from '../../config/reportOptions'

// import HandleReport from 'src/utilities/generateReport/download-report'
import HandleReportApiTo from 'src/utilities/generateReport/download-report-api-to'

const FormViewerPdf: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(reportOptions[0].value)
  const [reportUrl, setReportUrl] = useState('')

  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)

  const fetchReport = async (reportType: string) => {
    try {
      // const objectURL = await HandleReport({ tipoReporte: reportType, CodigoOrdenPago: codigoOrdenPago }) || '' //todo apunta a la api de reporte original
      const objectURL = await HandleReportApiTo({ tipoReporte: reportType, CodigoOrdenPago: codigoOrdenPago }) || '' //todo hace el bypass primero a la api

      setReportUrl(objectURL)
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  useEffect(() => {
    fetchReport(selectedReport)
  }, [codigoOrdenPago])

  const handleReportChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const reportType = event.target.value

    setSelectedReport(reportType as UrlServices)
    fetchReport(reportType)
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} sm={3} sx={{ border: '1px solid #ccc', padding: 2, borderRadius: '4px', paddingTop: 0 }}>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body1">Orden de Pago: {codigoOrdenPago}</Typography>
          </Box>
          <TextField
            select
            label="Seleccionar Reporte"
            value={selectedReport}
            onChange={handleReportChange}
            fullWidth
            variant="outlined"
            sx={{ marginTop: 4 }}
          >
            {reportOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon icon={option.icon} fontSize={20} />
                  {option.label}
                </Box>
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