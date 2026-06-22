import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'
import ReporteBm1View from 'src/Bm/ReporteBM1/views/ReporteBm1View'

const ReporteBm1Page = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  return (
    <DatePickerWrapper>
      <PageHeader
        title={
          <Typography variant='h5'>
            Reporte BM1
          </Typography>
        }
      />
      <ReporteBm1View popperPlacement={popperPlacement} />
    </DatePickerWrapper>
  )
}

export default ReporteBm1Page
