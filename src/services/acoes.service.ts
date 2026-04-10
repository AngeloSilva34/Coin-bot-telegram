import 'dotenv/config'

const brapiUrl: string = 'https://brapi.dev/api'
const brApiKey = process.env.BRAPI_API_KEY!
const options = { method: 'GET', headers: { 'accept': 'application/json', 'Authorization': `Bearer ${brApiKey}` } }


const getPetr4Price = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${brapiUrl}/quote/PETR4`, options)
        const data = await response.json()
        const price = data?.results?.[0]?.regularMarketPrice

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching PETR4 price:', err)
    }
}

const getVale3Price = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${brapiUrl}/quote/VALE3`, options)
        const data = await response.json()
        const price = data?.results?.[0]?.regularMarketPrice

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching VALE3 price:', err)
    }
}

const getItau4Price = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${brapiUrl}/quote/ITUB4`, options)
        const data = await response.json()
        const price = data?.results?.[0]?.regularMarketPrice

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching ITAU4 price:', err)
    }
}

const getSelicRate = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados/ultimos/1?formato=json`)
        const data = await response.json()
        const price = Number(data?.[0]?.valor)

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching Selic rate:', err)
    }
}

const getIbovPoints = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${brapiUrl}/quote/^BVSP`, options)
        const data = await response.json()
        const points = data?.results?.[0]?.regularMarketPrice

        return parseFloat(points.toFixed(2))
    } catch (err) {
        console.error('Error fetching IBOV points:', err)
    }
}

const getUsdPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`https://economia.awesomeapi.com.br/json/last/USD`)
        const data = await response.json()
        const price = Number(data?.USDBRL?.high)

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching USD price:', err)
    }
}

const getSpxPrice = async (): Promise<number | undefined> => {
    try {
        const response = await fetch(`${brapiUrl}/quote/SPX`, options)
        const data = await response.json()
        console.log('SPX data:', data)
        const price = data?.results?.[0]?.regularMarketPrice

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching SPX price:', err)
    }
}


export {
    getPetr4Price,
    getVale3Price,
    getItau4Price,
    getSelicRate,
    getIbovPoints,
    getUsdPrice,
    getSpxPrice
}