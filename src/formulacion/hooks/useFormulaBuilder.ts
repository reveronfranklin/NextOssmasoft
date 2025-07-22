import { useState, useEffect, useCallback } from 'react';
import { useVariablesAndFunctions } from './useVariablesAndFunctions';
import { useFormulaCRUD } from './useFormulaCRUD'
import { useFormulaValidation } from './useFormulaValidation';
import useInvalidateReset from 'src/hooks/useInvalidateReset';

import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'
import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'

// import { IFormulaBase } from './../interfaces/formula/FormulaBase.interfaces';

interface FormulaBuilderServices {
  formulaService: IFormulaService;
  variableService: IVariableService;
}

const useFormulaBuilder = (services: FormulaBuilderServices) => {
  //estados básicos
  const [formula, setFormula] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFormula, setSelectedFormula] = useState<any>({
    id: 0,
    descripcion: '',
    formula: '',
    estado: '',
    fechaIns: '',
    usuarioInsert: 0,
    fechaUpd: '',
    usuarioUpdate: null,
    codigoEmpresa: 0,
  });
  const [loading, setLoading] = useState({
    variables: false,
    functions: false,
  });

  //hooks perzonalizados
  const invalidateReset = useInvalidateReset();
  const { variables, functions } = useVariablesAndFunctions(services);
  const { syntaxError, validationResult, validateFormula, resetValidation } = useFormulaValidation();
  const {
    onDeleteFormula,
    onUpdateFormula,
    onCreateFormula,
    result, setResult,
    error, setError,
  } = useFormulaCRUD({
    formulaService: services.formulaService,
    invalidateTable: () => invalidateReset({ tables: ['formulasTable'] }),
  });

  //Efectos
  useEffect(() => {
    if (selectedFormula ) {
      if (selectedFormula.formula !== formula) {
        setFormula(selectedFormula?.formula || '');
        setDescription(selectedFormula?.descripcion || '');
      }
    }
  }, [selectedFormula]);

  useEffect(() => {
    if (description !== null && description !== '') {
      setDescription(description);
    }
  }, [description]);

  // Lógica de scope (simplificada)
  const getScope = useCallback(() => {
    const scope: Record<string, any> = {};

    // Aquí iría la lógica para agregar variables/funciones al scope
    return scope;
  }, [variables, functions]);

  // Handlers optimizados
  const handleCreate = useCallback(async () => {
    const isValid = validateFormula(formula, getScope());
    if (!isValid) return;

    const createdFormula = await onCreateFormula({
      formula: formula,
      descripcion: description,
      usuarioInsert: 1,
      codigoEmpresa: 13,
    });

    if (createdFormula) {
      setSelectedFormula(createdFormula);
    }
  }, [formula, description]);

  const handleUpdate = useCallback(async () => {
    const isValid = validateFormula(formula, getScope());
    if (!isValid) return;

    const updatedFormula = await onUpdateFormula({
      id: selectedFormula.id,
      descripcion: description,
      formula: formula,
      usuarioInsert: 1,
      codigoEmpresa: 13,
    });

    if (updatedFormula) {
      setSelectedFormula(updatedFormula);
    }
  }, [formula, description, selectedFormula]);

  const handleDelete = useCallback(async () => {
    if (!selectedFormula.id) {
      setError('ID de la fórmula no proporcionado.');

      return;
    }

    await onDeleteFormula(selectedFormula.id);
  }, [selectedFormula, onDeleteFormula]);

  //limpiar formularios
  const clearFormula = useCallback(() => {
    setDescription('');
    setFormula('');
    setResult(null);
    setError(null);
    resetValidation();
    setSelectedFormula({
      id: 0,
      descripcion: '',
      formula: '',
      estado: '',
      fechaIns: '',
      usuarioInsert: 0,
      fechaUpd: '',
      usuarioUpdate: null,
      codigoEmpresa: 0,
    });
  }, []);

  return {
    description,
    setDescription,
    formula,
    setFormula,
    variables,
    functions,
    result,
    error,
    syntaxError,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearFormula,
    selectedFormula,
    setSelectedFormula
  };
};

export default useFormulaBuilder;
