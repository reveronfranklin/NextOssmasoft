import React, { useRef, useEffect } from 'react';

const FormulaInput = ({ formula, setFormula, syntaxError }) => {
  const inputRef = useRef(null);

  // Expone la ref para que el padre pueda manipular el cursor
  // Esto es un patrón menos común, pero útil para esta UX específica
  useEffect(() => {
    // Si necesitas que el padre acceda directamente al inputRef, podrías usar useImperativeHandle
    // Por ahora, simplemente lo usamos internamente.
  }, []);

  const handleInputChange = (e) => {
    setFormula(e.target.value);
  };

  // Función interna para insertar texto en la posición del cursor
  const insertText = (value) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newFormula = formula.substring(0, start) + value + formula.substring(end);
      setFormula(newFormula);

      // Mueve el cursor a la posición correcta
      setTimeout(() => { // Pequeño delay para asegurar que el DOM se actualice
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + value.length, start + value.length);
      }, 0);
    }
  };

  // Expone la función insertText para ser llamada por el padre (ej. vía un prop)
  // Esto se hará pasando 'insertText' como prop al componente principal.
  // Alternativamente, se podría usar forwardRef y useImperativeHandle
  // Para este ejemplo, simplificamos y el componente padre tendrá la función de insertar.

  return (
    <div style={{ marginBottom: '15px' }}>
      <textarea
        ref={inputRef}
        value={formula}
        onChange={handleInputChange}
        placeholder="Escribe tu fórmula aquí, o selecciona variables y operadores..."
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '1.2em',
          border: `1px solid ${syntaxError ? 'red' : '#ddd'}`,
          borderRadius: '6px',
          minHeight: '100px',
          resize: 'vertical',
          boxShadow: syntaxError ? '0 0 5px rgba(255, 0, 0, 0.3)' : 'none',
        }}
      />
      {syntaxError && (
        <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
          Error de sintaxis: {syntaxError}
        </p>
      )}
    </div>
  );
};

export default FormulaInput;