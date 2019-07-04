import React from 'react'
import Thumb from './icons/Thumb'
import { AnalysisRatingCategory } from '../../common'
import { mapNetScoreToCategory } from '../util/analysis'

const ScoringThumb: React.FC<
  React.HTMLAttributes<any> & {
    score: number
  }
> = ({ style = {}, score, ...rest }) => {
  const category = mapNetScoreToCategory(score)
  // eslint-disable-start
  const { color, degrees } =
    category === AnalysisRatingCategory.GOOD
      ? { color: 'green', degrees: 0 }
      : category === AnalysisRatingCategory.OK
        ? { color: 'lightgreen', degrees: 45 }
        : category === AnalysisRatingCategory.NEUTRAL
          ? { color: 'orange', degrees: 90 }
          : { color: 'red', degrees: 180 }
  // eslint-disable-end
  return (
    <Thumb
      style={{
        minHeight: 30,
        minWidth: 30,
        maxWidth: 100,
        stroke: color,
        fill: color,
        transform: `rotate(${degrees}deg)`,
        ...style
      }}
      {...rest}
    />
  )
}

export default ScoringThumb
