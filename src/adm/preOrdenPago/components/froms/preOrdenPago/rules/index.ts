const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif'
]

const preOrdenPagoRules = {
    documentoAdjunto: {
        required: 'Debe seleccionar al menos un archivo.',
        validate: {
            isFileSelected: (value: File[] | undefined) => {
                return (value && value.length > 0) || 'Debe seleccionar al menos un archivo.';
            },
            isFileTypeValid: (value: File[] | undefined) => {
                if (!value || value.length === 0) {
                    return true;
                }

                for (const file of value) {
                    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                        return `Formato de archivo inválido. Solo se aceptan PDF y formatos de imagen (JPEG, PNG, GIF). (${file.name})`;
                    }
                }

                return true
            }
        }
    },

    nombreEmisor: {
        required: 'El nombre del emisor es requerido',
        minLength: {
            value: 3,
            message: 'Mínimo 3 caracteres'
        },
        maxLength: {
            value: 255,
            message: 'Máximo 255 caracteres'
        }
    },

    direccionEmisor: {
        required: 'La dirección es requerida',
        minLength: {
            value: 5,
            message: 'Mínimo 5 caracteres'
        },
        maxLength: {
            value: 500,
            message: 'Máximo 500 caracteres'
        }
    },

    rif: {
        required: 'El RIF es requerido',
        pattern: {
            value: /^[0-9a-zA-Z-]+$/,
            message: 'Solo se admiten letras, números y guiones (RIF)'
        },
        minLength: {
            value: 5,
            message: 'Mínimo 5 caracteres'
        },
        maxLength: {
            value: 12,
            message: 'Máximo 12 caracteres'
        }
    },

    numeroFactura: {
        required: 'El número de factura es requerido',
        pattern: {
            value: /^[0-9a-zA-Z-]+$/,
            message: 'Solo se admiten letras, números y guiones'
        },
        minLength: {
            value: 1,
            message: 'Mínimo 1 caracter'
        },
        maxLength: {
            value: 50,
            message: 'Máximo 50 caracteres'
        }
    },

    fechaEmision: {
        required: 'La fecha de emisión es requerida',
    },

    baseImponible: {
        required: 'La base imponible es requerida',
        pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Debe ser un número válido (máximo 2 decimales)'
        }
    },

    porcentajeIva: {
        required: 'El porcentaje de IVA es requerido',
        pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Debe ser un número válido'
        },
        min: {
            value: 0,
            message: 'El porcentaje no puede ser negativo'
        },
        max: {
            value: 100,
            message: 'El porcentaje no puede ser mayor a 100'
        }
    },

    iva: {
        required: 'El monto del IVA es requerido',
        pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Debe ser un número válido (máximo 2 decimales)'
        }
    },

    montoTotal: {
        required: 'El monto total es requerido',
        pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Debe ser un número válido (máximo 2 decimales)'
        }
    },

    excento: {
        required: 'El monto excento es requerido',
        pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Debe ser un número válido (máximo 2 decimales)'
        }
    },

    usuarioConectado: {
        pattern: {
            value: /^[0-9]+$/,
            message: 'Solo se admiten números'
        }
    }
}

const getPreOrdenPagoRules = () => {
    return preOrdenPagoRules
}

export default getPreOrdenPagoRules