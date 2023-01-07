import WebSocket, { WebSocketServer } from 'ws';

const express = require('express')
const app = express()
const port = 3000
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use('/public', express.static(__dirname + "/public"))



app.get('/', (req, res) => {
    res.render('home')
})


server.listen(port, () => {
    console.log(`${port}에 서버 시작`)
})

