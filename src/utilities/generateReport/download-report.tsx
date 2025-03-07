import axios from 'axios'
import authConfig from 'src/configs/auth'

const DownloadReport = async (props: any) => {
  const { tipoReporte, CodigoOrdenPago } = props

  const urlProduction  = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT_PRODUCTION
  const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT

  const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

  const url = `${urlBase}/api-v1.0/${tipoReporte}`

  // const url = `http://216.244.81.115:4000/api-v1.0/${tipoReporte}`
  // const url = 'http://localhost:4000/api-v1.0/payment-orders/pdf/report'

  try {
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