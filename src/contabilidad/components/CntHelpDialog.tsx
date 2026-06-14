import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'

type HelpDocType = 'funcional' | 'tecnico'

export type CntHelpContext =
  | 'conciliacion'
  | 'carga-banco'
  | 'estados-cuenta'
  | 'libro-banco'
  | 'detalle'
  | 'proceso-automatico'

interface Props {
  context: CntHelpContext
  label?: string
}

interface HelpContextConfig {
  title: string
  subtitle: string
  docs: Record<HelpDocType, string>
  sections: Record<HelpDocType, string[]>
}

const conciliacionDocs: Record<HelpDocType, string> = {
  funcional: '/docs/cnt/conciliacion-funcional.md',
  tecnico: '/docs/cnt/conciliacion-tecnico.md'
}

const procesoAutomaticoDocs: Record<HelpDocType, string> = {
  funcional: '/docs/cnt/proceso-automatico-funcional.md',
  tecnico: '/docs/cnt/proceso-automatico-tecnico.md'
}

const contextConfig: Record<CntHelpContext, HelpContextConfig> = {
  conciliacion: {
    title: 'Ayuda de conciliacion',
    subtitle: 'Flujo funcional y referencia tecnica del modulo.',
    docs: conciliacionDocs,
    sections: {
      funcional: ['## Flujo general', '## Crear o abrir conciliacion'],
      tecnico: ['## Rutas frontend', '## Flujo tecnico de conciliacion']
    }
  },
  'carga-banco': {
    title: 'Ayuda de conciliacion',
    subtitle: 'Flujo funcional y referencia tecnica del modulo.',
    docs: conciliacionDocs,
    sections: {
      funcional: ['## Extraccion multiformato', '## Importar estados de cuenta', '## Confirmar archivo importado'],
      tecnico: ['## Extraccion multiformato', '## Formato tecnico del archivo bancario', '## Flujo tecnico de importacion']
    }
  },
  'estados-cuenta': {
    title: 'Ayuda de conciliacion',
    subtitle: 'Flujo funcional y referencia tecnica del modulo.',
    docs: conciliacionDocs,
    sections: {
      funcional: ['## Estados de cuenta'],
      tecnico: ['## Tablas principales', '## Flujo tecnico de importacion']
    }
  },
  'libro-banco': {
    title: 'Ayuda de conciliacion',
    subtitle: 'Flujo funcional y referencia tecnica del modulo.',
    docs: conciliacionDocs,
    sections: {
      funcional: ['## Libro banco'],
      tecnico: ['## Flujo tecnico de libro banco', '## Tablas principales']
    }
  },
  detalle: {
    title: 'Ayuda de conciliacion',
    subtitle: 'Flujo funcional y referencia tecnica del modulo.',
    docs: conciliacionDocs,
    sections: {
      funcional: ['## Detalle de conciliacion', '## Sugerencias', '## Precierre', '## Cierre', '## Reverso'],
      tecnico: ['## Flujo tecnico de conciliacion', '## Estados tecnicos esperados', '## Riesgos y validaciones']
    }
  },
  'proceso-automatico': {
    title: 'Ayuda de comprobantes automaticos',
    subtitle: 'Flujo funcional y referencia tecnica del proceso.',
    docs: procesoAutomaticoDocs,
    sections: {
      funcional: ['## Flujo general', '## Previsualizacion', '## Generar comprobante', '## Reemplazo y duplicados', '## Origenes soportados'],
      tecnico: ['## Ruta frontend', '## DTO de confirmacion', '## Flujo tecnico de confirmacion', '## Tabla de trabajo', '## Reglas anti duplicado']
    }
  }
}

const extractSections = (markdown: string, headings: string[]) => {
  const lines = markdown.split('\n')
  const sections: string[] = []

  headings.forEach(heading => {
    const start = lines.findIndex(line => line.trim().toLowerCase() === heading.toLowerCase())

    if (start === -1) {
      return
    }

    const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
    sections.push(lines.slice(start, end === -1 ? lines.length : end).join('\n').trim())
  })

  return sections.length > 0 ? sections.join('\n\n') : markdown
}

const renderInlineCode = (text: string) => {
  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <Box
          key={index}
          component='code'
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
            bgcolor: 'action.hover',
            color: 'text.primary',
            fontSize: '0.85em'
          }}
        >
          {part.slice(1, -1)}
        </Box>
      )
    }

    return part
  })
}

