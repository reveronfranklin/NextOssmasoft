const rules =  {
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
}

const getRules = () => {
    return rules
}

export default getRules