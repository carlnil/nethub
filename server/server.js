const { connection, port, database, user, password } = require('./constants')
const server = require('http').createServer()
const io = require('socket.io')(server)
const sql = require('pg-promise')()({database, user, password})

io.on(connection, socket => {
  console.log('hi')
})

server.listen(port)
