const rules =  {
    codigoLote: {
        required: 'Este campo es requerido',
        isNumeric: 'El codigoLote debe ser un número'
    },
    codigoOrdenPago: {
        required: 'Este campo es requerido',
        isNumeric: 'El codigoOrdenPago debe ser un número'
    },
    numeroOrdenPago: {
        required: 'Este campo es requerido'
    },
    codigoBeneficiarioOP: {
        required: 'Este campo es requerido'
    },
    monto: {
        required: 'Este campo es requerido',
        isNumeric: 'El monto debe ser un número',
        minValue: 'El monto debe ser mayor a cero',
        decimalPlaces: 'El monto debe tener hasta dos decimales'
    },
    motivo: {
        required: 'Este campo es requerido',
        minLength: {
            value: 1,
            message: 'Mínimo 1 caracter'
        },
        maxLength: {
            value: 2000,
            message: 'Máximo 2000 caracter'
        }
    }
}

const getRules = () => {
    return rules
}

export default getRules