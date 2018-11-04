const {
  SEARCH,
  HISTORY,
  CONNECTION,
  CONNECTED,
  PORT,
  USERS,
  LANGUAGES,
  SUBTITLES,
  MOVIES,
  LOGIN,
  SERIES,
  METADATA,
  UPDATE,
} = require('./constants')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const query = require('./query')

io.on(CONNECTION, socket => {
  socket.on(CONNECTED, async callback => {
    const users = await query(USERS)
    const languages = await query(LANGUAGES)
    const subtitles = await query(SUBTITLES)
    const metadata = await query(METADATA)
    callback(users, languages, subtitles, metadata)
  })

  socket.on(LOGIN, async (params, callback) => {
    const movies = await query(MOVIES, params)
    const series = await query(SERIES, params)
    callback(movies, series)
  })

  socket.on(SEARCH, async (params, callback) => {
    const media = await query(SEARCH, params)
    callback(media)
  })

  socket.on(HISTORY, async (params, callback) => {
    const media = await query(HISTORY, params)
    callback(media)
  })

  socket.on(UPDATE, async params => {
    query(UPDATE, params)
  })
})

server.listen(PORT)
