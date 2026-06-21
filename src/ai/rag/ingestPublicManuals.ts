export type ManualChunk = {
  heading?: string | null
  text: string
}

export type ManualDocForIngest = {
  url: string
  title?: string
  text: string
  chunks?: ManualChunk[]
}

export type IngestOptions = {
  manifestUrl?: string
  maxChunkChars?: number
  overlapChars?: number
  batchDocs?: number
}

function normalizeNewlines(input: string) {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function chunkMarkdown(md: string, maxChunkChars: number, overlapChars: number): ManualChunk[] {
  const text = normalizeNewlines(md)

  // Heurística simple: separar por headings Markdown.
  const lines = text.split('\n')
  const chunks: ManualChunk[] = []

  let currentHeading: string | null = null
  let buffer: string[] = []

  const flush = () => {
    const raw = buffer.join('\n').trim()
    buffer = []
    if (!raw) return

    // troceo por tamaño
    let start = 0
    while (start < raw.length) {
      const end = Math.min(raw.length, start + maxChunkChars)
      const slice = raw.slice(start, end)
      chunks.push({ heading: currentHeading, text: slice.trim() })
      if (end >= raw.length) break
      start = Math.max(0, end - overlapChars)
    }
  }

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
    if (headingMatch) {
      flush()
      currentHeading = headingMatch[2]
      continue
    }
    buffer.push(line)
  }

  flush()

  return chunks.filter(c => c.text && c.text.trim().length > 0)
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`No se pudo leer ${url}. HTTP ${res.status}`)

  return res.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`No se pudo leer ${url}. HTTP ${res.status}`)

  return res.text()
}

export async function ingestPublicManualsToWorker(worker: Worker, options: IngestOptions = {}) {
  const {
    manifestUrl = '/manuals/manifest.json',
    maxChunkChars = 1000,
    overlapChars = 120,
    batchDocs = 1
  } = options

  type Manifest = { manuals: Array<{ url: string; title?: string }> }

  const manifest = await fetchJson<Manifest>(manifestUrl)
  const manuals = Array.isArray(manifest?.manuals) ? manifest.manuals : []

  if (!manuals.length) {
    throw new Error(`Manifest vacío. Agrega rutas en ${manifestUrl}`)
  }

  const docs: ManualDocForIngest[] = []

  for (const m of manuals) {
    const url = String(m.url)
    const title = m.title ? String(m.title) : undefined
    const md = await fetchText(url)
    const chunks = chunkMarkdown(md, maxChunkChars, overlapChars)
    docs.push({ url, title, text: md, chunks })
  }

  for (let i = 0; i < docs.length; i += batchDocs) {
    const batch = docs.slice(i, i + batchDocs)

    worker.postMessage({
      type: 'ingest',
      payload: {
        docs: batch
      }
    })
  }
}
