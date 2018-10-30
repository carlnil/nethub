import React from 'react'
import styled from 'styled-components'

function setPages(setPage, pages, active) {
  return pages.map(page => (
    <li key={page} className={`nav-item ${page === active ? 'active' : ''}`}>
      <Link className="nav-link" onClick={() => setPage(page)}>
        {page}
      </Link>
    </li>
  ))
}

export default function Navbar({ user, pages, active, setPage, logoutUser }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="navbar-brand">
        <span role="img" aria-label="clapper">
          🎬 Nethub
        </span>
      </div>
      <div className="collapse navbar-collapse">
        {user ? (
          <>
            <ul className="navbar-nav mr-auto">
              {setPages(setPage, pages, active)}
            </ul>
            <ul className="navbar-nav pull-right">
              <li className="nav-item">
                <Link onClick={logoutUser} className="nav-link">
                  <span role="img" aria-label="bye">
                    👋 Logout
                  </span>
                </Link>
              </li>
            </ul>
          </>
        ) : (
          false
        )}
      </div>
    </nav>
  )
}

const Link = styled.div`
  cursor: pointer;
`
