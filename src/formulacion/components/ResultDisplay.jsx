import React from 'react';

const ResultDisplay = ({ result, error }) => {
  if (error) {
    return (
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#ffebee',
        border: '1px solid #ef9a9a',
        borderRadius: '8px',
        color: '#d32f2f',
        fontSize: '1.1em'
        }}
      >
        <h3>Error de Evaluación:</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (result !== null) {
    return (
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        border: '1px solid #c8e6c9',
        borderRadius: '8px'
        }}
      >
        <h3>Resultado:</h3>
        <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#2e7d32' }}>{result}</p>
      </div>
    );
  }

  return null;
};

export default ResultDisplay;