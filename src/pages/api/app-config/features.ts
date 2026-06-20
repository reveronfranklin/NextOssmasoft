import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * API Route: /api/app-config/features
 *
 * Retorna las feature flags de la aplicación.
 *
 * ESTADO ACTUAL: valores hardcodeados (true/false).
 *
 * PREPARADO PARA BD: cuando el backend NestJS exponga un endpoint de configuración,
 * simplemente reemplazar el objeto `features` por una llamada fetch al API Gateway:
 *
 *   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API_GATEWAY_NEST}/app-config/features`, {
 *     headers: { Authorization: `Bearer ${serverToken}` }
 *   })
 *   const features = await response.json()
 *
 * Ningún componente React necesita cambiar cuando se haga esa migración.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FEATURE FLAGS
  // Cambiar a false para deshabilitar una funcionalidad globalmente.
  // En el futuro: leer estos valores desde la BD vía el backend NestJS.
  // ─────────────────────────────────────────────────────────────────────────
  const features = {
    /** Dictado de voz con Deepgram (STT + TTS) en campos de texto */
    audioDictation: true,
  }

  // Cache corta: evita llamadas excesivas pero revalida en 60 segundos
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
  return res.status(200).json(features)
}
