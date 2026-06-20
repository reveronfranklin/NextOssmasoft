import type { NextApiRequest, NextApiResponse } from 'next'

// Desactivar el bodyParser de Next.js para recibir el audio como stream binario crudo
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // La API Key vive SOLO en el servidor — nunca llega al cliente
  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    console.error('[Deepgram Proxy] DEEPGRAM_API_KEY no configurada en variables de entorno del servidor')
    return res.status(500).json({ error: 'Servicio de transcripción no configurado' })
  }

  const contentType = (req.headers['content-type'] as string) || 'audio/webm'

  const params = new URLSearchParams({
    model: 'nova-3',
    smart_format: 'true',
    language: 'es',
    punctuate: 'true',
    filler_words: 'false',
    sample_rate: '48000',
    channels: '1',
  })

  try {
    const deepgramResponse = await fetch(`https://api.deepgram.com/v1/listen?${params.toString()}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': contentType,
      },
      // Pipe del stream de audio directo a Deepgram sin cargar en memoria
      // @ts-ignore — duplex requerido en Node 18+ para body streams
      body: req,
      duplex: 'half',
    })

    if (!deepgramResponse.ok) {
      const errData = await deepgramResponse.json().catch(() => ({ err_msg: 'Error desconocido' }))
      console.error('[Deepgram Proxy] Error de Deepgram:', errData)
      return res.status(deepgramResponse.status).json({
        error: errData.err_msg || 'Error en la transcripción',
      })
    }

    const result = await deepgramResponse.json()
    return res.status(200).json(result)
  } catch (error: any) {
    console.error('[Deepgram Proxy] Error en el proxy de transcripción:', error)
    return res.status(500).json({ error: 'Error interno del proxy', detail: error.message })
  }
}
