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
  COMPLETED_SEASONS,
  DATABASE,
  USER,
  PASSWORD,
  NEW_EPISODE,
  GET_SUBSCRIPTIONS,
  SUBSCRIPTIONS,
} = require('./constants')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const query = require('./query')

const sql = require('pg-promise')()({
  database: DATABASE,
  user: USER,
  password: PASSWORD,
})

io.on(CONNECTION, socket => {
  let connection
  sql.connect({ direct: true }).then(sco => {
    connection = sco
    sco.client.on('notification', data => {
      socket.emit(NEW_EPISODE, data.payload[data.payload.length - 1])
    })
    return sco.none('LISTEN $1~', 'watchers')
  })

  if (connection) connection.done()

  socket.on(CONNECTED, async callback => {
    const users = await query(sql, USERS)
    const languages = await query(sql, LANGUAGES)
    const subtitles = await query(sql, SUBTITLES)
    const metadata = await query(sql, METADATA)
    callback(users, languages, subtitles, metadata)
  })

  socket.on(GET_SUBSCRIPTIONS, async (params, callback) => {
    const subscriptions = await query(sql, SUBSCRIPTIONS, params)
    callback(subscriptions)
  })

  socket.on(LOGIN, async (params, callback) => {
    const movies = await query(sql, MOVIES, params)
    const series = await query(sql, SERIES, params)
    callback(movies, series)
  })

  socket.on(COMPLETED_SEASONS, async (params, callback) => {
    const completedSeasons = await query(sql, COMPLETED_SEASONS, params)
    callback(completedSeasons)
  })

  socket.on(SEARCH, async (params, callback) => {
    const media = await query(sql, SEARCH, params)
    callback(media)
  })

  socket.on(HISTORY, async (params, callback) => {
    const media = await query(sql, HISTORY, params)
    callback(media)
  })

  socket.on(UPDATE, async params => {
    query(sql, UPDATE, params)
  })
})

server.listen(PORT)
module.exports = { io }
