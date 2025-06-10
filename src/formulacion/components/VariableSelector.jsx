// src/components/VariableSelector.jsx
import React from 'react';

const VariableSelector = ({ variables, onVariableSelect }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Variables Disponibles:</h3>
      {variables.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {variables.map((variable) => (
            <button
              key={variable.name}
              onClick={() => onVariableSelect(variable.name)}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                backgroundColor: '#e0f7fa',
                border: '1px solid #b2ebf2',
                borderRadius: '5px',
                fontSize: '1em',
                fontWeight: 'bold',
                color: '#00796b',
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b2ebf2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f7fa'}
              onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {variable.name} ({variable.value})
            </button>
          ))}
        </div>
      ) : (
        <p>No hay variables definidas.</p>
      )}
    </div>
  );
};

export default VariableSelector;