import { createRootEpic, createRootReducer } from './dux/root_dux'
import { applyMiddleware, compose, createStore as createReduxStore, Middleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { createLogger } from 'redux-logger'
import { isDev } from '../../common'

const win = window as any

export const createStore = () => {
  const epicMiddleware = createEpicMiddleware()
  const middlewares = [isDev ? createLogger() : false, epicMiddleware].filter(
    Boolean
  ) as Middleware[]
  const rootReducer = createRootReducer()
  const store = createReduxStore(
    rootReducer,
    {},
    compose(
      applyMiddleware(...middlewares),
      win.__REDUX_DEVTOOLS_EXTENSION__ ? win.__REDUX_DEVTOOLS_EXTENSION__() : (noop: any) => noop
    )
  )
  epicMiddleware.run(createRootEpic() as any)
  return store
}
