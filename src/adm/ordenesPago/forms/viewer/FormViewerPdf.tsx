import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Typography, CircularProgress } from '@mui/material'
import ReportViewAsync from 'src/share/components/Reports/forms/ReportViewAsync'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { UrlServices } from '../../enums/UrlServices.enum'
import Icon from 'src/@core/components/icon'
import { reportOptions } from '../../config/reportOptions'
import HandleReportApiTo from 'src/utilities/generateReport/download-report-api-to'

const FormViewerPdf: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(reportOptions[0].value)
  const [isLoading, setIsLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState('')

  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)

  const fetchReport = async (reportType: string) => {
    try {
      const objectURL = await HandleReportApiTo({ tipoReporte: reportType, CodigoOrdenPago: codigoOrdenPago }) || ''

      setReportUrl(objectURL)
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  useEffect(() => {
    fetchReport(selectedReport)
  }, [codigoOrdenPago])

  const handleReportChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)
      const reportType = event.target.value

      setSelectedReport(reportType as UrlServices)
      fetchReport(reportType)
    } catch (e: any) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        borderRadius: '4px',
        flexWrap: 'wrap'
      }}>
        {/* <Typography variant="body1" sx={{ mr: 2 }}>
          Orden de Pago: {codigoOrdenPago}
        </Typography> */}

        <TextField
          select
          label="Seleccionar Reporte"
          value={selectedReport}
          onChange={handleReportChange}
          variant="outlined"
          sx={{ width: 'auto', minWidth: 250 }}
        >
          { reportOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon={option.icon} fontSize={20} />
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{
        flex: 1,
        border: '1px solid #ccc',
        borderRadius: '4px',
        position: 'relative',
        minHeight: 0
      }}>
        {isLoading ? (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)'
          }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Generando reporte...
            </Typography>
          </Box>
        ) : null}

        <Box sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}>
          <ReportViewAsync
            url={reportUrl}
            width="100%"
            height="700px"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default FormViewerPdf