const {
  SEARCH,
  HISTORY,
  CONNECTION,
  CONNECTED,
  PORT,
  DATABASE,
  USER,
  PASSWORD,
} = require('./constants')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const query = require('./query')

io.on(CONNECTION, socket => {
  socket.on(CONNECTED, async callback => {
    const users = await query(CONNECTED)
    callback(users)
  })

  socket.on(SEARCH, async (params, callback) => {
    const media = await query(SEARCH, params)
    callback(media)
  })

  socket.on(HISTORY, async (params, callback) => {
    const media = await query(HISTORY, params)
    callback(media)
  })
})

server.listen(PORT)
