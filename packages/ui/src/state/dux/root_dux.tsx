import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { reducer as analysis, AnalysisActions, epics as analysisEpics } from './analysis'

export const createRootReducer = () => {
  return combineReducers({
    analysis
  })
}

export const createRootEpic = () => combineEpics(
  ...analysisEpics
)

export type Actions = AnalysisActions
