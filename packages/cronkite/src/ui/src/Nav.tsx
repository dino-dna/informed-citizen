import React from 'react'
import './Nav.css'
import { Link } from '@reach/router'

const Nav: React.FC = () => (
  <nav className='split-nav Nav'>
    <div className='nav-brand'>
      <Link to='/'>
        <h1>informed citizen</h1>
      </Link>
    </div>
    <div className='collapsible'>
      <input id='collapsible1' type='checkbox' name='collapsible1' />
      <button>
        <label htmlFor='collapsible1'>
          <div className='bar1' />
          <div className='bar2' />
          <div className='bar3' />
        </label>
      </button>
      <div className='collapsible-body'>
        <ul className='inline'>
          <li>
            <Link to='about'>About</Link>
          </li>
          <li>
            <a
              target='blank'
              referrerPolicy='no-referrer'
              href='https://github.com/dino-dna/informed-citizen'
            >
              Github
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
)

export default Nav
