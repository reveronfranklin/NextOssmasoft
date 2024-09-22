import Icon from 'src/@core/components/icon'
import {
    Compromiso,
    Impuestos,
    Retenciones,
    Documentos,
    PagarAOrdenDe
} from '../forms/index'

export const tabs = [
    {
        label: 'Compromiso',
        icon: <Icon icon='mdi:card-search' fontSize='1.5rem' />,
        component: <Compromiso />,
    },
    {
        label: 'Impuestos',
        icon: <Icon icon='mdi:finance' fontSize='1.5rem' />,
        component: <Impuestos />,
    },
    {
        label: 'Retenciones',
        icon: <Icon icon='mdi:check' fontSize='1.5rem' />,
        component: <Retenciones />,
    },
    {
        label: 'Documentos',
        icon: <Icon icon='mdi:file-document-multiple' fontSize='1.5rem' />,
        component: <Documentos />,
    },
    {
        label: 'Paguese a la orden de:',
        icon: <Icon icon='mdi:cash-100' fontSize='4rem' />,
        component: <PagarAOrdenDe />,
    },
]
