import { parse } from 'path';
import WebSocket, { WebSocketServer } from 'ws';

const express = require('express')
const app = express()
const port = 3000
const http = require("http");
const server = http.createServer(app)
// const wss = new WebSocketServer({ server })
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use('/public', express.static(__dirname + "/public"))


app.get('/', (req, res) => {
    res.render('home')
})

function publicRooms() {
    const { sockets: { adapter: { sids, rooms } } } = io
    const publicRoom = [];

    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRoom.push(key)
        }

    })
    return publicRoom
}

function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size
}
io.on('connection', socket => {
    socket['nickname'] = "Anon"
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName)
        done()
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName))
        io.sockets.emit('room_change', publicRooms())
    })
    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
        })
    })
    socket.on('disconnect', () => {
        io.sockets.emit('room_change', publicRooms())
    })
    socket.on('newMsg', (msg, room, done) => {
        socket.to(room).emit('sendMsg', `${socket.nickname}: ${msg}`)
        done()
    })
    socket.on('nickname', (nickname) => socket['nickname'] = nickname)
})


server.listen(port, () => {
    console.log(`${port}에 서버 시작`)
})

