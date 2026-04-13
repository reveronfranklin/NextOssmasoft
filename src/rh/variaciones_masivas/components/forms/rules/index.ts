const rules =  {
    formCreateVariacion:{
        tipoNomina: {
            required: true
        },
        concepto: {
            required: true
        },
        tipo: {
            required: true
        },
        frecuencia: {
            required: true
        },
        monto: {
            required: true
        },
        complementoConcepto: {
            required: false,
            maxLength: {
                value: 100,
                message: 'Máximo 100 caracter'
            }
        }
    },
    formSearchCriteria: {
        field: {
            required: 'El campo es requerido',
        },
        operator: {
            required: 'El operador es requerido',
        },
        value: {
            required: 'El valor es requerido',
        }
    }
} as const;

export const getRules = <T extends keyof typeof rules>(type: T) => {
    return rules[type];
}
export default getRules