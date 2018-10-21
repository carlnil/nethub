const {
  query,
  connection,
  connected,
  port,
  database,
  user,
  password,
} = require('./constants')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const sql = require('pg-promise')()({ database, user, password })

io.on(connection, socket => {
  socket.on(connected, async callback => {
    const users = await sql.any('SELECT * FROM users')
    const payload = { users }
    callback(payload)
  })

  socket.on(query, async (vars, callback) => {
    const { term, radio, rating, categories } = vars
    const media = await sql.any(
      `
      SELECT *
      FROM media m
      WHERE m.title LIKE %$1%
    `,
      [term]
    )
  })
})

server.listen(port)
