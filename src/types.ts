import { Context, session, NarrowedContext } from 'telegraf';

interface MySession {
  pendingAsset?: string | null;
}

export interface MyContext extends Context {
  session: MySession;
}