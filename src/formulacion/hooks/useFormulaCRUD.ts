import { useCallback, useState } from 'react';
import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces';
import { IFormulaBase } from 'src/formulacion/interfaces/formula/FormulaBase.interfaces';

interface FormulaCRUDProps {
  formulaService: IFormulaService;
  invalidateTable: () => void;
}

export const useFormulaCRUD = ({ formulaService, invalidateTable }: FormulaCRUDProps) => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResponse = (response: any) => {
    if (response.isValid) {
      setResult(response.message || 'Operación exitosa');
      invalidateTable();
    } else {
      setError(response.message || 'Error en la operación');
    }

    setTimeout(() => {
      setResult(null);
      setError(null);
    }, 2500);
  };

  const onCreateFormula = useCallback(async (
    payload: Omit<IFormulaBase, 'id' | 'fechaIns' | 'fechaUpd' | 'usuarioUpdate' | 'estado'> & {
      usuarioInsert: number;
      codigoEmpresa: number;
    }
  ) => {
    try {
      const response = await formulaService.createFormula(payload);
      handleResponse(response);

      return response.data;
    } catch (e: any) {
      setError(e.message);

      return null;
    }
  }, [formulaService.createFormula]);

  const onUpdateFormula = useCallback(async (
    payload: Omit<IFormulaBase, 'fechaIns' | 'fechaUpd' | 'usuarioUpdate' | 'estado'> & {
      id: number;
      usuarioInsert: number;
      codigoEmpresa: number;
    }
  ) => {
    try {
      const response = await formulaService.updateFormula(payload);
      handleResponse(response);

      return response.data;
    } catch (e: any) {
      setError(e.message);

      return null;
    }
  }, [formulaService.updateFormula]);

  const onDeleteFormula = useCallback(async (id: number) => {
    try {
      if (!id) {
        setError('ID de la fórmula no proporcionado.');

        return;
      }
      const response = await formulaService.deleteFormula({ id });
      handleResponse(response);
    } catch (e: any) {
      setError(e.message);
    }
  }, [formulaService.deleteFormula]);

  return {
    onCreateFormula,
    onUpdateFormula,
    onDeleteFormula,
    result, setResult,
    error, setError,
  };
};