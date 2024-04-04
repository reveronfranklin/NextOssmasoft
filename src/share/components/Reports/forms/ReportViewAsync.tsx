// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'

import CardHeader from '@mui/material/CardHeader'

import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
//import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types



import { useEffect } from 'react'
import { CardActions } from '@mui/material'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'








const ReportViewAsync = () => {
  // ** States

  const {reportName} = useSelector((state: RootState) => state.reportView)




  useEffect(() => {




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card   sx={{ maxWidth: 800 }}>
      <CardHeader title={` Reporte==>> /ExcelFiles/${reportName}`}/>
      <CardContent>
          <CardActions >
            <object data={`/ExcelFiles/${reportName}`}  type="application/pdf" width="100%" height="800px">
              <p>Unable to display PDF file. <a href={`/ExcelFiles/${reportName}`} >Download</a> instead.</p>
            </object>
          </CardActions>
      </CardContent>
    </Card>
  )


}

export default ReportViewAsync
