const rules =  {
    formCreateVariacion:{
        tipoPagoId: {
            required: 'Este campo es requerido',
            isNumeric: 'El ID debe ser un número'
        },
        fechaPago: {
            required: 'Este campo es requerido',
            isTimestamp: 'Debe ser una fecha válida en formato timestamp'
        },
        codigoCuentaBanco: {
            required: 'Este campo es requerido',
            isNumeric: 'El ID debe ser un número'
        },
        titulo: {
            required: 'Este campo es requerido',
            minLength: {
                value: 1,
                message: 'Mínimo 1 caracter'
            },
            maxLength: {
                value: 200,
                message: 'Máximo 200 caracter'
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