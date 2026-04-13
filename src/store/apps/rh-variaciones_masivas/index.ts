import { createSlice } from '@reduxjs/toolkit'

export const rhVariacionesMasivasSlice = createSlice({
  name: 'rhVariacionesMasivas',
  initialState: {
    isExpandedAccordion: false as boolean,
    listEmployeeCodes: [] as number[],
    isOpenSearchCriteriaDialog: false as boolean,
    customQuery: null as string | null,
    selectedPayrollTypeCode: null as number | null
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
    },
    setselectedPayrollTypeCode:(state, action) => {
      state.selectedPayrollTypeCode = action.payload
    }
  }
})

// Selectores (Getters)
export const selectEmployeeListIsEmpty = (state: any) => {
  return state.rhVariacionesMasivas.listEmployeeCodes.length === 0
}

export const {
  setIsExpandedAccordion,
  setListEmployeeCodes,
  setIsOpenSearchCriteriaDialog,
  setCustomQuery,
  setselectedPayrollTypeCode
} = rhVariacionesMasivasSlice.actions;
