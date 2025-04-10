const rules =  {
    codigoCuentaBanco: {
        required: 'Este campo es requerido'
    },
    codigoBanco: {
        required: 'Este campo es requerido'
    },
    tipoCuentaId: {
        required: 'Este campo es requerido'
    },
    noCuenta: {
        required: 'Este campo es requerido',
        pattern:{
            value: /^[0-9]+$/,
            message: 'Solo se admiten números'
        },
        min: {
            value: 1,
            message: 'Mínimo 1 digitos'
        },
        maxLength: {
            value: 20,
            message: 'Máximo 20 digitos'
        }
    },
    denominacionFuncionalId: {
        required: 'Este campo es requerido'
    },
    codigo: {
        pattern:{
            value: /^[0-9a-zA-Z-]+$/,
            message: 'Solo se admiten letras, números y guiones'
        },
        minLength: {
            value: 1,
            message: 'Mínimo 1 caracter'
        },
        maxLength: {
            value: 200,
            message: 'Máximo 200 caracter'
        }
    },
    principal: {
        pattern:{
            value: /^(true|false)$/,
            message: 'Permitido SI (true) y NO (false)'
        }
    },
    recaudadora: {
        pattern:{
            value: /^(true|false)$/,
            message: 'Permitido SI (true) y NO (false)'
        }
    }
}

const getRules = () => {
    return rules
}

export default getRules