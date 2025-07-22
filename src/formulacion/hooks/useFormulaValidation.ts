import { useCallback, useState } from 'react';
import FormulaValidator from '../services/formulaParser';

export const useFormulaValidation = () => {
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const validateFormula = useCallback(
    (formula: string, scope: Record<string, any>) => {
      if (!formula.trim()) {
        setSyntaxError('La fórmula no puede estar vacía');
        
return false;
      }

      try {
        const validator = new FormulaValidator(formula, scope);
        const { isValid, errorMessage } = validator.build();

        if (!isValid) {
          setSyntaxError(errorMessage);
          setValidationResult(null);
          
return false;
        }

        setSyntaxError(null);
        setValidationResult('Validación Exitosa');
        
return true;
      } catch (e: any) {
        setSyntaxError(e.message);

        return false;
      }
    },
    []
  );

  const resetValidation = useCallback(() => {
    setSyntaxError(null);
    setValidationResult(null);
  }, []);

  return {
    syntaxError,
    validationResult,
    validateFormula,
    resetValidation,
  };
};