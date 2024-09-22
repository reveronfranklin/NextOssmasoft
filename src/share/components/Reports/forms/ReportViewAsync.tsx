import { useState } from 'react'
import { Box } from '@mui/material'
import ConvertToBase64 from 'src/utilities/convert-to-base64'

const ReportViewAsync = (props: { url: string, width: string, height: string }) => {
  const [base64, setBase64] = useState<any>(null)

  if (props.url == '' || props.url == null) {
    return <div>Sentimos la demora, por favor espere...</div>
  }

  ConvertToBase64(props.url).then((base64) => {
    setBase64(base64)
  })

  return (
    <Box sx={{ width: props.width, height: props.height, overflow: 'hidden' }}>
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
