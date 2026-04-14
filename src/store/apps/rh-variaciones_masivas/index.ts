import { createSlice } from '@reduxjs/toolkit';
import { Employee } from 'src/rh/variaciones_masivas/interfaces';

export const rhVariacionesMasivasSlice = createSlice({
  name: 'rhVariacionesMasivas',
  initialState: {
    isExpandedAccordion: false as boolean,
    listEmployeeCodes: [] as number[],
    isOpenSearchCriteriaDialog: false as boolean,
    customQuery: null as string | null,
    selectedPayrollTypeCode: null as number | null,
    isOpenManageEmployeeVariationDialog: false as boolean,
    selectedEmployee: {} as Employee
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
    },
    setIsOpenManageEmployeeVariationDialog:(state, action) => {
      state.isOpenManageEmployeeVariationDialog = action.payload
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload
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
  setselectedPayrollTypeCode,
  setIsOpenManageEmployeeVariationDialog,
  setSelectedEmployee
} = rhVariacionesMasivasSlice.actions;
