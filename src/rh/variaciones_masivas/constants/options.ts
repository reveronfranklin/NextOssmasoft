import { AutocompleteOption, FieldRestriction } from '../interfaces'

const FIELD_EXCEPTIONS: Record<string, string> = {
  'Tipo Nomina': 'CODIGO_TIPO_NOMINA',
  'Cargos': 'DESCRIPCION_CARGO',
  'Estado Civil': 'ESTADO_CIVIL',
  'Nacionaidad': 'NACIONALIDAD'
}

const ALIAS_EXCEPTIONS: Record<string, string> = {
  'Estado Civil': 'ESTADO_CIVIL_ID',
}

const NUMBER_FIELDS = ['Sueldo', 'Cedula', 'Estado Civil', 'Tipo Nomina']

const baseItems = [
  'Sueldo', 'Sexo', 'Cargos', 'Sector', 'Programa',
  'Subprograma', 'Proyecto', 'Actividad', 'Oficina',
  'Departamento', 'Nacionaidad', 'Estado Civil',
  'Tipo Nomina', 'Nombre', 'Apellido', 'Cedula'
]

export const FIELD_OPTIONS: AutocompleteOption[] = baseItems.map(item => ({
  label: item,
  value: FIELD_EXCEPTIONS[item] || item.toUpperCase().replace(/\s+/g, '_'),
  type: NUMBER_FIELDS.includes(item) ? 'number' : 'string',
  sendAs: ALIAS_EXCEPTIONS[item] ?? null
}))

export const OPERATOR_OPTIONS: AutocompleteOption[] = [
  { label: 'Igual que', value: '=' },
  { label: 'Mayor que', value: '>' },
  { label: 'Menor que', value: '<' },
  { label: 'Diferente que', value: '<>' }
] as const

export const LOGIC_OPERATORS = ['AND', 'OR'] as const

export const MOVEMENT_TYPE_OPTIONS: AutocompleteOption[] = [
  { value: 'E', label: 'Especial' },
  { value: 'F', label: 'Fijo' },
  { value: 'V', label: 'Variable' }
]

export const FIRST_FIELD = 'CODIGO_TIPO_NOMINA' as const
export const MESSAGE_WARNING_QUERY = `La consulta debe iniciar obligatoriamente con el campo "CODIGO_TIPO_NOMINA" usando el operador de igualdad ("="). Ejemplo: CODIGO_TIPO_NOMINA = 1` as const

export const FIELD_RESTRICTIONS: Record<string, FieldRestriction> = {
  CODIGO_TIPO_NOMINA: {
    forcedOperator: '=',
    allowedOperators: ['=']
  },
  SEXO: {
    forcedOperator: '=',
    allowedOperators: ['=', '<>']
  },
  CEDULA: {
    forcedOperator: '=',
    allowedOperators: ['=', '<>']
  },
  DESCRIPCION_CARGO: {
    forcedOperator: '=',
    allowedOperators: ['=', '<>']
  },
  NACIONALIDAD: {
    forcedOperator: '=',
    allowedOperators: ['=', '<>']
  },
  ESTADO_CIVIL: {
    forcedOperator: '=',
    allowedOperators: ['=', '<>']
  }
}