import { useState, useEffect, useCallback } from 'react';
import { useVariablesAndFunctions } from './useVariablesAndFunctions';
import { useFormulaCRUD } from './useFormulaCRUD'
import { useFormulaValidation } from './useFormulaValidation';
import useInvalidateReset from 'src/hooks/useInvalidateReset';

import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'
import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'
import { randomInt } from 'mathjs';

// import { IFormulaBase } from './../interfaces/formula/FormulaBase.interfaces';

interface FormulaBuilderServices {
  formulaService: IFormulaService;
  variableService: IVariableService;
}

const useFormulaBuilder = (services: FormulaBuilderServices) => {
  //estados de variables y funciones
  const [editingItem, setEditingItem] = useState<any>({});

  //estados básicos formulación
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
  const invalidateReset = useInvalidateReset();
  const { variables, setVariables, functions, setFunctions } = useVariablesAndFunctions(services);
  const { syntaxError, validateFormula, resetValidation } = useFormulaValidation();
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

  useEffect(() => {
    if (description !== null && description !== '') {
      setDescription(description);
    }
  }, [description]);

  const getFormulaFromInput = useCallback((formula: string) => {
    const regex = /\[([^\]]+)\]/g;
    const found = [];
    let match;

    while ((match = regex.exec(formula)) !== null) {
      found.push(match[1]);
    }

    return Array.from(new Set(found));
  }, []);

  const getScope = useCallback((formula: string) => {
    const scope: Record<string, any> = {};
    const usedVars = getFormulaFromInput(formula);

    usedVars.forEach(varName => {
      const variable = variables.find((v: any) => v.code === varName);
      if (variable) scope[varName] = randomInt(1, 20);
    });

    return scope;
  }, [variables, functions, getFormulaFromInput]);

  const handleCreate = useCallback(async (currentFormula: string): Promise<void> => {
    const isValid = validateFormula(currentFormula, getScope(currentFormula));
    if (!isValid) return;

    const createdFormula = await onCreateFormula({
      formula: currentFormula,
      descripcion: description,
      usuarioInsert: 1,
      codigoEmpresa: 13, //TODO::revisar
    });

    if (createdFormula) {
      setSelectedFormula(createdFormula);
    }
  }, [description, getScope, onCreateFormula, validateFormula]);

  const handleUpdate = useCallback(async (currentFormula: string): Promise<void> => {
    const isValid = validateFormula(currentFormula, getScope(currentFormula));
    if (!isValid) return;

    const updatedFormula = await onUpdateFormula({
      id: selectedFormula.id,
      descripcion: description,
      formula: currentFormula,
      usuarioInsert: 1,
      codigoEmpresa: 13, //TODO:revisar
    });

    if (updatedFormula) {
      setSelectedFormula(updatedFormula);
    }
  }, [description, selectedFormula, getScope, onUpdateFormula, validateFormula]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!selectedFormula.id) {
      setError('ID de la fórmula no proporcionado.');

      return;
    }

    await onDeleteFormula(selectedFormula.id);
  }, [selectedFormula, onDeleteFormula]);

  useEffect(() => {
    console.log('revisar') //TODO revisa
    if (editingItem) {
      setDescription(editingItem.descripcion);
      setSelectedFormula(editingItem);
    }
  }, [editingItem]);

  const clearFormula = useCallback(() => {
    setDescription('');
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
    variables, setVariables,
    functions, setFunctions,
    result,
    error,
    syntaxError,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearFormula,
    selectedFormula,
    setSelectedFormula,
    editingItem,
    setEditingItem
  };
};

export default useFormulaBuilder;
