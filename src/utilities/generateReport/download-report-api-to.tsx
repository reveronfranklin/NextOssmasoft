import axios from 'axios'
import authConfig from 'src/configs/auth'

const DownloadReportApiTo = async (props: any) => {
  const { tipoReporte, CodigoOrdenPago } = props

  const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT_PRODUCTION
  const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT
  const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

  try {
    const urlReport = `${urlBase}${tipoReporte}`
    const urlApi = `https://ossmmasoft.com.ve:5001/api/AdmOrdenPago/Report`

    const payload = {
      CodigoOrdenPago,
      Reporte: urlReport,
      Usuario: JSON.parse(window.localStorage.getItem('userData') || '{}').username || '',
    }

    const response = await axios.post(urlApi, payload, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
      }
    })

    //todo verificar que el blob tenga un size con data y que no text/plain
    console.log('response', response)
    const blob = new Blob([response.data], { type: 'application/pdf' })

    return URL.createObjectURL(blob)
  } catch (e: any) {
    console.error(e)
  }
}

export default DownloadReportApiTo