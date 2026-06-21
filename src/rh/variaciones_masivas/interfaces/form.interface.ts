import { AutocompleteOption } from "./model.interface";

export interface RuleForm {
  field: AutocompleteOption | null;
  operator: AutocompleteOption | null;
  value: any;
}

export interface VariationMovementForm {
    codigoMovNomina: number | null;
    codigoTipoNomina: number | null;
    codigoPersona: number[] | null;
    codigoConcepto: number | null;
    complementoConcepto: string | null;
    codigoEmpresa: number;
    tipo: 'E' | 'F' | 'V' | string;
    frecuenciaId: number | null;
    monto: number;
    status: 'A' | null | string;
    usuarioIns: number;
    extra1?: string;
    extra2?: string;
    extra3?: string;
}