import { FIELD_OPTIONS, LOGIC_OPERATORS, OPERATOR_OPTIONS } from '../constants';

const VALID_FIELDS          = FIELD_OPTIONS.map(item => item.value);
const COMPARISON_OPERATORS  = OPERATOR_OPTIONS.map(item => item.value);

const isLastWordAField = (lastWord: string) => VALID_FIELDS.includes(lastWord);

export const validateOperatorAddition = (
  currentQuery: string,
  newOperator: 'AND' | 'OR' | '(' | ')'
): { isValid: boolean; error?: string } => {
  const trimmedPrev = currentQuery.trim();
  const words = trimmedPrev.split(' ');
  const lastWord = words[words.length - 1];

  // 1. No empezar con AND, OR o cerrar paréntesis
  if (!trimmedPrev && (newOperator === 'AND' || newOperator === 'OR' || newOperator === ')')) {
    return { isValid: false, error: `No se puede iniciar con el operador "${newOperator}"` };
  }

  // 2. No duplicar operadores lógicos (AND AND, OR OR, AND OR)
  const isLastItemLogic = lastWord === 'AND' || lastWord === 'OR';
  if (isLastItemLogic && (newOperator === 'AND' || newOperator === 'OR')) {
    return { isValid: false, error: 'No puedes poner dos operadores lógicos seguidos.' };
  }

  // 3. No permitir paréntesis vacíos ()
  if (lastWord === '(' && newOperator === ')') {
    return { isValid: false, error: 'Un paréntesis no puede estar vacío.' };
  }

  // 4. No permitir operador lógico después de abrir paréntesis (e.g., "( AND")
  if (lastWord === '(' && (newOperator === 'AND' || newOperator === 'OR')) {
    return { isValid: false, error: `No puede haber un "${newOperator}" después de abrir un paréntesis.` };
  }

  // 5. No permitir cerrar paréntesis si no hay una regla antes (e.g., "AND )")
  if (isLastItemLogic && newOperator === ')') {
    return { isValid: false, error: 'Debe haber una condición antes de cerrar el paréntesis.' };
  }

  // 6. Validar balance de paréntesis (opcional pero recomendado)
  if (newOperator === ')') {
    const openCount = (currentQuery.match(/\(/g) || []).length;
    const closeCount = (currentQuery.match(/\)/g) || []).length;
    if (closeCount >= openCount) {
      return { isValid: false, error: 'No hay un paréntesis de apertura correspondiente.' };
    }
  }

  // 7. No permitir abrir un paréntesis inmediatamente después de una regla sin un operador lógico
  // Ejemplo: "item = 1 (" -> ERROR (debe ser "item = 1 AND (")
  if (trimmedPrev && !isLastItemLogic && lastWord !== '(' && newOperator === '(') {
    return { isValid: false, error: 'Debe haber un operador lógico (AND/OR) antes de abrir un paréntesis.' };
  }

  // 9. No permitir un número excesivo de paréntesis (Seguridad)
  const openCount = (currentQuery.match(/\(/g) || []).length;
  if (newOperator === '(' && openCount >= 10) {
    return { isValid: false, error: 'Has alcanzado el límite máximo de paréntesis anidados.' };
  }

  // 10 Si intentas poner AND o OR, revisamos que no vengas de un "=" o ">" sin valor.
  if ((newOperator === 'AND' || newOperator === 'OR') && COMPARISON_OPERATORS.includes(lastWord)) {
    return {
      isValid: false,
      error: 'La condición anterior está incompleta. Falta ingresar un valor.'
    }
  }

  // 11. Si el último elemento es un campo, no puedes poner AND/OR ni operador de comparacion sin antes completar la condición
  if (isLastWordAField(lastWord) && (newOperator === 'AND' || newOperator === 'OR')) {
    return {
      isValid: false,
      error: `La condición "${lastWord}" está incompleta. Falta el operador (ejemplo: =, <>, >, < ).`
    }
  }

  return { isValid: true };
};

export const validateRuleAddition = (
  currentQuery: string
): { isValid: boolean; error?: string } => {
  const trimmedPrev = currentQuery.trim();
  if (!trimmedPrev) return { isValid: true }; // Si está vacío, puede ir una regla

  const words = trimmedPrev.split(' ');
  const lastWord = words[words.length - 1];

  // 1. No permitir regla después de un operador lógico sin completar la condición
  if (isLastWordAField(lastWord) || COMPARISON_OPERATORS.includes(lastWord)) {
    return {
      isValid: false,
      error: 'La última condición está incompleta. Termínela antes de agregar una nueva.'
    };
  }

  // 2. No permitir regla después de otra regla (Falta un operador)
  // Detectamos si lo último no fue un operador o un paréntesis de apertura
  const operators = [...LOGIC_OPERATORS, '('];
  const isLastItemOperator = operators.includes(lastWord);

  // Si el último elemento NO es un operador y NO es un paréntesis abierto,
  // asumimos que lo anterior fue una regla o un paréntesis de cierre.
  if (!isLastItemOperator && lastWord !== '(') {
    return {
      isValid: false,
      error: 'Debe agregar un operador (AND / OR) antes de una nueva condición.'
    };
  }

  // 3. No permitir regla inmediatamente después de cerrar paréntesis
  if (lastWord === ')') {
    return {
      isValid: false,
      error: 'No puede ir una condición directamente después de ")". Use AND u OR.'
    };
  }

  return { isValid: true };
};

export const validateDataIntegrity = (
  field: any,
  operator: any,
  value: any
): { isValid: boolean; error?: string } => {
  if (!field || !operator || value === '' || value === null || value === undefined) {
    return { isValid: false, error: 'Todos los campos son necesarios para crear la regla.' };
  }

  if (field.type === 'number') {
    const cleanValue = String(value).trim();
    if (isNaN(Number(cleanValue)) || cleanValue === '') {
      return { isValid: false, error: `El campo "${field.label}" espera un valor numérico.` + (field.label === 'Sueldo' ? ` (los decimales son permitidos con '.' en lugar de ',')` : '') };
    }

    if (field.label === 'Cedula' && !Number.isInteger(Number(cleanValue))) {
      return { isValid: false, error: 'La Cédula debe ser un número entero.' };
    }

    if (field.label === 'Sueldo' && Number(cleanValue) < 0) {
      return { isValid: false, error: 'El sueldo no puede ser negativo.' };
    }
  }

  if (field.type === 'string' && String(value).trim().length < 1) {
    return { isValid: false, error: 'El valor de la condición no puede estar vacío.' };
  }

  return { isValid: true };
};

export const validateFinalQuery = (query: string): { isValid: boolean; error?: string } => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { isValid: false, error: 'La consulta no puede estar vacía.' };
  }

  const words = trimmedQuery.split(' ');
  const lastWord = words[words.length - 1];
  const operatorsValues = ['=', '>', '<', '<>'];

  // 1. Verificar que no termine en un operador lógico o paréntesis de apertura
  const illegalEndings = ['AND', 'OR', '('];
  if (illegalEndings.includes(lastWord)) {
    return {
      isValid: false,
      error: `Syntax Error: La consulta no puede terminar con "${lastWord}".`
    };
  }

  // 2. Verificar balance final de paréntesis
  const openCount = (trimmedQuery.match(/\(/g) || []).length;
  const closeCount = (trimmedQuery.match(/\)/g) || []).length;

  if (openCount !== closeCount) {
    return {
      isValid: false,
      error: `Syntax Error: Paréntesis desbalanceados. (Abiertos: ${openCount}, Cerrados: ${closeCount})`
    };
  }

  // 3. Verificar que no haya paréntesis vacíos "()" (Doble check de seguridad)
  if (trimmedQuery.includes('()')) {
    return { isValid: false, error: 'Syntax Error: Se detectaron paréntesis vacíos.' };
  }

  // 4. Verificar que no termine en un operador incompleto
  if (operatorsValues.includes(lastWord)) {
    return { isValid: false, error: 'Syntax Error: La consulta termina en un operador de comparación incompleto.' };
  }

  // 5. Verificar que no termine en un campo sin condición
  if (isLastWordAField(lastWord)) {
    return { isValid: false, error: 'Syntax Error: La consulta termina en un nombre de columna sin condición.' };
  }

  return { isValid: true };
};

