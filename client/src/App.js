import { server, connected, query } from './constants'
import React, { Component } from 'react'
import styled from 'styled-components'
import io from 'socket.io-client'

import Login from './components/Login'
import Home from './components/Home'
import History from './components/History'
import Settings from './components/Settings'

export default class App extends Component {
  state = {
    user: 'John Smith',
    users: [],
    socket: {},
    pages: ['Home', 'History', 'Settings'],
    active: 'Home',
  }

  componentDidMount() {
    const socket = io(server)
    this.setState({ socket })

    socket.emit(connected, payload => {
      this.setState({ ...payload })
    })
  }

  loginUser = user => {
    this.setState({ user })
  }

  logoutUser = () => {
    const user = ''
    this.setState({ user })
  }

  setPage = active => {
    this.setState({ active })
  }

  handleSearch = (e, filters) => {
    e.preventDefault()
    const socket = this.state.socket
    const term = e.target[0].value
    const vars = { term, ...filters }

    socket.emit(query, vars, payload => {
      this.setState({ ...payload })
    })
  }

  render() {
    const { user, users, pages, active } = this.state
    const { loginUser, logoutUser, setPage, handleSearch } = this

    return (
      <div>
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
                  {pages.map(page => (
                    <li
                      key={page}
                      className={`nav-item ${page === active ? 'active' : ''}`}
                    >
                      <Link className="nav-link" onClick={() => setPage(page)}>
                        {page}
                      </Link>
                    </li>
                  ))}
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
        {user ? (
          active === 'Home' ? (
            <Home user={user} onSearch={handleSearch} />
          ) : active === 'History' ? (
            <History user={user} />
          ) : (
            <Settings user={user} />
          )
        ) : (
          <Login loginUser={loginUser} users={users} />
        )}
      </div>
    )
  }
}

const Link = styled.div`
  cursor: pointer;
`
