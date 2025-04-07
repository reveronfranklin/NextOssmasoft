import { useState, useEffect } from 'react'
import { Box, Skeleton } from '@mui/material'
import ConvertToBase64 from 'src/utilities/convert-to-base64'

const ReportViewAsync = (props: { url: string, width: string, height: string }) => {
  const [base64, setBase64] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!props.url) {
      setIsLoading(false)

      return;
    }

    setIsLoading(true);
    ConvertToBase64(props.url)
      .then((base64) => {
        setBase64(base64)
      })
      .catch(() => {
        setBase64(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [props.url])

  if (!props.url) {
    return (
      <Box sx={{
        width: props.width,
        height: props.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1
      }}>
        Cargando reporte espere un momento...
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ width: props.width, height: props.height }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: props.width,
        height: props.height,
        overflow: 'hidden'
      }}
    >
      <object
        data={"data:application/pdf;base64," + base64}
        type='application/pdf'
        width='100%'
        height='100%'
      >
        <p>
          Unable to display PDF file. <a href={`${props.url}`}>Download</a> instead.
        </p>
      </object>
    </Box>
  )
}

export default ReportViewAsync
