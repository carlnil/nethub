import React, { useState, useEffect } from 'react'
import { SERVER, CONNECTED, HOME, HISTORY, SEARCH } from './constants'
import io from 'socket.io-client'

import Navbar from './components/Navbar'
import Login from './components/Login'
import Home from './components/Home'
import History from './components/History'
import Settings from './components/Settings'

export default function App() {
  const socket = io(SERVER)

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [media, setMedia] = useState([])
  const [history, setHistory] = useState([])
  const [page, setPage] = useState(HOME)

  useEffect(() => {
    socket.emit(CONNECTED, users => {
      setUsers(users)
    })
  }, [])

  function handleSearch(params) {
    socket.emit(SEARCH, params, media => {
      setMedia(media)
    })
  }

  function getHistory(params) {
    socket.emit(HISTORY, params, history => {
      setHistory(history)
    })
  }

  function handleLogout() {
    setUser(null)
    setMedia([])
    setHistory([])
  }

  const selectPage = page => {
    if (user) {
      if (page === HOME) {
        return <Home media={media} onSearch={handleSearch} user={user} />
      } else if (page === HISTORY) {
        return (
          <History
            history={history}
            onHistory={getHistory}
            user={user}
            page={page}
          />
        )
      } else {
        return <Settings />
      }
    } else {
      return <Login users={users} setUser={setUser} />
    }
  }

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        page={page}
        setPage={setPage}
      />
      {selectPage(page)}
    </>
  )
}
