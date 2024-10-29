const HandleReport = async (props: {
    filter: any
    geReportUrl: (filter: any) => Promise<any>
    downLoadReport: (url: string) => Promise<any>
}) => {
    const { filter, geReportUrl, downLoadReport } = props

    if (!geReportUrl || !filter) {
        return
    }

    const responseGetReportUrl = await geReportUrl(filter)

    if (responseGetReportUrl.isValid) {
        const url = responseGetReportUrl?.data

        try {
            await downLoadReport(url)
        } catch (e: any) {
            console.error(e)
        }
    }
}

export default HandleReport