const MarkdownViewer = ({ markdown }: { markdown: string }) => {
  const lines = markdown.split('\n')
  const nodes: JSX.Element[] = []
  let listItems: string[] = []
  let tableRows: string[][] = []
  let codeLines: string[] = []
  let inCode = false

  const flushList = () => {
    if (listItems.length === 0) return

    nodes.push(
      <Box component='ul' key={`list-${nodes.length}`} sx={{ mt: 1, mb: 3, pl: 6 }}>
        {listItems.map((item, index) => (
          <Typography component='li' variant='body2' key={index} sx={{ mb: 0.75 }}>
            {renderInlineCode(item)}
          </Typography>
        ))}
      </Box>
    )
    listItems = []
  }

  const flushTable = () => {
    if (tableRows.length === 0) return

    const [header, separator, ...body] = tableRows
    const rows = separator?.every(cell => /^:?-{3,}:?$/.test(cell.trim())) ? body : tableRows.slice(1)

    nodes.push(
      <Box key={`table-${nodes.length}`} sx={{ overflowX: 'auto', mb: 4 }}>
        <Box component='table' sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <Box component='thead'>
            <Box component='tr'>
              {header.map((cell, index) => (
                <Box
                  component='th'
                  key={index}
                  sx={{ borderBottom: 1, borderColor: 'divider', textAlign: 'left', p: 2, fontWeight: 700 }}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component='tbody'>
            {rows.map((row, rowIndex) => (
              <Box component='tr' key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Box component='td' key={cellIndex} sx={{ borderBottom: 1, borderColor: 'divider', p: 2, verticalAlign: 'top' }}>
                    {renderInlineCode(cell)}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    )
    tableRows = []
  }

  const flushCode = () => {
    if (codeLines.length === 0) return

    nodes.push(
      <Box
        component='pre'
        key={`code-${nodes.length}`}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 1,
          overflowX: 'auto',
          bgcolor: 'grey.900',
          color: 'common.white',
          fontSize: '0.8125rem'
        }}
      >
        <code>{codeLines.join('\n')}</code>
      </Box>
    )
    codeLines = []
  }

  lines.forEach(rawLine => {
    const line = rawLine.trim()

    if (line.startsWith('```')) {
      if (inCode) {
        inCode = false
        flushCode()
      } else {
        flushList()
        flushTable()
        inCode = true
      }

      return
    }

    if (inCode) {
      codeLines.push(rawLine)

      return
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      flushList()
      tableRows.push(line.slice(1, -1).split('|').map(cell => cell.trim()))

      return
    }

    flushTable()

    if (!line) {
      flushList()

      return
    }

    if (line.startsWith('# ')) {
      flushList()
      nodes.push(
        <Typography variant='h5' key={`h1-${nodes.length}`} sx={{ mb: 3 }}>
          {line.replace(/^#\s+/, '')}
        </Typography>
      )

      return
    }

    if (line.startsWith('## ')) {
      flushList()
      nodes.push(
        <Typography variant='h6' key={`h2-${nodes.length}`} sx={{ mt: 4, mb: 2 }}>
          {line.replace(/^##\s+/, '')}
        </Typography>
      )

      return
    }

    if (line.startsWith('### ')) {
      flushList()
      nodes.push(
        <Typography variant='subtitle1' key={`h3-${nodes.length}`} sx={{ mt: 3, mb: 1.5, fontWeight: 700 }}>
          {line.replace(/^###\s+/, '')}
        </Typography>
      )

      return
    }

    if (line.startsWith('- ')) {
      listItems.push(line.replace(/^-\s+/, ''))

      return
    }

    if (/^\d+\.\s+/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s+/, ''))

      return
    }

    flushList()
    nodes.push(
      <Typography variant='body2' key={`p-${nodes.length}`} sx={{ mb: 2, lineHeight: 1.7 }}>
        {renderInlineCode(line)}
      </Typography>
    )
  })

  flushList()
  flushTable()
  flushCode()

  return <Box>{nodes}</Box>
}

const CntHelpDialog = ({ context, label = 'Ayuda' }: Props) => {
  const config = contextConfig[context]
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<HelpDocType>('funcional')
  const [content, setContent] = useState<Record<HelpDocType, string>>({ funcional: '', tecnico: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setError('')

    Promise.all(
      Object.entries(config.docs).map(async ([docType, url]) => {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`No se pudo cargar ${url}`)
        }

        return [docType, await response.text()] as [HelpDocType, string]
      })
    )
      .then(entries => {
        if (cancelled) return
        setContent(Object.fromEntries(entries) as Record<HelpDocType, string>)
      })
      .catch((loadError: Error) => {
        if (cancelled) return
        setError(loadError.message)
      })

    return () => {
      cancelled = true
    }
  }, [config.docs, open])

  const markdown = useMemo(() => {
    const rawContent = content[tab]

    if (!rawContent) {
      return ''
    }

    return extractSections(rawContent, config.sections[tab])
  }, [config.sections, content, tab])

  return (
    <>
      <Button variant='outlined' startIcon={<Icon icon='mdi:help-circle-outline' />} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='md'>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant='h6'>{config.title}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {config.subtitle}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)}>
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <Divider />
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 6 }}>
          <Tab value='funcional' label='Funcional' />
          <Tab value='tecnico' label='Tecnico' />
        </Tabs>
        <DialogContent sx={{ minHeight: 420, maxHeight: '70vh' }}>
          {error ? <Alert severity='error'>{error}</Alert> : markdown ? <MarkdownViewer markdown={markdown} /> : <Alert severity='info'>Cargando ayuda...</Alert>}
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CntHelpDialog
