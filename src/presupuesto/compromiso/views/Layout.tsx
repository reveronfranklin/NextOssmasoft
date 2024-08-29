import { Card, CardContent } from "@mui/material"
import DataGridComponent from '../components/datagrid/DataGridGeneralCompromisos'
import DialogCompromisoDetalle from '../views/DialogCompromisoDetalle'

const LayoutComponent = () => {
    return (
        <Card>
            <CardContent>
                <DataGridComponent />
                <DialogCompromisoDetalle />
            </CardContent>
        </Card>
    )
}

export default LayoutComponent