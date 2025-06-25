import axios from 'axios'
import authConfig from 'src/configs/auth'

const DownloadReport = async (props: any) => {
  const { tipoReporte, CodigoOrdenPago } = props

  const urlProduction  = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT_PRODUCTION
  const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT

  const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

  try {
    const url = `${urlBase}${tipoReporte}`
    const response = await axios.post(url, { CodigoOrdenPago }, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'x-refresh-token': window.localStorage.getItem('refreshToken')!,
      }
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })

    return URL.createObjectURL(blob)
  } catch (e: any) {
    console.error(e)
  }
}

export default DownloadReport