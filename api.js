const { WebSocketServer } = require('ws')
const { genRandom, genGame } = require('./helpers/core.helpers')
const express = require('express')
const cors = require('cors')

const app = express()
const wss = new WebSocketServer({ port: 50001 })  // on production: 3001



// Storage

var games = genGame(40)



// Middlewares

app.use(cors())
app.use(express.json())



// Functions

const init = () => {
    console.clear()
    console.log(`\x1b[33mApp running on 🔥\n\n\x1b[36m  http://localhost:${PORT}  \x1b[0m\n`); wss.on('error', console.error)
}



// Websocket

wss.on('connection', (ws) => {
    const userID = genRandom(4)

    ws.on('message', (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'INIT_PLYR') {
            ws.send(JSON.stringify({ command: 'INIT_PLYR', games }))
        } else if (req.command === 'JOIN_LOBBY') {
            let game = []
            if (req.action === 'join') {
                game = games.filter(g => g.id === req.id)[0]
                game.players.usernames.push(req.username)
                game.players.joined++
            }
            ws.send(JSON.stringify({ command: 'JOIN_LOBBY', action: req.action, game }))
        }
    })

    ws.on('close', () => {

    })

    ws.on('error', console.error)

})



// Routes

app.get('/api', (req, res) => res.json({ message: 'From api with love' }))



// Server

const PORT = 50000 // on production: 3000
app.listen(PORT, '0.0.0.0', () => init())