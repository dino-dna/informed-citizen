import React from 'react'
import { ArticleAnalysis, DomainCategories } from 'common'
import './ArticleAnalysisCard.css'
import ScoringThumb from './ScoringThumb'

const DESIRED_DOMAIN_CATEGORIES: DomainCategories[] = ['credible', 'trusted']

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  analysis: ArticleAnalysis
}

const ArticleAnalysisCard: React.FC<Props> = ({
  analysis,
  className = '',
  ...rest
}) => {
  const {
    content: { decision: contentDecision, score: contentScore },
    title: { decision: titleDecision, score: titleScore },
    domain: { category }
  } = analysis
  const isGoodDomain = DESIRED_DOMAIN_CATEGORIES.some(d => d === category)
  const netScore = contentScore * 0.75 + titleScore * 0.25
  const isBiased = titleDecision === 'bias' || contentDecision === 'bias'
  return (
    <div className={`${className} article_analysis_card--container`} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ScoringThumb score={netScore} style={{ height: 24, width: 24 }} />
        {isBiased ? (
          <span className='article_analysis_card--first-glance --warning'>
            article is <span style={{ color: 'red', padding: 4 }}>biased</span>
          </span>
        ) : (
          <span className='article_analysis_card--first-glance'>
            article is {contentDecision}
          </span>
        )}
      </div>
      <h4 style={{ margin: 0 }}>Analysis</h4>
      <table>
        <tbody>
          <tr>
            <th />
            <th>impartialness</th>
            <th>decision</th>
          </tr>
          <tr>
            <td>content</td>
            <td style={{ color: contentScore > 0.8 ? 'green' : 'red' }}>
              {(contentScore * 100).toFixed(0)}%
            </td>
            <td>{contentDecision}</td>
          </tr>
          <tr>
            <td>title</td>
            <td style={{ color: titleScore > 0.8 ? 'green' : 'red' }}>
              {(titleScore * 100).toFixed(0)}%
            </td>
            <td>{titleDecision}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ScoringThumb
          score={isGoodDomain ? 1 : 0}
          style={{ height: 18, width: 18 }}
        />
        {isGoodDomain ? (
          <span style={{ padding: 4 }}>the article domain is {category}</span>
        ) : (
          <span style={{ color: 'red', padding: 4 }}>
            the article domain is not one of "
            {DESIRED_DOMAIN_CATEGORIES.join(', ')}". it is {category}.
          </span>
        )}
      </div>
    </div>
  )
}

export default ArticleAnalysisCard
