import { parse } from 'path';
import WebSocket, { WebSocketServer } from 'ws';

const express = require('express')
const app = express()
const port = 3000
const http = require("http");
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use('/public', express.static(__dirname + "/public"))


app.get('/', (req, res) => {
    res.render('home')
})


const sockets = []
wss.on("connection", (socket) => {
    sockets.push(socket)
    socket['nickname'] = "Anon"
    console.log('Server is Open ✅')
    socket.on('message', (msg) => {
        const parseMsg = JSON.parse(msg)
        switch (parseMsg.type) {
            case "message":
                sockets.forEach((a) => { a.send(`${socket.nickname}: ${parseMsg.payload.toString()}`) })
            case "nickname":
                socket['nickname'] = parseMsg.payload
        }

    })
    socket.on('close', () => {
        console.log('Server is Close ❌')
    })
})

server.listen(port, () => {
    console.log(`${port}에 서버 시작`)
})

