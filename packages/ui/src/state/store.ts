import { createRootEpic, createRootReducer } from './dux/root_dux'
import {
  createStore as createReduxStore,
  applyMiddleware,
  Middleware
} from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { createLogger } from 'redux-logger'
import { isDev } from 'common'

// const win = window as any

export const createStore = () => {
  // const compose = win.__REDUX_DEVTOOLS_EXTENSION__ ? win.__REDUX_DEVTOOLS_EXTENSION__() : _compose
  const epicMiddleware = createEpicMiddleware()
  const middlewares = [isDev ? createLogger() : false, epicMiddleware].filter(
    Boolean
  ) as Middleware[]
  const rootReducer = createRootReducer()
  const appliedMiddlewares = applyMiddleware(...middlewares)
  const store = createReduxStore(rootReducer, appliedMiddlewares) // )compose(appliedMiddlewares))
  epicMiddleware.run(createRootEpic() as any)
  return store
}
