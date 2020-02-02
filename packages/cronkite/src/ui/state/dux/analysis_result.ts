import { AnalysisResult } from '../../../common'
import { FSA, ErrorFSA, Store } from '../../types'
import { Reducer } from 'redux'
import { ofType } from 'redux-observable'
import { concatMap } from 'rxjs/operators'
import { from, concat, of } from 'rxjs'
import { analyze } from '../../util/analysis'
import { navigate } from '@reach/router'

type RequestAnalysis = FSA<'REQUEST_ANALYSIS', { url: string }>
type HandleRequestAnalysisError = ErrorFSA<'HANDLE_REQUEST_ANALYSIS_ERROR'>
type HandleRequestAnalysisSuccess = FSA<'HANDLE_REQUEST_ANALYSIS_SUCCESS', AnalysisResult>
type ResetScrollState = FSA<'RESET_REQUEST_ANALYSIS_SCROLL_STATE', null>
export type AnalysisActions =
  | RequestAnalysis
  | HandleRequestAnalysisError
  | HandleRequestAnalysisSuccess
  | ResetScrollState

export type AnalysisState = {
  loading: boolean
  value: null | AnalysisResult
  error: null | string
  scrollIntoView: boolean
}

const INITIAL_STATE: AnalysisState = {
  loading: false,
  value: null,
  scrollIntoView: false,
  error: null
}

export const reducer: Reducer<AnalysisState, AnalysisActions> = (
  state = INITIAL_STATE,
  action: AnalysisActions
) => {
  switch (action.type) {
    case 'REQUEST_ANALYSIS':
      return { ...state, value: null, error: null, loading: true }
    case 'HANDLE_REQUEST_ANALYSIS_ERROR':
      return { ...state, value: null, loading: false, error: action.payload.message }
    case 'HANDLE_REQUEST_ANALYSIS_SUCCESS':
      return {
        ...state,
        error: null,
        loading: false,
        scrollIntoView: true,
        value: action.payload
      }
    default:
      return state as AnalysisState
  }
}

const requestAnalysisEpic$: Store.Epic = (action$, state$) =>
  action$.pipe(
    ofType('REQUEST_ANALYSIS'),
    concatMap(action => {
      const reqAction = action as RequestAnalysis
      const encodedUrl = encodeURIComponent(reqAction.payload.url)
      const requestObservable = from(
        analyze({ fetch: window.fetch, url: encodedUrl })
          .then(payload => {
            return { type: 'NOOP', payload: null } as any
            // @TODO do something else
            // navigate(`/report?url=${encodedUrl}`)
            // return {
            //   type: 'HANDLE_REQUEST_ANALYSIS_SUCCESS',
            //   payload
            // } as HandleRequestAnalysisSuccess
          })
          .catch(
            () =>
              ({
                type: 'HANDLE_REQUEST_ANALYSIS_ERROR',
                payload: new Error(`bummer. failed to analyze ${reqAction.payload.url}`),
                error: true
              } as HandleRequestAnalysisError)
          )
      )
      const post: ResetScrollState = { type: 'RESET_REQUEST_ANALYSIS_SCROLL_STATE', payload: null }
      return concat(requestObservable, of(post))
    })
  )

export const epics = [requestAnalysisEpic$]
