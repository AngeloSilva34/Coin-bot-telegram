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

const getStockPrice = async (asset: string): Promise<number | undefined> => {
    const symbols: Record<string, string> = {
        'Nvidia': 'NVDA',
        'Apple': 'AAPL',
        'Tesla': 'TSLA',
        'SPY': 'SPY'
    }

    const symbol = symbols[asset]

    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINHUB_API_KEY!}`);
        const data: FinnhubQuote = await response.json()
        const price = data.c

        return parseFloat(price.toFixed(2))
    } catch (err) {
        console.error(`Cannot get ${asset} price:`, err)
    }
}

const getAllStockPrice = async () => {
    const [Nvidia, Apple, Tesla, SPY] = await Promise.all([
        getStockPrice('Nvidia'),
        getStockPrice('Apple'),
        getStockPrice('Tesla'),
        getStockPrice('SPY')
    ])

    return {
        Nvidia,
        Apple,
        Tesla,
        SPY
    }
}

export {
    getStockPrice,
    getAllStockPrice
}
