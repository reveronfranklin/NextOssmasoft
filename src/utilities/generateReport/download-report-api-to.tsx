import axios from 'axios'
import authConfig from 'src/configs/auth'

interface IReportApiTo {
  Report: string;
  Usuario: string;
}

const DownloadReportApiTo = async (props: any) => {
  const { tipoReporte, params, module } = props

  const urlProductionReport = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT_PRODUCTION
  const urlDevelopmentReport = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT

  const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
  const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

  const urlReportBase: string | undefined = !authConfig.isProduction ? urlDevelopmentReport : urlProductionReport
  const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

  try {
    const urlReport = `${urlReportBase}${tipoReporte}`
    const urlApi = `${urlBase}/${module}/Report`

    const payload = {
      ...params,
      Report: urlReport,
      Usuario: JSON.parse(window.localStorage.getItem('userData') || '{}').username || '',
    } as IReportApiTo

    const response = await axios.post(urlApi, payload, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
      }
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })

    return URL.createObjectURL(blob)
  } catch (e: any) {
    console.error(e)
  }
}

export default DownloadReportApiTo