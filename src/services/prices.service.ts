import 'dotenv/config'

const proApiUrl: string = 'https://pro-api.coinmarketcap.com'
const brapiUrl: string = 'https://brapi.dev/api'

const apiKey = process.env.CMC_PRO_API_KEY!
const brApiKey = process.env.BRAPI_API_KEY!

const getBtcPrice = async (): Promise<number | undefined> => {
    const options = { method: 'GET', headers: { 'accept': 'application/json', 'X-CMC_PRO_API_KEY': apiKey } }

    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=1`, options)
        const data = await response.json()
        const price = data?.data?.['1']?.quote?.USD?.price

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching BTC price:', err)
    }
}


const getNvdaPrice = async (): Promise<number | undefined> => {
    const options = { method: 'GET', headers: { 'accept': 'application/json', 'X-CMC_PRO_API_KEY': apiKey } }

    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=1027`, options)
        const data = await response.json()
        const price = data?.data?.['1027']?.quote?.USD?.price

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching NVDA price:', err)
    }
}

const getPetr4Price = async (): Promise<number | undefined> => {
    const options = { method: 'GET', headers: { 'accept': 'application/json', 'Authorization': `Bearer ${brApiKey}` } }

    try {
        const response = await fetch(`${brapiUrl}/quote/PETR4`, options)
        const data = await response.json()
        console.log(data)
        const price = data?.results?.[0]?.regularMarketPrice

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching PETR4 price:', err)
    }
}

export {
    getBtcPrice,
    getNvdaPrice,
    getPetr4Price
}