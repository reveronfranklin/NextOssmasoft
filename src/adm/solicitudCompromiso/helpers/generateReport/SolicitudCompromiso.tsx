const HandleReport = async (props: any) => {
    const urlReport = await props.fetchSolicitudReportData(props.filter)

    if (urlReport?.isValid) {
        const url = urlReport?.data
        await props.downloadReportByName(url)
    }
}

export default HandleReport