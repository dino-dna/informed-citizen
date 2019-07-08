import './AnalyzeArticleRequestForm.css'
import React from 'react'

const FAKE_ARTICLE_URL =
  'https://www.breitbart.com/europe/2017/01/03/dortmund-mob-attack-police-church-alight/'

export interface Props extends React.HTMLAttributes<HTMLFormElement> {
  onAnalzye: (url: string) => any
  disabled: boolean
  url: string
  onChangeUrl: (url: string) => void
}

class AnalyzeArticleRequestForm extends React.PureComponent<Props> {
  inputEl: React.RefObject<HTMLInputElement>

  constructor (props: any) {
    super(props)
    this.inputEl = React.createRef()
  }
  render () {
    const { className = '', onAnalzye, disabled, url, onChangeUrl, ...rest } = this.props
    return (
      <form className={`${className} AnalyzeArticleRequestForm`} {...rest}>
        <p>Analyze a page for fake & biased content.</p>
        <input
          className='AnalyzeArticleRequestForm_url'
          maxLength={1000}
          onChange={node => onChangeUrl(node.currentTarget.value)}
          placeholder='Enter article url'
          type='text'
          value={url}
          ref={this.inputEl}
        />
        {/* {url && url.length > 18 && <span style={{ fontSize: 10, color: 'gray' }}>{url}</span>} */}
        <br />
        <button
          className='AnalyzeArticleRequestForm_submit btn-large paper-btn btn-secondary'
          type='button'
          style={{ marginTop: 6 }}
          onClick={evt => {
            evt.preventDefault()
            evt.stopPropagation()
            onAnalzye(url)
          }}
          children='Analyze'
          disabled={disabled}
        />
        <div style={{ textAlign: 'right' }}>
          <button
            type='button'
            className='AnalyzeArticleRequestForm__try-it btn-small'
            onClick={evt => {
              evt.preventDefault()
              evt.stopPropagation()
              onChangeUrl(FAKE_ARTICLE_URL)
              onAnalzye(FAKE_ARTICLE_URL)
              const el = this.inputEl!.current!
              el.selectionStart = el.selectionEnd = el.value.length
            }}
            children='Try it'
          />
        </div>
      </form>
    )
  }
}

export default AnalyzeArticleRequestForm
