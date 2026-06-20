import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: true,
    sizeLimit: '50kb',
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    console.error('[Deepgram Proxy] DEEPGRAM_API_KEY no configurada en variables de entorno del servidor')
    return res.status(500).json({ error: 'Servicio de síntesis de voz no configurado' })
  }

  const { text, model = 'aura-2-celeste-es' } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'El campo "text" es requerido y debe ser un string' })
  }

  if (text.length > 3000) {
    return res.status(400).json({ error: 'El texto excede el límite de 3000 caracteres para síntesis de voz' })
  }

  try {
    const deepgramResponse = await fetch(`https://api.deepgram.com/v1/speak?model=${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'text/plain',
      },
      body: text,
    })

    if (!deepgramResponse.ok) {
      console.error('[Deepgram Proxy] Error TTS status:', deepgramResponse.status)
      return res.status(deepgramResponse.status).json({ error: 'Error al generar síntesis de voz' })
    }

    const audioBuffer = await deepgramResponse.arrayBuffer()
    const contentType = deepgramResponse.headers.get('content-type') || 'audio/mpeg'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).send(Buffer.from(audioBuffer))
  } catch (error: any) {
    console.error('[Deepgram Proxy] Error en el proxy TTS:', error)
    return res.status(500).json({ error: 'Error interno del proxy', detail: error.message })
  }
}
