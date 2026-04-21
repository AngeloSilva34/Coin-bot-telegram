interface FinnhubQuote {
    c: number;  // Preço atual (Current price)
    d: number;  // Variação (Change)
    dp: number; // Variação percentual (Percent change)
    h: number;  // Máxima do dia (High price)
    l: number;  // Mínima do dia (Low price)
    o: number;  // Preço de abertura (Open price)
    pc: number; // Fechamento anterior (Previous close)
    t: number;  // Timestamp
}

const finnHubUrl: string = 'https://finnhub.io/api/v1'
const finhubApiKey = process.env.FINHUB_API_KEY!

const getNvdaPrice = async (): Promise<number | undefined> => {
    const symbol = 'NVDA';

    try {
        const response = await fetch(`${finnHubUrl}/quote?symbol=${symbol}&token=${finhubApiKey}`);
        const data: FinnhubQuote = await response.json()
        const price = data.c

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error("Error fetching NVDA price:", err);
    }
}

const getAaplPrice = async (): Promise<number | undefined> => {
    const symbol = 'AAPL';

    try {
        const response = await fetch(`${finnHubUrl}/quote?symbol=${symbol}&token=${finhubApiKey}`);
        const data: FinnhubQuote = await response.json()
        const price = data.c

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error("Error fetching AAPL price:", err);
    }
}

const getTslaPrice = async (): Promise<number | undefined> => {
    const symbol = 'TSLA';

    try {
        const response = await fetch(`${finnHubUrl}/quote?symbol=${symbol}&token=${finhubApiKey}`);
        const data: FinnhubQuote = await response.json()
        const price = data.c

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error("Error fetching TSLA price:", err);
    }
}

const getSpyPrice = async (): Promise<number | undefined> => {
    const symbol = 'SPY';
    try {
        const response = await fetch(`${finnHubUrl}/quote?symbol=${symbol}&token=${finhubApiKey}`);
        const data: FinnhubQuote = await response.json()
        const price = data.c

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error('Error fetching SPY price:', err)
    }
}

export {
    getNvdaPrice,
    getAaplPrice,
    getTslaPrice,
    getSpyPrice
}
