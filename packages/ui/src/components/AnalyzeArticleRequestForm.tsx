import './AnalyzeArticleRequestForm.css'
import React, { useState } from 'react'

const FAKE_ARTICLE_URL = 'https://www.breitbart.com/europe/2017/01/03/dortmund-mob-attack-police-church-alight/'

export interface Props extends React.HTMLAttributes<HTMLFormElement> {
  onAnalzye: (url: string) => any
  disabled: boolean
}

const AnalyzeArticleRequestForm: React.FC<Props> = ({
  className = '',
  onAnalzye,
  disabled,
  ...rest
}) => {
  const [url, setUrl] = useState('')
  return (
    <form className={`${className} AnalyzeArticleRequestForm`} {...rest}>
      <p>
        Analyze a page for fake & biased content.
        <button
          type='button'
          className='btn-small'
          onClick={() => {
            setUrl(FAKE_ARTICLE_URL)
            onAnalzye(FAKE_ARTICLE_URL)
          }}
          style={{marginLeft: 10}}
        >
          Try it
        </button>
      </p>
      <input
        className='AnalyzeArticleRequestForm_url'
        maxLength={1000}
        onChange={node => setUrl(node.currentTarget.value)}
        placeholder='Enter article url'
        type='text'
        value={url}
      />
      {/* {url && url.length > 18 && <span style={{ fontSize: 10, color: 'gray' }}>{url}</span>} */}
      <br />
      <button
        className='AnalyzeArticleRequestForm_submit btn-large paper-btn btn-secondary'
        type='button'
        style={{marginTop: 6}}
        onClick={evt => {
          evt.preventDefault()
          onAnalzye(url)
        }}
        children='Analyze'
        disabled={disabled}
      />
    </form>
  )
}

export default AnalyzeArticleRequestForm
