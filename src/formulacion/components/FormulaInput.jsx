import React, { useRef, forwardRef, useImperativeHandle, useState } from 'react'; // Importa useState
import { TextField, FormHelperText } from '@mui/material';

const FormulaInput = forwardRef(({ formula, setFormula, syntaxError }, ref) => {
  const localInputRef = useRef(null);
  // Estado local para errores de validación personalizados
  const [customValidationError, setCustomValidationError] = useState(null);

  useImperativeHandle(ref, () => ({
    inputElement: localInputRef.current?.querySelector('textarea'),

    insertText: (value) => {
      const input = localInputRef.current?.querySelector('textarea');
      if (input) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        let newFormula = '';
        let newCursorPos = start + value.length;

        const isFunctionWithParen = value.endsWith('(');

        if (isFunctionWithParen) {
          newFormula = formula.substring(0, start) + value + ')' + formula.substring(end);
          newCursorPos = start + value.length; // Cursor justo después del '('
        } else {
          newFormula = formula.substring(0, start) + value + formula.substring(end);
          newCursorPos = start + value.length;
        }

        // Antes de establecer la nueva fórmula, ejecutar validaciones aquí también
        // Por ejemplo, para operadores seguidos:
        // Si el valor insertado es un operador y el carácter anterior también lo es, se puede prevenir.
        const operators = ['+', '-', '*', '/', '^']; // Define tus operadores

        const lastCharBeforeCursor = formula.substring(start - 1, start);
        const insertedIsOperator = operators.includes(value);
        const lastCharIsOperator = operators.includes(lastCharBeforeCursor);

        if (insertedIsOperator && lastCharIsOperator) {
            setCustomValidationError("No se pueden insertar dos operadores seguidos.");
            // No actualizamos la fórmula, evitando el error.
            return;
        } else {
            setCustomValidationError(null); // Limpiar error si la inserción es válida
        }

        setFormula(newFormula);

        setTimeout(() => {
          input.focus();
          input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }
    },
  }));

  const handleInputChange = (e) => {
    const newText = e.target.value;
    const cursorPosition = e.target.selectionStart; // Posición del cursor después del cambio

    // 1. Validación: No permitir paréntesis de cierre ')' manualmente
    // Comprueba si el cambio introdujo un ')' y si NO fue parte de un '()' automático
    const lastCharTyped = newText.charAt(cursorPosition - 1);
    if (lastCharTyped === ')') {
        // Verifica si el '(' correspondiente no fue insertado automáticamente (por ejemplo, al insertar una función)
        // O si el ')' es el último carácter y no hay un '(' antes de él en la posición anterior al cursor.
        // Esta validación es compleja porque el ')' puede ser válido si viene de un '()' automático.
        // La estrategia más simple es: si el usuario TECLEA ')' manualmente, prevenirlo.
        // Esto se maneja mejor en `onKeyDown`.

        // Por ahora, solo detectamos si un ')' apareció en el input que el usuario no insertó automáticamente.
        // Si el tamaño ha crecido en 1 y el último carácter es ')', asumimos que se tecleó.
        if (newText.length > formula.length && lastCharTyped === ')' && newText.lastIndexOf(')') === cursorPosition - 1) {
            // Podríamos intentar removerlo, pero lo ideal es prevenirlo en `onKeyDown`.
            // Para `onChange`, solo podemos notificar o revertir.
            // setCustomValidationError("No puedes insertar paréntesis de cierre manualmente. Se cierran automáticamente.");
            // setFormula(formula); // Revertir al estado anterior
            // return;
        }
    }

    // 2. Validación: No dos operadores seguidos (durante la escritura)
    const operators = ['+', '-', '*', '/', '^'];
    // Obtener el último carácter de la fórmula ANTES del nuevo texto
    const formulaBeforeChange = formula.substring(0, cursorPosition - (newText.length - formula.length)); // Esto obtiene la parte de la fórmula ANTES del carácter que se está evaluando
    const lastCharOfOldFormula = formulaBeforeChange.charAt(formulaBeforeChange.length - 1);

    const insertedChar = newText.charAt(cursorPosition - 1); // Carácter que acaba de ser insertado/modificado

    if (operators.includes(insertedChar) && operators.includes(lastCharOfOldFormula)) {
        setCustomValidationError("No se pueden escribir dos operadores seguidos.");
        // Si hay un error, no actualizamos la fórmula para prevenir la entrada inválida.
        // O podrías actualizarla y mostrar el error, dejando que la validación del parser lo maneje.
        // Aquí decidimos prevenirlo para una mejor UX.
        e.preventDefault(); // Esto no funciona en onChange para prevenir, solo en onKeyDown.
        // La mejor manera de prevenir en onChange es no llamar a setFormula.
        return; // Detiene la actualización del estado si es un operador doble
    } else {
        setCustomValidationError(null); // Limpiar el error si la entrada es válida
    }

    setFormula(newText); // Si las validaciones pasan, actualiza la fórmula
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const operators = ['+', '-', '*', '/', '^']; // Define tus operadores

    // Validación 1: No permitir paréntesis de cierre ')' manualmente
    if (e.key === ')') {
      // Previene la inserción si el usuario teclea ')'
      setCustomValidationError("El paréntesis de cierre ')' se añade automáticamente.");
      e.preventDefault(); // Previene que el carácter se escriba
      return; // No ejecutar más lógica para este evento
    }

    // Validación 2: Cierre automático de paréntesis '('
    if (e.key === '(') {
      e.preventDefault(); // Evita que se escriba el '(' por defecto
      const newFormula = formula.substring(0, start) + '(' + ')' + formula.substring(end);
      setFormula(newFormula);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + 1, start + 1);
      }, 0);
      setCustomValidationError(null); // Limpiar cualquier error previo
      return; // No ejecutar más lógica para este evento
    }

    // Validación 3: No dos operadores seguidos (para teclas de operador)
    if (operators.includes(e.key)) {
      const lastCharBeforeCursor = formula.substring(start - 1, start);
      if (operators.includes(lastCharBeforeCursor)) {
        setCustomValidationError("No se pueden insertar dos operadores seguidos.");
        e.preventDefault(); // Previene que el segundo operador se escriba
        return; // No ejecutar más lógica para este evento
      }
      setCustomValidationError(null); // Limpiar error si la entrada es válida
    }

    // Limpiar el error personalizado si se teclea algo válido después de un error
    if (customValidationError && !operators.includes(e.key) && e.key !== '(' && e.key !== ')') {
        setCustomValidationError(null);
    }
  };

  const currentError = syntaxError || customValidationError; // Muestra el error de sintaxis o el personalizado

  return (
    <div style={{ marginBottom: '15px' }}>
      <TextField
        ref={localInputRef}
        value={formula}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Añade el manejador de teclado
        placeholder="Escribe tu fórmula aquí, o selecciona variables, funciones y operadores..."
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        label="Fórmula"
        error={!!currentError} // Usa el error combinado
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '1.2em',
            // minHeight: '100px',
            resize: 'vertical',
          },
          '& .MuiOutlinedInput-root': {
            borderColor: currentError ? 'red !important' : undefined,
            boxShadow: currentError ? '0 0 5px rgba(255, 0, 0, 0.3)' : 'none',
          },
        }}
      />
      {currentError && (
        <FormHelperText sx={{ color: 'error.main', fontSize: '0.9em', mt: 0.5 }}>
          Error: {currentError}
        </FormHelperText>
      )}
    </div>
  );
});

export default FormulaInput;