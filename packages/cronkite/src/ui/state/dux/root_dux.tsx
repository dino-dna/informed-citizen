import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import {
  reducer as analysisResult,
  AnalysisActions,
  epics as analysisEpics
} from './analysis_result'

export const createRootReducer = () => {
  return combineReducers({
    analysisResult
  })
}

export const createRootEpic = () => combineEpics(...analysisEpics)

export type Actions = AnalysisActions
