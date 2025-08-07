import React from 'react';

const OperatorSelector = ({ onOperatorSelect }) => {
  const operators = ['+', '-', '*', '/', '(', ')'];

return (
    <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        {operators.map((op) => (
          <button
            key={op}
            onClick={() => onOperatorSelect(op)}
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              backgroundColor: '#ffe0b2',
              border: '1px solid #ffab40',
              borderRadius: '5px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              color: '#ef6c00',
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffab40'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffe0b2'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OperatorSelector;