import { createSlice } from '@reduxjs/toolkit'

export const rhVariacionesMasivasSlice = createSlice({
  name: 'rhVariacionesMasivas',
  initialState: {
    isExpandedAccordion: false as boolean,
    listEmployeeCodes: [] as number[],
    isOpenSearchCriteriaDialog: false as boolean,
    customQuery: null as string | null
  },
  reducers: {
    setIsExpandedAccordion:(state, action) => {
      state.isExpandedAccordion = action.payload
    },
    setListEmployeeCodes:(state, action) => {
      state.listEmployeeCodes = action.payload
    },
    setIsOpenSearchCriteriaDialog:(state, action) => {
      state.isOpenSearchCriteriaDialog = action.payload
    },
    setCustomQuery:(state, action) => {
      state.customQuery = action.payload
    }
  }
})

export const {
  setIsExpandedAccordion,
  setListEmployeeCodes,
  setIsOpenSearchCriteriaDialog,
  setCustomQuery
} = rhVariacionesMasivasSlice.actions;
