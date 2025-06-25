import authConfig from 'src/configs/auth'

export const getReportUrl = (fileName?: string): string => {
  const urlProduction: string | undefined = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT_PRODUCTION
  const urlDevelopment: string | undefined = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT

  const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

  if (!urlBase) {
    console.error('Una de las variables de entorno para la URL base del reporte no está definida.')

    return ''
  }

  if (!fileName) {
    return urlBase;
  }

  return `${urlBase}/${fileName}`;
}