export const buildSecureQuery = (query: string): { finalQuery: string; error?: string } => {
  const sanitized = query.replace(/\s+/g, ' ').trim();

  if (!sanitized) return { finalQuery: '', error: 'La consulta no puede estar vacía.' };

  // 1. Separar la primera regla del resto
  const firstLogicMatch = sanitized.match(/\s+(AND|OR)\s+/i);
  let payrollPart = "";
  let remainderPart = "";

  if (firstLogicMatch && firstLogicMatch.index !== undefined) {
    payrollPart = sanitized.substring(0, firstLogicMatch.index).trim();
    remainderPart = sanitized.substring(firstLogicMatch.index).trim();
  } else {
    payrollPart = sanitized;
  }

  // 2. Validar que empiece con la nómina
  const payrollRegex = /^CODIGO_TIPO_NOMINA\s*=\s*['"]?\w+['"]?/i;
  if (!payrollRegex.test(payrollPart)) {
    return {
      finalQuery: '',
      error: 'La consulta debe iniciar con "CODIGO_TIPO_NOMINA = [valor]"'
    };
  }

  // 3. Blindaje Final
  if (remainderPart) {
    // Extraemos el resto sin el AND/OR inicial que puso el usuario
    const restWithoutOperator = remainderPart.replace(/^(AND|OR)\s+/i, "").trim();

    // Verificamos si ya tiene paréntesis externos para no ensuciar tanto el string
    const hasParentheses = restWithoutOperator.startsWith('(') && restWithoutOperator.endsWith(')');
    const finalRemainder = hasParentheses ? restWithoutOperator : `(${restWithoutOperator})`;

    // Retornamos la estructura blindada (Forzamos AND intermedio)
    return {
      finalQuery: `(${payrollPart}) AND ${finalRemainder}`
    };
  }

  return { finalQuery: `(${payrollPart})` };
};