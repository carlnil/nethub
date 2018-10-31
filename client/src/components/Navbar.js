import React from 'react'
import { PAGES } from '../constants'

export default function Navbar({ user, onLogout, page, setPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-item">
          <span role="img" aria-label="clapper">
            🎬
          </span>
        </div>
      </div>

      {user ? (
        <>
          <div className="navbar-start">
            {PAGES.map(pg => (
              <button
                key={pg}
                className={`navbar-item button is-medium is-${
                  pg === page ? 'light' : 'white'
                }`}
                onClick={() => setPage(pg)}
              >
                {pg}
              </button>
            ))}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-light" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        false
      )}
    </nav>
  )
}
