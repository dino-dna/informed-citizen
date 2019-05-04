import './AnalyzeArticleRequestForm.css'
import React from 'react'

export default function AnalyzeArticleRequestForm () {
  return (
    <form className='AnalyzeArticleRequestForm'>
      <input className='AnalyzeArticleRequestForm_url' type='text' max='1000' placeholder='Enter article url' />
      <br />
      <button className='AnalyzeArticleRequestForm_submit' type='button' children='Analyze' />
    </form>
  )
}
