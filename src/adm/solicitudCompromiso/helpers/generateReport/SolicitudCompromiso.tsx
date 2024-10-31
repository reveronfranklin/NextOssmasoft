const HandleReport = async (props: {
    filter: any,
    geReportUrl: (filter: any) => Promise<any>,
    downLoadReport: (url: string) => Promise<any>
}): Promise<any> => {
    const { filter, geReportUrl, downLoadReport } = props

    if (!geReportUrl || !filter) {
        return
    }

    try {
        const responseGetReportUrl = await geReportUrl(filter)

        if (responseGetReportUrl.isValid && responseGetReportUrl.data) {
            await downLoadReport(responseGetReportUrl.data)
        }

    } catch (e: any) {
        console.error(e)
    }
}

export default HandleReport