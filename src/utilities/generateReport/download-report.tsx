import axios from 'axios'

//import authConfig from 'src/configs/auth'

const DownloadReport = async (props: any) => {

  //const urlProduction  = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
  //const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

  const refreshToken = window.localStorage.getItem('refreshToken')!

  //const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction
  const url = 'http://216.244.81.115:4000/api-v1.0/payment-orders/pdf/report'

  // const url = 'http://localhost:4000/api-v1.0/payment-orders/pdf/report'

  try {
    const response = await axios.post(url, props, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'x-refresh-token': refreshToken,
      }
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const objectURL = URL.createObjectURL(blob)
    const newTab = window.open(objectURL, '_blank')

    if (!newTab) {
      throw new Error('El bloqueador de ventanas emergentes está activado. Por favor, habilite las ventanas emergentes para abrir el informe.')
    }
  } catch (e: any) {
    console.error(e)
  }
}

export default DownloadReport