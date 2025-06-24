import { useState, useEffect, useCallback } from 'react';
import { parseAndEvaluateFormula, validateFormulaSyntax } from '../services/formulaParser'; // Asegúrate de que validateFormulaSyntax esté implementado

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const useFormulaBuilder = (initialVariables = [], initialFunctions = []) => {
  const [formula, setFormula] = useState('');
  const [variables, setVariables] = useState(initialVariables);
  // Nuevo estado para las funciones
  const [functions, setFunctions] = useState(initialFunctions);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [syntaxError, setSyntaxError] = useState(null);

  // Modifica `getScope` para incluir tanto variables como funciones
  // Math.js espera un `scope` donde las claves son los nombres/códigos
  // y los valores son los valores para las variables o las implementaciones para las funciones.
  const getScope = useCallback(() => {
    const scope = {};
    // Añadir variables al scope
    variables.forEach(v => {
      // Usamos `v.code` como la clave para el scope de mathjs
      // Asegúrate de que los valores numéricos estén convertidos si son cadenas
      scope[v.code] = typeof v.value === 'string' && !isNaN(Number(v.value)) ?
        Number(v.value) :
        v.value;
    });

    // Añadir funciones al scope
    functions.forEach(f => {
      // Aquí mapeamos el 'code' de tu función (ej: 'SUMA(') a la implementación real.
      // Si usas funciones de mathjs (como 'sum'), esto es cómo las aliasas o les das la implementación.
      // f.code.replace('(', '') remueve el paréntesis para el nombre de la función en el scope.
      // Ejemplo: si f.code es 'SUMA(', el scope tendrá `scope.SUMA = math.sum;`
      // Esto solo es necesario si las funciones personalizadas no son manejadas directamente
      // por `parseAndEvaluateFormula` o si deseas aliasar funciones de `mathjs`.
      // Para `mathjs`, normalmente no necesitas agregarlas al scope si ya son funciones built-in
      // (ej: `sum`, `max`, `min`). Si son funciones personalizadas, aquí va su lógica.

      // Ejemplo de cómo podrías añadir una implementación de función personalizada
      if (f.code === 'CALC_BONO(') {
        scope['CALC_BONO'] = (sueldo, dias) => {
          /* tu lógica */
          return sueldo * dias / 30;
        };
      }
      // Para funciones de mathjs, asegúrate de que tu `formulaParser` las maneje
      // El `formulaParser` es el lugar más adecuado para mapear "SUMA(" a `math.sum`
      // Si la función ya es reconocida por mathjs o es manejada en formulaParser,
      // no la agregues al scope aquí a menos que sea una función personalizada JS.
    });

    return scope;
  }, [variables, functions]); // Añade `functions` como dependencia

  const debouncedValidateSyntax = useCallback(
    debounce((currentFormula, currentScope) => {
      // Es crucial que validateFormulaSyntax también reciba el scope
      // para verificar si las variables/funciones existen.
      // Si validateFormulaSyntax no está implementado, esta línea causará un error.
      // const err = validateFormulaSyntax(currentFormula, currentScope);
      const err = null // Mantengo el null temporalmente si no tienes la implementación
      setSyntaxError(err);
      if (err) {
        setResult(null);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const currentScope = getScope(); // Obtén el scope actualizado
    debouncedValidateSyntax(formula, currentScope); // Pasa el scope al validador
    setError(null);
  }, [formula, debouncedValidateSyntax, getScope]); // Añade `getScope` como dependencia

  const evaluateCurrentFormula = useCallback(() => {
    if (syntaxError) {
      setError(`Corrige los errores de sintaxis antes de evaluar: ${syntaxError}`);
      setResult(null);
      return;
    }

    if (!formula.trim()) {
      setError('La fórmula no puede estar vacula.');
      setResult(null);
      return;
    }

    try {
      const currentScope = getScope();
      // parseAndEvaluateFormula debe poder manejar el scope completo
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

  const updateVariableValue = useCallback((code, newValue) => { // Cambiado de 'name' a 'code' para consistencia
    setVariables(prev => prev.map(v => v.code === code ? {
      ...v,
      value: newValue
    } : v));
  }, []);

  // Nuevas funciones para manejar el estado de las funciones
  const addFunction = useCallback((newFunc) => {
    setFunctions(prev => [...prev, newFunc]);
  }, []);

  const updateFunction = useCallback((code, newDefinition) => {
    setFunctions(prev => prev.map(f => f.code === code ? {
      ...f,
      ...newDefinition // Permite actualizar cualquier propiedad de la función
    } : f));
  }, []);

  return {
    formula,
    setFormula,
    variables,
    functions, // Expone las funciones también
    result,
    error,
    syntaxError,
    evaluateCurrentFormula,
    clearFormula,
    addVariable,
    updateVariableValue,
    addFunction, // Expone las nuevas funciones
    updateFunction, // Expone las nuevas funciones
  };
};

export default useFormulaBuilder;

// import { useState, useEffect, useCallback } from 'react';
// import { parseAndEvaluateFormula, validateFormulaSyntax } from '../services/formulaParser';

// const debounce = (func, delay) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), delay);
//   };
// };

// const useFormulaBuilder = (initialVariables = []) => {
//   const [formula, setFormula] = useState('');
//   const [variables, setVariables] = useState(initialVariables);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [syntaxError, setSyntaxError] = useState(null);

//   const getScope = useCallback(() => {
//     return variables.reduce((acc, v) => {
//       acc[v.name] = v.value;
//       return acc;
//     }, {});
//   }, [variables]);

//   const debouncedValidateSyntax = useCallback(
//     debounce((currentFormula) => {
//       // const err = validateFormulaSyntax(currentFormula);
//       const err = null
//       setSyntaxError(err);
//       if (err) {
//         setResult(null);
//       }
//     }, 500),
//     []
//   );

//   useEffect(() => {
//     debouncedValidateSyntax(formula);
//     setError(null);
//   }, [formula, debouncedValidateSyntax]);

//   const evaluateCurrentFormula = useCallback(() => {
//     if (syntaxError) {
//       setError(`Corrige los errores de sintaxis antes de evaluar: ${syntaxError}`);
//       setResult(null);
//       return;
//     }

//     if (!formula.trim()) {
//       setError('La fórmula no puede estar vacía.');
//       setResult(null);
//       return;
//     }

//     try {
//       const currentScope = getScope();
//       const calculatedResult = parseAndEvaluateFormula(formula, currentScope);
//       setResult(calculatedResult);
//       setError(null);
//     } catch (e) {
//       setError(e.message);
//       setResult(null);
//     }
//   }, [formula, getScope, syntaxError]);

//   const clearFormula = useCallback(() => {
//     setFormula('');
//     setResult(null);
//     setError(null);
//     setSyntaxError(null);
//   }, []);

//   const addVariable = useCallback((newVar) => {
//     setVariables(prev => [...prev, newVar]);
//   }, []);

//   const updateVariableValue = useCallback((name, newValue) => {
//     setVariables(prev => prev.map(v => v.name === name ? {
//       ...v,
//       value: newValue
//     } : v));
//   }, []);

//   return {
//     formula,
//     setFormula,
//     variables,
//     result,
//     error,
//     syntaxError,
//     evaluateCurrentFormula,
//     clearFormula,
//     addVariable,
//     updateVariableValue,
//   };
// };

// export default useFormulaBuilder;