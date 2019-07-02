import { Epic as ReduxObservableEpic } from 'redux-observable'
import { createRootReducer, Actions as AllActions } from './state/dux/root_dux'
import { Action } from 'redux'

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

export interface FSA<Type, Payload, Meta = undefined> extends Action<Type> {
  payload: Payload
  meta?: Meta
  error?: true
}

export interface ErrorFSA<Type, Meta = undefined> extends FSA<Type, Error, Meta> {
  error: true
}

export namespace Store {
  export type Actions = AllActions
  export interface WithDispatch {
    dispatch: (action: AllActions) => void
  }

  export type StateType<ReducerOrMap> = ReducerOrMap extends (...args: any[]) => any
    ? ReturnType<ReducerOrMap>
    : ReducerOrMap extends object
    ? { [K in keyof ReducerOrMap]: StateType<ReducerOrMap[K]> }
    : never

  export type StateTree = StateType<ReturnType<typeof createRootReducer>>

  export interface All extends StateTree {}

  export type Epic = ReduxObservableEpic<AllActions, AllActions, All>
}
