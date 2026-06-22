import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { IRhPeriodosResponseDto } from 'src/interfaces/rh/Periodos/RhPeriodosResponseDto'

export const REPORTE_GENERAL_NOMINA_ENDPOINTS = {
  pdf: '/ReporteGeneralNomina/pdf'
}

const getPeriodoFechaNomina = (periodo: IRhPeriodosResponseDto) => {
  if (periodo.fechaNomina) {
    const fechaNomina = new Date(periodo.fechaNomina)

    if (!Number.isNaN(fechaNomina.getTime())) {
      return fechaNomina.toISOString()
    }
  }

  if (periodo.fechaNominaObj) {
    const fechaNomina = new Date(
      Number(periodo.fechaNominaObj.year),
      Number(periodo.fechaNominaObj.month) - 1,
      Number(periodo.fechaNominaObj.day)
    )

    if (!Number.isNaN(fechaNomina.getTime())) {
      return fechaNomina.toISOString()
    }
  }

  if (periodo.fechaNominaString) {
    const fechaNomina = new Date(periodo.fechaNominaString)

    if (!Number.isNaN(fechaNomina.getTime())) {
      return fechaNomina.toISOString()
    }
  }

  return new Date().toISOString()
}

export const generarReporteGeneralNominaPdf = async (periodo: IRhPeriodosResponseDto) => {
  const payload = {
    p_tipo_nomina: periodo.codigoTipoNomina,
    p_fecha_pago: getPeriodoFechaNomina(periodo),
    p_tipo_generacion: 3,
    p_codigo_periodo: periodo.codigoPeriodo,
    p_cedula: null
  }

  const response = await ossmmasofApiVertical.post(REPORTE_GENERAL_NOMINA_ENDPOINTS.pdf, payload, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    }
  })

  if (response.data?.type?.includes('application/json')) {
    const errorText = await response.data.text()
    throw new Error(errorText || 'No se pudo generar el reporte general de nomina')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
