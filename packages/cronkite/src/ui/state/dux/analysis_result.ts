import { ArticleAnalysis, AnalysisResult } from 'common'
import { FSA, ErrorFSA, Store } from '../../types'
import { Reducer } from 'redux'
import { ofType } from 'redux-observable'
import { mergeMap } from 'rxjs/operators'
import { from } from 'rxjs'
import { analyze } from '../../util/analyze'

type RequestAnalysis = FSA<'REQUEST_ANALYSIS', { url: string }>
type HandleRequestAnalysisError = ErrorFSA<'HANDLE_REQUEST_ANALYSIS_ERROR'>
type HandleRequestAnalysisSuccess = FSA<
  'HANDLE_REQUEST_ANALYSIS_SUCCESS',
  AnalysisResult
>
export type AnalysisActions =
  | RequestAnalysis
  | HandleRequestAnalysisError
  | HandleRequestAnalysisSuccess

export type AnalysisState = {
  loading: boolean
  value: null | AnalysisResult
  error: null | string
}

const INITIAL_STATE: AnalysisState = {
  loading: false,
  value: null,
  error: null
}

export const reducer: Reducer<AnalysisState, AnalysisActions> = (
  state = INITIAL_STATE,
  action: AnalysisActions
) => {
  switch (action.type) {
    case 'REQUEST_ANALYSIS':
      return { ...state, loading: true }
    case 'HANDLE_REQUEST_ANALYSIS_ERROR':
      return { ...state, loading: false, error: action.payload.message }
    case 'HANDLE_REQUEST_ANALYSIS_SUCCESS':
      return {
        ...state,
        error: null,
        loading: false,
        value: action.payload
      }
    default:
      return state as AnalysisState
  }
}

const requestAnalysisEpic$: Store.Epic = (action$, state$) =>
  action$.pipe(
    ofType('REQUEST_ANALYSIS'),
    mergeMap(action => {
      const reqAction = action as RequestAnalysis
      return from(
        analyze({ fetch: window.fetch, url: reqAction.payload.url })
          .then(
            payload =>
              ({
                type: 'HANDLE_REQUEST_ANALYSIS_SUCCESS',
                payload
              } as HandleRequestAnalysisSuccess)
          )
          .catch(
            () =>
              ({
                type: 'HANDLE_REQUEST_ANALYSIS_ERROR',
                payload: new Error(
                  `bummer. failed to analyze ${reqAction.payload.url}`
                ),
                error: true
              } as HandleRequestAnalysisError)
          )
      )
    })
  )

export const epics = [requestAnalysisEpic$]
