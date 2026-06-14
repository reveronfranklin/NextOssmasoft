import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import ReportViewAsync from 'src/share/components/Reports/forms/ReportViewAsync'
import { RootState } from 'src/store'
import { generarReportePersonalPdf } from '../services/reportePersonal.service'

const FormReportePersonalViewer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [reportUrl, setReportUrl] = useState('')
  const { rhTipoNominaReporteSeleccionado, isOpenViewerReportePersonal } = useSelector(
    (state: RootState) => state.rhTipoNomina
  )

  useEffect(() => {
    const fetchReport = async () => {
      const codigoTipoNomina = rhTipoNominaReporteSeleccionado?.codigoTipoNomina

      if (!isOpenViewerReportePersonal || !codigoTipoNomina) {
        return
      }

      setIsLoading(true)
      setReportUrl('')

      try {
        const objectUrl = await generarReportePersonalPdf({
          codigoTipoNomina
        })

        setReportUrl(objectUrl)
      } catch (error) {
        console.error('Error generando reporte de personal:', error)
        toast.error('No se pudo generar el reporte de personal')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [isOpenViewerReportePersonal, rhTipoNominaReporteSeleccionado])

  useEffect(() => {
    return () => {
      if (reportUrl) {
        URL.revokeObjectURL(reportUrl)
      }
    }
  }, [reportUrl])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <Box
        sx={{
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: '4px',
          minHeight: 700,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              zIndex: 1
            }}
          >
            <CircularProgress />
            <Typography variant='body1' sx={{ ml: 2 }}>
              Generando reporte...
            </Typography>
          </Box>
        ) : null}

        <ReportViewAsync url={reportUrl} width='100%' height='700px' />
      </Box>
    </Box>
  )
}

export default FormReportePersonalViewer
