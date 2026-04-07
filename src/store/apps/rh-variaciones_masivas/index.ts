import { createSlice } from '@reduxjs/toolkit'

export const rhVariacionesMasivasSlice = createSlice({
  name: 'rhVariacionesMasivas',
  initialState: {
    isExpandedAccordion: false as boolean,
    listEmployeeCodes: [] as number[],
    isOpenSearchCriteriaDialog: false as boolean,
    searchCustomText: null as string | null
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
    setSearchCustomText:(state, action) => {
      state.searchCustomText = action.payload
    }
  }
})

export const {
  setIsExpandedAccordion,
  setListEmployeeCodes,
  setIsOpenSearchCriteriaDialog,
  setSearchCustomText
} = rhVariacionesMasivasSlice.actions;
