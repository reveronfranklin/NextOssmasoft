import { createContext, useContext } from 'react';

export const FormulaContext = createContext(null);

export const useFormulaContext = () => useContext(FormulaContext);