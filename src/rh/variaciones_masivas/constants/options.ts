import { AutocompleteOption } from '../interfaces'

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
] as const;

export const LOGIC_OPERATORS = ['AND', 'OR'] as const;