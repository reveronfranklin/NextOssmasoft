const rules =  {
    codigoBanco: {
        required: 'Este campo es requerido'
    },
    codigoInterbancario: {
        required: 'Este campo es requerido',
        pattern:{
            value: /^[0-9]+$/,
            message: 'Solo se admiten numeros'
        },
        min: {
            value: 1,
            message: 'Mínimo 1 digitos'
        },
        maxLength: {
            value: 5,
            message: 'Máximo 5 digitos'
        }
    },
    nombre: {
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