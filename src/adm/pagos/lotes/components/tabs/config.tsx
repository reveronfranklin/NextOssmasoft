import Icon from 'src/@core/components/icon';
import DataGridComponent from '../dataGrid/Pagos';

export const tabs = [
    {
        label: 'Pagos',
        icon: <Icon icon='mdi:money' fontSize='1.5rem' />,
        component: <DataGridComponent />,
        show: []
    }
]
