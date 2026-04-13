export interface FilterEmployee {
    p_where: string | null;
}

export interface ConceptFilters {
  codigoTipoNomina?: number | null;
  automatico?: boolean;
}

export interface FieldRestriction {
  forcedOperator?: string;
  allowedOperators?: string[];
}