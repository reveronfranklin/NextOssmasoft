const ConvertToBase64 = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        const reader = new FileReader()

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64data = reader.result as string;
                resolve(base64data.split(',')[1])
            }
            reader.onerror = () => {
                reject(new Error('Failed to convert PDF to Base64'));
            }
            reader.readAsDataURL(blob);
        })
    } catch (e: any) {
        console.error('Error fetching or converting PDF:', e)

        return null
    }
}

export default ConvertToBase64