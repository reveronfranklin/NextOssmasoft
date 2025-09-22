import { evaluate } from 'mathjs';

class FormulaValidator {
  constructor(formula, scope = {}) {
    this.formula = formula;
    this.scope = scope;
    this.errors = [];
  }

  validateParentheses() {
    const stack = [];
    for (let char of this.formula) {
      if (char === '(') stack.push(char);
      if (char === ')') {
        if (stack.pop() !== '(') {
          this.errors.push('Paréntesis no balanceados');
          break;
        }
      }
    }
    if (stack.length > 0) this.errors.push('Paréntesis no balanceados');

    return this;
  }

  validateBrackets() {
    const stack = [];
    for (let char of this.formula) {
      if (char === '[') stack.push(char);
      if (char === ']') {
        if (stack.pop() !== '[') {
          this.errors.push('Corchetes no balanceados');
          break;
        }
      }
    }
    if (stack.length > 0) this.errors.push('Corchetes no balanceados');

    return this;
  }

  validateVariables() {
    const variableRegex = /\[([A-Z0-9_]+)\]/gi;
    let match;
    const validVars = this.scope.variables || [];

    while ((match = variableRegex.exec(this.formula)) !== null) {
      if (!validVars.includes(match[1])) {
        this.errors.push(`Variable no reconocida: ${match[1]}`);
      }
    }

    return this;
  }

  validateOperators() {
    const allowed = /^[\d\s\+\-\*\/\(\)\[\]A-Z0-9_\.]+$/i;
    if (!allowed.test(this.formula)) {
      this.errors.push('Caracteres no permitidos en la fórmula');
    }

    return this;
  }

  evaluateWithMathjs() {
    try {
      const formulaForMathjs = this.formula.replace(/\[([A-Z0-9_]+)\]/gi, (_, v) => v);

      const result = evaluate(formulaForMathjs, this.scope);

      if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) {
        this.errors.push('El resultado de la fórmula no es un número válido (posible división por cero u operación inválida)');
      }

      return this;
    } catch (error) {
      this.errors.push(error.message);

      return this;
    }
  }

  build() {
    this
      .validateParentheses()
      
      // .evaluateWithMathjs()
      // .validateBrackets()
      // .validateVariables()
      // .validateOperators()

    return {
      isValid: this.errors.length === 0,
      errorMessage: this.errors.length > 0 ? this.errors.join('; ') : null
    };
  }
}

export default FormulaValidator;