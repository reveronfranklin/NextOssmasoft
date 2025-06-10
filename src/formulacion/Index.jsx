import React, { useRef } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import useFormulaBuilder from './hooks/useFormulaBuilder';
import FormulaInput from './components/FormulaInput';
import VariableSelector from './components/VariableSelector';
import OperatorSelector from './components/OperatorSelector';
import ResultDisplay from './components/ResultDisplay';
import ActionButtonGroup from './components/ActionButtonGroup';

/**
 * Componente portable para construir fórmulas dinámicas.
 * Recibe un array de objetos `initialVariables` como prop.
 * Cada objeto en `initialVariables` debe tener las propiedades `name` y `value`.
 */
export default function FormulaBuilder({ initialVariables = [] }) {
  // 1. Lógica y Estado Central (del hook personalizado)
  // El hook `useFormulaBuilder` encapsula toda la complejidad de la gestión de estado,
  // la validación en tiempo real y la evaluación de la fórmula.
  const {
    formula,         // La cadena de texto actual de la fórmula
    setFormula,      // Función para actualizar la fórmula
    variables,       // Array de variables disponibles (nombre y valor)
    result,          // Resultado de la evaluación de la fórmula
    error,           // Errores de evaluación (ej. división por cero)
    syntaxError,     // Errores de sintaxis en tiempo real
    evaluateCurrentFormula, // Función para disparar la evaluación
    clearFormula,    // Función para limpiar la fórmula y el estado
    // addVariable,    // Podrías exponer estas funciones si la gestión
    // updateVariableValue, // de variables es también externa al componente
  } = useFormulaBuilder(initialVariables); // Se le pasan las variables iniciales

  // 2. Referencia al Componente de Entrada (para manipulación del cursor)
  // `useRef` se utiliza para obtener una referencia directa al componente `FormulaInput`.
  // Esto es crucial para poder manipular la posición del cursor o insertar texto
  // directamente en el campo de texto desde el componente padre (`FormulaBuilder`).
  const formulaInputRef = useRef(null);

  // 3. Función para Insertar Texto (Variables/Operadores) en la Fórmula
  // Esta es una función clave que une la lógica de selección con la UI del input.
  // Es pasada a `VariableSelector` y `OperatorSelector` como un `callback`.
  const insertTextIntoFormulaInput = (text) => {
    // Se verifica que la referencia y el elemento de entrada (textarea) existan.
    // `formulaInputRef.current.inputElement` accede al elemento DOM del TextField de MUI,
    // gracias a `useImperativeHandle` y `forwardRef` en `FormulaInput.jsx`.
    if (formulaInputRef.current && formulaInputRef.current.inputElement) {
      const inputElement = formulaInputRef.current.inputElement;
      const start = inputElement.selectionStart; // Posición inicial de la selección del cursor
      const end = inputElement.selectionEnd;     // Posición final de la selección del cursor

      // Se construye la nueva cadena de la fórmula, insertando el `text` en la posición del cursor.
      const newFormula = formula.substring(0, start) + text + formula.substring(end);
      setFormula(newFormula); // Se actualiza el estado de la fórmula.

      // Se utiliza `setTimeout` con 0ms para asegurar que el DOM se haya actualizado
      // antes de intentar establecer la nueva posición del cursor.
      setTimeout(() => {
        inputElement.focus(); // Se asegura que el input tenga el foco
        // Se establece la posición del cursor justo después del texto insertado.
        inputElement.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  // 4. Renderizado del Componente (la UI del constructor)
  // Aquí se organizan todos los subcomponentes de presentación,
  // pasándoles los props de estado y los callbacks necesarios.
  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}> {/* Contenedor MUI para el layout */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}> {/* Contenedor con elevación y bordes redondeados */}
        <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
          Constructor de Fórmulas
        </Typography>

        {/* Componente de entrada de la fórmula */}
        <FormulaInput
          ref={formulaInputRef} // Se pasa la ref para que el padre pueda manipular el input
          formula={formula}
          setFormula={setFormula} // Para actualizar la fórmula al escribir
          syntaxError={syntaxError} // Para mostrar errores de sintaxis en tiempo real
        />

        {/* Componente para seleccionar variables */}
        <VariableSelector
          variables={variables}
          onVariableSelect={insertTextIntoFormulaInput} // Callback para insertar la variable seleccionada
        />

        {/* Componente para seleccionar operadores */}
        <OperatorSelector
          onOperatorSelect={insertTextIntoFormulaInput} // Callback para insertar el operador seleccionado
        />

        {/* Grupo de botones de acción (Evaluar, Limpiar) */}
        <ActionButtonGroup
          onEvaluate={evaluateCurrentFormula} // Callback para evaluar la fórmula
          onClear={clearFormula}             // Callback para limpiar la fórmula
        />

        {/* Componente para mostrar el resultado o errores */}
        <ResultDisplay
          result={result}
          error={error}
        />

        {/*
        Opcional: Si quisieras que el propio componente FormulaBuilder
        tuviera una UI para gestionar variables, lo harías aquí.
        Por defecto, las variables vienen por prop `initialVariables`.
        */}
      </Paper>
    </Container>
  );
}