import { PoolClient } from 'pg'

declare module 'koa' {
  /**
   * See https://www.typescriptlang.org/docs/handbook/declaration-merging.html for
   * more on declaration merging
   */
  interface BaseContext {
    getDb: Promise<PoolClient>
  }
}
