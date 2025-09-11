import { useCallback, useState } from 'react';
import FormulaValidator from '../../shared/utils/formulaParser';

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
        const variableRegex = /\[([A-Za-z0-9_]+)\]/g;
        const variables: string[] = [];
        let match;

        while ((match = variableRegex.exec(formula)) !== null) {
          variables.push(match[1]);
        }

        scope.variables = Array.from(new Set(variables));

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