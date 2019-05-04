import React from 'react'
import { ArticleAnalysis } from 'common'
import './ArticleAnalysisCard.css'

export default function ArticleAnalysisCard ({ analysis }: { analysis: ArticleAnalysis }) {
  return (
    <div className='article_analysis_card--container'>
      <svg><circle style={{stroke: 'red'}} r='10' x='50' y='50'/></svg> Bad - don't trust it
      <h2>Big Bad Article</h2>
      <table>
        <tbody>
          <tr>
            <th>fake</th>
            <th>bias direction</th>
            <th>bias confidence</th>
          </tr>
          <tr>
            <td>YUP</td>
            <td>right</td>
            <td>98%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
