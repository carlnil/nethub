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

function queryGenerator({ term, radio, rating, categories }) {
  const query =
    radio === 'movies'
      ? `SELECT m.id, mo.title, mo.genre, mo.is_mature
         FROM media m
         JOIN movies mo
         ON m.id = mo.id
         WHERE LOWER(mo.title) LIKE LOWER('%$1:raw%')`
      : `SELECT e.id, s.title series, se.title season, e.episode_number, e.title, s.genre, s.is_mature
         FROM media m
         JOIN series s
         ON s.id = m.id
         JOIN seasons se
         ON s.id = se.series_id
         JOIN episodes e
         ON s.id = e.series_id
         WHERE LOWER(s.title) LIKE LOWER('%$1:raw%')
         `
  return { query, params: [term] }
}

io.on(connection, socket => {
  socket.on(connected, async callback => {
    const users = await sql.any('SELECT * FROM users')
    const payload = { users }
    callback(payload)
  })

  socket.on(query, async (vars, callback) => {
    const { query, params } = queryGenerator(vars)

    try {
      const media = await sql.any(query, params)
      const payload = { media }
      callback(payload)
    } catch (e) {
      throw e
    }
  })
})

server.listen(port)
