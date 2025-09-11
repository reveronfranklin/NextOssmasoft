import React, {useRef, forwardRef, useImperativeHandle, useState, useEffect} from 'react';
import { TextField, FormHelperText } from '@mui/material';

const FormulaInput = forwardRef(({syntaxError, formula, setFormula}, ref) => {
  const [customValidationError, setCustomValidationError] = useState(null);
  const inputElementRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insertText: (text) => {
      const input = inputElementRef.current;

      if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd  || 0;
        const newValue = formula.substring(0, start) + text + formula.substring(end);
        setFormula(newValue);
      }
    },
    getFormulaValue: () => formula,
    setFormulaValue: (value) => setFormula(value),
  }));

  const handleInputChange = (e) => {
    const newText = e.target.value;
    console.log(newText)

    const cursorPosition = e.target.selectionStart;

    const lastCharTyped = newText.charAt(cursorPosition - 1);
    if (lastCharTyped === ')') {
      if (newText.length > formula.length && lastCharTyped === ')' && newText.lastIndexOf(')') === cursorPosition - 1) {
        // Aquí podríamos manejar la lógica para el paréntesis de cierre
      }
    }

    const doubleOperatorRegex = /[\+\-\*\/\^]{2,}/;

    if (doubleOperatorRegex.test(newText)) {
      setCustomValidationError("No se pueden escribir dos operadores seguidos.");

      return;
    } else {
      setCustomValidationError(null);
    }

    setFormula(newText);
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const operators = ['+', '-', '*', '/', '^'];

    const allowedCharsRegex = /^[0-9()+\-*/^\[\]]$/;

    if (
      !allowedCharsRegex.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)
    ) {
      setCustomValidationError("Solo se permiten números, letras, paréntesis y los operadores: " + operators.join(' '));
      e.preventDefault();

      return;
    }

    if (e.key === ')') {
      setCustomValidationError("El paréntesis de cierre ')' se añade automáticamente.");
      e.preventDefault();

      return;
    }

    if (e.key === '(') {
      e.preventDefault();
      const newFormula = formula.substring(0, start) + '(' + ')' + formula.substring(end);
      setFormula(newFormula);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + 1, start + 1);
      }, 0);
      setCustomValidationError(null);

      return;
    }

    if (operators.includes(e.key)) {
      const lastCharBeforeCursor = formula.substring(start - 1, start);
      if (operators.includes(lastCharBeforeCursor)) {
        setCustomValidationError("No se pueden insertar dos operadores seguidos.");
        e.preventDefault();

        return;
      }
      setCustomValidationError(null);
    }

    if (customValidationError && !operators.includes(e.key) && e.key !== '(' && e.key !== ')') {
      setCustomValidationError(null);
    }
  };

  useEffect(() => {
    const allowedCharsRegex = /^[0-9a-zA-Z()+\-*/^\[\]]*$/;
    const doubleOperatorRegex = /[\+\-\*\/\^]{2,}/;

    if (
      allowedCharsRegex.test(formula) &&
      !doubleOperatorRegex.test(formula)
    ) {
      setCustomValidationError(null);
    }
  }, [formula]);

  const currentError = syntaxError || customValidationError;

  return (
    <div style={{ marginBottom: '15px' }}>
      <TextField
        inputRef={inputElementRef}
        label="Fórmula"
        value={formula}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        fullWidth
        placeholder="Escribe tu fórmula aquí, o selecciona variables, funciones y operadores..."
        multiline
        rows={3}
        variant="outlined"
        error={!!currentError}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '1.2em',
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
