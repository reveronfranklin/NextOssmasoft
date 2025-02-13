import Icon from 'src/@core/components/icon'
import {
    Compromiso,
    Retenciones,
    Documentos,
    PagarAOrdenDe
} from '../forms/index'

export const tabs = [
    {
        label: 'Compromiso',
        icon: <Icon icon='mdi:card-search' fontSize='1.5rem' />,
        component: <Compromiso />,
        show: ['with-invoice', 'without-invoice']
    },
    {
        label: 'Documentos',
        icon: <Icon icon='mdi:file-document-multiple' fontSize='1.5rem' />,
        component: <Documentos />,
        show: ['with-invoice']
    },
    {
        label: 'Retenciones',
        icon: <Icon icon='mdi:check' fontSize='1.5rem' />,
        component: <Retenciones />,
        show: ['with-invoice', 'without-invoice']
    },
    {
        label: 'Paguese a la orden de:',
        icon: <Icon icon='mdi:cash-100' fontSize='2rem' />,
        component: <PagarAOrdenDe />,
        show: ['with-invoice', 'without-invoice']
    }
]
