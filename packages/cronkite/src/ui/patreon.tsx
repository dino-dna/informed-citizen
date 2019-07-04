import React from 'react'

export const Patreon = (props: { label?: string }) => (
  <span>
    <a
      href='https://www.patreon.com/bePatron?u=21852476'
      data-patreon-widget-type='become-patron-button'
    >
      {props.label || 'Become a Patron!'}
    </a>
    <script async src='https://c6.patreon.com/becomePatronButton.bundle.js' />
  </span>
)
