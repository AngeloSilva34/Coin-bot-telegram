const getBrapiPrice = async (asset: string): Promise<number | undefined> => {
    const codes: Record<string, string> = {
        'Dólar': 'USD',
        'Ibovespa': '^BVSP',
        'Petrobras': 'PETR4',
        'Vale': 'VALE3',
        'Itaú': 'ITUB4',
        'Selic': 'SELIC',
    }

    const code = codes[asset]
    try {
        if (asset === 'Dólar') {
            const response = await fetch(`https://economia.awesomeapi.com.br/json/last/USD`)
            const data = await response.json()
            const price = Number(data?.USDBRL?.high)

            return parseFloat(price.toFixed(2))
        }

        if (asset === 'Selic') {
            const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados/ultimos/1?formato=json`)
            const data = await response.json()
            const price = Number(data?.[0]?.valor)

            return parseFloat(price.toFixed(2))
        }

        const response = await fetch(`https://brapi.dev/api/quote/${code}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${process.env.BRAPI_API_KEY!}`
            }
        })
        const data = await response.json()
        const points = data?.results?.[0]?.regularMarketPrice

        return parseFloat(points.toFixed(2))
    } catch (err) {
        console.error(`Error trying get info about ${asset}: `, err)
    }
}

const getAllBrapiPrice = async () => {

    const [Dólar, Selic, Ibovespa, Petrobras, Vale, Itaú] = await Promise.all([
        getBrapiPrice('Dólar'),
        getBrapiPrice('Selic'),
        getBrapiPrice('Ibovespa'),
        getBrapiPrice('Petrobras'),
        getBrapiPrice('Vale'),
        getBrapiPrice('Itaú')
    ])

    return {
        Dólar,
        Ibovespa,
        Petrobras,
        Vale,
        Itaú,
        Selic
    }
}


export {
    getBrapiPrice,
    getAllBrapiPrice
}
