import React, { useState, useEffect } from 'react'
import {
  SERVER,
  CONNECTED,
  HOME,
  HISTORY,
  SEARCH,
  LOGIN,
  UPDATE,
  RATING,
  SUBSCRIPTION,
  LANGUAGE,
  SUBTITLES,
} from './constants'
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
  const [languages, setLanguages] = useState([])
  const [subtitles, setSubtitles] = useState([])
  const [page, setPage] = useState(HOME)

  useEffect(() => {
    socket.emit(CONNECTED, (users, languages, subtitles) => {
      setUsers(users)
      setLanguages(languages)
      setSubtitles(subtitles)
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

  function getMedia(params) {
    socket.emit(LOGIN, params, (movies, series) => {
      setMedia([...movies, ...series])
    })
  }

  function handleLogout() {
    setUser(null)
    setMedia([])
    setHistory([])
    setPage(HOME)
  }

  function onLogin(user) {
    setUser(user)
    getMedia({ id: user.id })
    getHistory({ id: user.id })
  }

  function handleHistoryChange(media, seen) {
    socket.emit(UPDATE, {
      media_id: media.id,
      user_id: user.id,
      seen,
      type: HISTORY,
    })

    updateMedia()
  }

  function handleRatingChange(media, { target: { value } }) {
    socket.emit(UPDATE, {
      media_id: media.id,
      user_id: user.id,
      rating: value,
      type: RATING,
    })
    
    updateMedia()
  }

  function handleSubscriptionChange(media) {
    socket.emit(UPDATE, {
      series_id: media.series_id,
      subscribed: media.subscribed,
      user_id: user.id,
      type: SUBSCRIPTION,
    })

    updateMedia()
  }

  function handleLanguageChange(media, { target: { value } }) {
    socket.emit(UPDATE, {
      media_id: media.id,
      user_id: user.id,
      language: value,
      type: LANGUAGE,
    })

    updateMedia()
  }

  function handleSubtitlesChange(media, { target: { value } }) {
    socket.emit(UPDATE, {
      media_id: media.id,
      user_id: user.id,
      language: value,
      type: SUBTITLES,
    })

    updateMedia()
  }

  function updateMedia() {
    setTimeout(() => {
      getMedia({ id: user.id })
      getHistory({ id: user.id })
    }, 100)
  }

  const selectPage = page => {
    if (user) {
      if (page === HOME) {
        return (
          <Home
            media={media}
            history={history}
            onSearch={handleSearch}
            user={user}
            languages={languages}
            subtitles={subtitles}
            onHistoryChange={handleHistoryChange}
            onRatingChange={handleRatingChange}
            onLanguageChange={handleLanguageChange}
            onSubtitlesChange={handleSubtitlesChange}
            onSubscriptionChange={handleSubscriptionChange}
          />
        )
      } else if (page === HISTORY) {
        return (
          <History
            history={history}
            onHistory={getHistory}
            user={user}
            page={page}
            onHistoryChange={handleHistoryChange}
            onRatingChange={handleRatingChange}
            onLanguageChange={handleLanguageChange}
            onSubtitlesChange={handleSubtitlesChange}
            onSubscriptionChange={handleSubscriptionChange}
            languages={languages}
            subtitles={subtitles}
          />
        )
      } else {
        return <Settings />
      }
    } else {
      return <Login users={users} handleLogin={onLogin} />
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
