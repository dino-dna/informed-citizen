import React from 'react'
import Thumb from './icons/Thumb'

const ScoringThumb: React.FC<
  React.HTMLAttributes<any> & {
    score: number
  }
> = ({ style = {}, score, ...rest }) => {
  const { color, degrees } =
    score >= 0.85
      ? { color: 'green', degrees: 0 }
      : score >= 0.75
        ? { color: 'lightgreen', degrees: 45 }
        : score >= 0.65
          ? { color: 'orange', degrees: 90 }
          : { color: 'red', degrees: 180 }
  return (
    <Thumb
      style={{
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
