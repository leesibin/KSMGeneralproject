const { Server } = require('socket.io')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3000
const _path = path.join(__dirname, './vue/chat/dist')
console.log(_path)

app.use('/', express.static(_path))
app.use(logger('tiny'))

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

io.on('connection', (socket) => {
  socket.on('ALLuser', (name) => {
    // 소켓에 이름 저장해두기
    socket.name = name
    console.log(name)
    // 모든 소켓에게 전송
    io.sockets.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: name + '님이 접속하였습니다.'
    })
    // 메시지 전송
    socket.on('chat message', (data) => {
      data.name = socket.name
      io.emit('update', data)
    })
    socket.on('disconnect', () => {
      console.log(name + '퇴장')
      io.emit('update', {
        type: 'connect',
        name: 'SERVER',
        message: name + '님이 퇴장하셨습니다.'
      })
    })
  })
})

server.listen(port, () => {
  console.log(port + '에서 서버 동작 완료.')
})
