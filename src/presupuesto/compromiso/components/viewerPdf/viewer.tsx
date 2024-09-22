import useServices from '../../services/useServices'
import ReportViewAsync from 'src/share/components/Reports/forms/ReportViewAsync'
import { FiltersGetReportName } from '../../interfaces/filtersGetReportName.interfaces'
import { useEffect, useState } from 'react'
import { ICompromiso } from '../../interfaces/responseGetAll.interfaces'
import authConfig from 'src/configs/auth'

const ViewerPdf = (props: {data: ICompromiso}) => {
    const { loading, getReportName } = useServices()
    const [reportName, setReportName] = useState<string>('')
    const [error, setError] = useState<string | null>(null);

    const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
    const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

    const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

    const filter: FiltersGetReportName = {
        codigoCompromiso: props.data.codigoCompromiso,
        numeroCompromiso: props.data.numeroCompromiso,
        fechaCompromiso: props.data.fechaCompromiso,
    }

    useEffect(() => {
        const fetchReportName = async () => {
            try {
                const response = await getReportName(filter);
                if (response?.data) {
                    setReportName(response.data);
                } else {
                    setError('No report name found.');
                }
            } catch (err) {
                setError('Error fetching report name.');
            }
        };

        fetchReportName();
    }, [filter, getReportName])

    if (error) return <div>{error}</div>;
    if (!reportName) return <div>Generando PDF, por favor espere...</div>

    const url = `${urlBase}/Files/GetPdfFiles/${reportName}`

    return (
        <>
            {
                loading && reportName ? <div>Loading...</div> :
                <ReportViewAsync
                    url={url}
                    width={'100%'}
                    height={'800px'} />
            }
        </>
    )
}

export default ViewerPdf