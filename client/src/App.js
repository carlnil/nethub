import { server, connected, query } from './constants'
import React, { Component } from 'react'
import io from 'socket.io-client'

import Navbar from './components/Navbar'
import Login from './components/Login'
import Home from './components/Home'
import History from './components/History'
import Settings from './components/Settings'

export default class App extends Component {
  state = {
    user: '',
    users: [],
    media: [],
    pages: ['Home', 'History', 'Settings'],
    active: 'Home',
    socket: {},
  }

  componentDidMount() {
    const socket = io(server)
    this.setState({ socket })

    socket.emit(connected, payload => {
      this.setState({ ...payload })
    })
  }

  loginUser = user => {
    console.log(user)
    this.setState({ user })
  }

  logoutUser = () => {
    const user = ''
    this.setState({ user })
  }

  setPage = active => {
    this.setState({ active })
  }

  handleSearch = (e, user, filters) => {
    e.preventDefault()
    const term = e.target[0].value

    if (term) {
      const socket = this.state.socket
      const vars = { term, ...filters, user }

      socket.emit(query, vars, payload => {
        this.setState({ ...payload })
      })
    }
  }

  render() {
    const { user, users, pages, active, media } = this.state
    const { loginUser, logoutUser, setPage, handleSearch } = this

    return (
      <div>
        <Navbar
          user={user}
          pages={pages}
          active={active}
          logoutUser={logoutUser}
          setPage={setPage}
        />
        {user.name ? (
          active === 'Home' ? (
            <Home user={user} onSearch={handleSearch} media={media} />
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
