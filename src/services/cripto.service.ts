import 'dotenv/config'

const proApiUrl: string = 'https://pro-api.coinmarketcap.com'
const apiKey = process.env.CMC_PRO_API_KEY!
const options = { method: 'GET', headers: { 'accept': 'application/json', 'X-CMC_PRO_API_KEY': apiKey } }

const getBtcPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=1`, options)
        const data = await response.json()
        const price = data?.data?.['1']?.quote?.USD?.price

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching BTC price:', err)
    }
}

const getEthPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=1027`, options)
        const data = await response.json()
        const price = data?.data?.['1027']?.quote?.USD?.price

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching ETH price:', err)
    }
}

const getLtcPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=2`, options)
        const data = await response.json()
        const price = data?.data?.['2']?.quote?.USD?.price

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching LTC price:', err)
    }
}

const getSolPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=5426`, options)
        const data = await response.json()
        const price = data?.data?.['5426']?.quote?.USD?.price

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching SOL price:', err)
    }
}

const getShibPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${proApiUrl}/v1/cryptocurrency/quotes/latest?id=5994`, options)
        const data = await response.json()
        console.log('Data fetched for SHIB:', data?.data?.['5994']?.quote)
        const price = data?.data?.['5994']?.quote?.USD?.price

        return parseFloat(price.toFixed(11))
    } catch (err) {
        console.error('Error fetching SHIB price:', err)
    }
}

export {
    getBtcPrice,
    getLtcPrice,
    getEthPrice,
    getSolPrice,
    getShibPrice
}