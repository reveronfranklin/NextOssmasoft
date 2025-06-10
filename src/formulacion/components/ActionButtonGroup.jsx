import React from 'react';

const ActionButtonGroup = ({ onEvaluate, onClear }) => {
  return (
    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
      <button
        onClick={onEvaluate}
        style={{
          padding: '12px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
      >
        Evaluar Fórmula
      </button>
      <button
        onClick={onClear}
        style={{
          padding: '12px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#da190b'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
      >
        Limpiar
      </button>
    </div>
  );
};

export default ActionButtonGroup;