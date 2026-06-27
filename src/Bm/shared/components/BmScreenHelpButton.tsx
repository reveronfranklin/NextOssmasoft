import { Fragment, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Typography
} from '@mui/material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

interface BmScreenHelpButtonProps {
  title: string
  docPath: string
}

const renderInline = (text: string) => {
  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <Box
          key={`${part}-${index}`}
          component='code'
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'action.hover',
            fontSize: '0.875em',
            fontFamily: 'monospace'
          }}
        >
          {part.slice(1, -1)}
        </Box>
      )
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>
  })
}

const MarkdownContent = ({ content }: { content: string }) => {
  const blocks = useMemo(() => content.split('\n'), [content])
  const elements: JSX.Element[] = []
  let listItems: string[] = []
  let codeLines: string[] = []
  let inCode = false

  const flushList = () => {
    if (!listItems.length) return

    elements.push(
      <Box component='ul' key={`ul-${elements.length}`} sx={{ mt: 1, mb: 3, pl: 6 }}>
        {listItems.map((item, index) => (
          <Typography component='li' variant='body2' key={`${item}-${index}`} sx={{ mb: 1 }}>
            {renderInline(item)}
          </Typography>
        ))}
      </Box>
    )
    listItems = []
  }

  const flushCode = () => {
    if (!codeLines.length) return

    elements.push(
      <Box
        component='pre'
        key={`pre-${elements.length}`}
        sx={{
          p: 3,
          mb: 3,
          overflow: 'auto',
          borderRadius: 1,
          bgcolor: 'action.hover',
          fontSize: '0.8125rem'
        }}
      >
        <code>{codeLines.join('\n')}</code>
      </Box>
    )
    codeLines = []
  }

  blocks.forEach((rawLine, index) => {
    const line = rawLine.trimEnd()

    if (line.startsWith('```')) {
      if (inCode) {
        flushCode()
        inCode = false
      } else {
        flushList()
        inCode = true
      }

      return
    }

    if (inCode) {
      codeLines.push(rawLine)

      return
    }

    if (!line.trim()) {
      flushList()

      return
    }

    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <Typography key={`h3-${index}`} variant='h6' sx={{ mt: 4, mb: 2 }}>
          {line.replace('### ', '')}
        </Typography>
      )

      return
    }

    if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <Typography key={`h2-${index}`} variant='h6' sx={{ mt: 5, mb: 2 }}>
          {line.replace('## ', '')}
        </Typography>
      )

      return
    }

    if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <Typography key={`h1-${index}`} variant='h5' sx={{ mb: 3 }}>
          {line.replace('# ', '')}
        </Typography>
      )

      return
    }

    if (line.startsWith('- ')) {
      listItems.push(line.replace('- ', ''))

      return
    }

    flushList()
    elements.push(
      <Typography key={`p-${index}`} variant='body2' sx={{ mb: 2, lineHeight: 1.7 }}>
        {renderInline(line)}
      </Typography>
    )
  })

  flushList()
  flushCode()

  return <>{elements}</>
}

const BmScreenHelpButton = ({ title, docPath }: BmScreenHelpButtonProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const handleOpen = async () => {
    setOpen(true)

    if (content || loading) return

    try {
      setLoading(true)
      setMessage('')
      const response = await fetch(docPath)

      if (!response.ok) {
        throw new Error('No se pudo cargar la guia de la pantalla')
      }

      setContent(await response.text())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo cargar la guia de la pantalla')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant='outlined' size='small' startIcon={<HelpOutlineOutlinedIcon />} onClick={handleOpen}>
        Flujo y reglas
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='md' scroll='paper'>
        <DialogTitle sx={{ pr: 10 }}>
          {title}
          <IconButton
            aria-label='Cerrar'
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent dividers sx={{ minHeight: 420 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : message ? (
            <Alert severity='warning'>{message}</Alert>
          ) : (
            <MarkdownContent content={content} />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Link href={docPath} target='_blank' rel='noreferrer' underline='hover' variant='body2'>
            Abrir markdown
          </Link>
          <Button variant='contained' onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BmScreenHelpButton
