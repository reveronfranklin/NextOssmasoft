// src/hooks/useFormulaBuilder.js
import {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  parseAndEvaluateFormula,
  validateFormulaSyntax
} from '../services/formulaParser';

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const useFormulaBuilder = (initialVariables = []) => {
  const [formula, setFormula] = useState('');
  const [variables, setVariables] = useState(initialVariables);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [syntaxError, setSyntaxError] = useState(null);

  const getScope = useCallback(() => {
    return variables.reduce((acc, v) => {
      acc[v.name] = v.value;
      return acc;
    }, {});
  }, [variables]);

  const debouncedValidateSyntax = useCallback(
    debounce((currentFormula) => {
      const err = validateFormulaSyntax(currentFormula);
      setSyntaxError(err);
      if (err) {
        setResult(null);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedValidateSyntax(formula);
    setError(null);
  }, [formula, debouncedValidateSyntax]);

  const evaluateCurrentFormula = useCallback(() => {
    if (syntaxError) {
      setError(`Corrige los errores de sintaxis antes de evaluar: ${syntaxError}`);
      setResult(null);
      return;
    }

    if (!formula.trim()) {
      setError('La fórmula no puede estar vacía.');
      setResult(null);
      return;
    }

    try {
      const currentScope = getScope();
      const calculatedResult = parseAndEvaluateFormula(formula, currentScope);
      setResult(calculatedResult);
      setError(null);
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  }, [formula, getScope, syntaxError]);

  const clearFormula = useCallback(() => {
    setFormula('');
    setResult(null);
    setError(null);
    setSyntaxError(null);
  }, []);

  const addVariable = useCallback((newVar) => {
    setVariables(prev => [...prev, newVar]);
  }, []);

  const updateVariableValue = useCallback((name, newValue) => {
    setVariables(prev => prev.map(v => v.name === name ? {
      ...v,
      value: newValue
    } : v));
  }, []);

  return {
    formula,
    setFormula,
    variables,
    result,
    error,
    syntaxError,
    evaluateCurrentFormula,
    clearFormula,
    addVariable,
    updateVariableValue,
  };
};

export default useFormulaBuilder;