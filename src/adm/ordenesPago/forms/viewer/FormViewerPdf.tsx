import React, { useState, useEffect, useCallback } from 'react';
import { TextField, MenuItem, Box, Typography, CircularProgress } from '@mui/material'
import ReportViewAsync from 'src/share/components/Reports/forms/ReportViewAsync'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { UrlServices } from '../../enums/UrlServices.enum'
import Icon from 'src/@core/components/icon'
import { reportOptions } from '../../config/reportOptions'
import { generarReporteOrdenPagoPdf } from '../../services/reporteOrdenPago.service'
import { generarReporteComprobanteIvaPdf } from '../../services/reporteComprobanteIva.service'
import { generarReporteRetencionIslrPdf } from '../../services/reporteRetencionIslr.service'
import { generarReporteTimbreFiscalPdf } from '../../services/reporteTimbreFiscal.service'

const FormViewerPdf: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(reportOptions[0].value)
  const [isLoading, setIsLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState('')

  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)

  const fetchReport = useCallback(async (reportType: string) => {
    try {
      setIsLoading(true)

      if (reportType === UrlServices.GETREPORTBYORDENPAGO) {
        const objectURL = await generarReporteOrdenPagoPdf(codigoOrdenPago)

        setReportUrl(objectURL)

        return
      }

      if (reportType === UrlServices.GETREPORTBYCOMPROBANTE) {
        const objectURL = await generarReporteComprobanteIvaPdf(codigoOrdenPago)

        setReportUrl(objectURL)

        return
      }

      if (reportType === UrlServices.GETREPORTBYRETENCIONES) {
        const objectURL = await generarReporteRetencionIslrPdf(codigoOrdenPago)

        setReportUrl(objectURL)

        return
      }

      if (reportType === UrlServices.TIMBREFISCAL) {
        const objectURL = await generarReporteTimbreFiscalPdf(codigoOrdenPago)

        setReportUrl(objectURL)

        return
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setIsLoading(false)
    }
  }, [codigoOrdenPago])

  useEffect(() => {
    fetchReport(selectedReport)
  }, [fetchReport, selectedReport])

  const handleReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const reportType = event.target.value

      setSelectedReport(reportType as UrlServices)
    } catch (e: any) {
      console.log(e)
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
