
import authConfig from 'src/configs/auth'

const downloadReportByName = async (nameReport: string) => {
  const urlProduction  = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
  const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

  try {
    const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction
    const url = `${urlBase}/Files/GetPdfFiles/${nameReport}`

    const response = await fetch(url)
    const blob = await response.blob()
    const objectURL = URL.createObjectURL(blob)
    const newTab = window.open(objectURL, '_blank')

    if (!newTab) {
      throw new Error('El bloqueador de ventanas emergentes está activado. Por favor, habilite las ventanas emergentes para abrir el informe.')
    }
  } catch (e: any) {
    console.error(e)
  }
}

export default downloadReportByName