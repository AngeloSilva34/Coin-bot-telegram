import { Context, session, NarrowedContext } from 'telegraf';

interface MySession {
  pendingAsset?: {
    asset?: string,
    price?: number,
    stage?: 'waitingPrice' | 'waitingDays'
  };
}

export interface MyContext extends Context {
  session: MySession;
}