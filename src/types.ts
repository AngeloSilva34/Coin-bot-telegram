import { Context, session, NarrowedContext } from 'telegraf';

interface MySession {
  pendingAsset?: {
    asset?: string,
    price?: number,
    targetPrice?: number,
    stage?: 'waitingPrice' | 'waitingDays'
  };
}

type PriceMap = {
  [key: string]: number | undefined
}

interface MyContext extends Context {
  session: MySession;
}

export {
  PriceMap,
  MyContext,
}