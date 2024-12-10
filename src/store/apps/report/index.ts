import { createSlice } from '@reduxjs/toolkit'

export const reportViewSlice = createSlice({
  name: 'reportView',
  initialState: {
    verReportViewActive:false,
    reportName:'/ExcelFiles/report.pdf',
  },
  reducers: {
    setVerReportViewActive:(state,action)=>{
      state.verReportViewActive=action.payload;
    },
    setReportName:(state,action)=>{
      state.reportName=action.payload;
    }
  }
});

export const {
  setVerReportViewActive,
  setReportName,
} = reportViewSlice.actions;
