import React from 'react'
import { ArticleAnalysis, DomainCategories, AnalysisResult } from 'common'
import './ArticleAnalysisCard.css'
import ScoringThumb from './ScoringThumb'

const DESIRED_DOMAIN_CATEGORIES: DomainCategories[] = ['credible', 'trusted']

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  analysisReport: AnalysisResult
}

const ArticleAnalysisCard: React.FC<Props> = ({
  analysisReport,
  className = '',
  url,
  ...rest
}) => {
  const { analysis, text, title } = analysisReport
  const {
    content: { decision: contentDecision, score: contentScore },
    title: { decision: titleDecision, score: titleScore },
    domain: { category }
  } = analysis
  const isGoodDomain = DESIRED_DOMAIN_CATEGORIES.some(d => d === category)
  const netScore = contentScore * 0.75 + titleScore * 0.25
  const isBiased = titleDecision === 'bias' || contentDecision === 'bias'
  const isContentUnsure = contentDecision === 'unsure'
  return (
    <div className={`${className} article_analysis_card--container`} {...rest}>
      <h4
        style={{ display: 'inline-block', margin: 0, padding: '4 8' }}
        children='Analysis'
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isBiased ? (
          <span className='article_analysis_card--first-glance --warning'>
            article is <span style={{ color: 'red', padding: 4 }}>biased</span>
          </span>
        ) : (
          <span className='article_analysis_card--first-glance'>
            {isContentUnsure
              ? "we're unsure about this article. safe to avoid."
              : `article is ${contentDecision}`}
          </span>
        )}
        <ScoringThumb score={netScore} style={{ height: 36, width: 36 }} />
      </div>
      <a
        children={title}
        key={title}
        className='article_analysis_card__analyzed_url truncate-oneliner'
        href={url}
      />
      {/* <a
        className={'article_analysis_card__analyzed_url truncate-oneliner'}
        href={url}
        title={url}
      >
        {(url || '').substr(0, 100).trim()}
      </a> */}
      <table className='article_analysis_card__table'>
        <tbody>
          <tr>
            <th>section</th>
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
