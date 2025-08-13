import { useState, useCallback } from 'react';

export default function useFormulaHistory(initialValue = '') {
  const [formula, setFormula] = useState(initialValue);
  const [history, setHistory] = useState<string[]>([]);

  const updateFormula = useCallback((newFormula: string) => {
    setFormula(prevFormula => {
      setHistory(prevHistory => (prevFormula !== newFormula ? [...prevHistory, prevFormula] : prevHistory));

    return newFormula;
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setFormula(last ?? '');

    return prev.slice(0, -1);
    });
  }, []);

  const clearAllHistory = useCallback(() => {
    setFormula('');
    setHistory([]);
  }, []);

  return {
    formula,
    setFormula: updateFormula,
    undo,
    clearAllHistory,
    history,
  };
}