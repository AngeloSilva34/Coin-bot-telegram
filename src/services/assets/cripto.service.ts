const getCoinPrice = async (asset: string): Promise<number | undefined> => {
    const coinsId: Record<string, string> = {
        'Bitcoin': '1',
        'Ethereum': '1027',
        'Litecoin': '2',
        'Solana': '5426',
        'Shiba': '5994'
    }

    const coinId = coinsId[asset]

    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinId}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY!
            }
        })
        const data = await response.json()
        const price = data?.data?.[coinId]?.quote?.USD?.price

        if (asset === 'Shiba') {
            return parseFloat(price.toFixed(11))
        }

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error(`Error trying to get ${asset} price:`, err)
    }
}

export {
    getCoinPrice
}