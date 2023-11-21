const { WebSocketServer, WebSocket } = require('ws')
const { genRandom, genGame, genColor } = require('./helpers/core.helpers')
const express = require('express')
const cors = require('cors')

const app = express()
const wss = new WebSocketServer({ port: 50001 })  // on production: 3001



// Storage

const lobby = {}
const rooms = {}
var games = genGame(4)



// Middlewares

app.use(cors())
app.use(express.json())



// Functions

const sendLobby = (obj) => {
    for (const userID in lobby) {
        if (lobby[userID].readyState === WebSocket.OPEN) lobby[userID].send(JSON.stringify(obj))
    }
}

const sendRoom = (id, obj) => {
    for (const userID in rooms[id]) {
        if (rooms[id][userID].readyState === WebSocket.OPEN) rooms[id][userID].send(JSON.stringify(obj))
    }
}

const init = () => {
    console.clear()
    console.log(`\x1b[33mApp running on 🔥\n\n\x1b[36m  http://localhost:${PORT}  \x1b[0m\n`); wss.on('error', console.error)

    // For generated games
    games.forEach((game) => rooms[game.id] = {})
}



// Websocket

wss.on('connection', (ws) => {
    const userID = genRandom()

    ws.on('message', (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'INIT_PLYR') {
            const user = {
                isGuest: true,
                isInLobby: true,
                activeGameId: '',
                balance: 100,
                color: genColor(),
                name: `Guest #${Math.round(Math.random() * 10000 - 1).toString().padEnd(4, '0')}`
            }

            Object.assign(ws, user)
            lobby[userID] = ws

            ws.send(JSON.stringify({ command: 'INIT_PLYR', user, games }))
            ws.send(JSON.stringify({ command: 'UPDT_GAMES', games }))
            console.log(`[${lobby[userID].name}]\x1b[1;32m Joined\x1b[0m 🥳`)
        } else if (req.command === 'JOIN_GAME') {
            let game = games.filter(g => g.id === req.id)[0]

            if (lobby[userID].activeGameId) {
                const activeGame = games.filter(g => g.id === lobby[userID].activeGameId)[0]

                if (activeGame.players.joined === 1) {
                    delete rooms[activeGame.id]
                    games = games.filter(g => g.id !== activeGame.id)
                } else {
                    activeGame.players.list = activeGame.players.list.filter(p => p.name !== req.name)
                    activeGame.players.joined--
                    delete rooms[lobby[userID].activeGameId][userID]
                }

                lobby[userID].activeGameId = ''
            }

            lobby[userID].activeGameId = game.id
            rooms[req.id][userID] = ws
            game.players.list.push({ name: req.name, color: req.color })
            game.players.joined++

            ws.send(JSON.stringify({ command: 'JOIN_GAME', game }))
            sendRoom(lobby[userID].activeGameId, { command: 'UPDT_GAME', game })
            sendLobby({ command: 'UPDT_GAMES', games })
        } else if (req.command === 'LEAVE_GAME') {
            let game = games.filter(g => g.id === req.id)[0]

            if (game.players.joined === 1) {
                delete rooms[game.id]
                games = games.filter(g => g.id !== game.id)
            } else {
                game.players.list = game.players.list.filter(p => p.name !== req.name)
                game.players.joined--
                delete rooms[game.id][userID]
            }

            lobby[userID].activeGameId = ''

            ws.send(JSON.stringify({ command: 'LEAVE_GAME', game }))
            sendRoom(lobby[userID].activeGameId, { command: 'UPDT_GAME', game })
            sendLobby({ command: 'UPDT_GAMES', games })
        } else if (req.command === 'CREATE_GAME') {
            const game = {
                id: genRandom(8, 10),
                topic: req.game.topic,
                duration: req.game.duration,
                token: req.game.token,
                players: { all: req.game.players.all, joined: 1, list: [{ name: req.user.name, color: req.user.color }] }
            }
            games.push(game)
            lobby[userID].activeGameId = game.id
            rooms[game.id] = {}
            rooms[game.id][userID] = ws
            ws.send(JSON.stringify({ command: 'JOIN_GAME', game }))
            sendRoom(lobby[userID].activeGameId, { command: 'UPDT_GAME', game })
            sendLobby({ command: 'UPDT_GAMES', games })
        }
    })

    ws.on('close', () => {
        console.log(`[${lobby[userID].name}]\x1b[1;31m Disconnected\x1b[0m 💀`)
        if (lobby[userID].activeGameId) {
            const activeGame = games.filter(g => g.id === lobby[userID].activeGameId)[0]
            activeGame.players.list = activeGame.players.list.filter(p => p.name !== lobby[userID].name)
            activeGame.players.joined--
            sendRoom(lobby[userID].activeGameId, { command: 'UPDT_GAME', game: games[games.findIndex(g => g.id === lobby[userID].activeGameId)] })
            sendLobby({ command: 'UPDT_GAMES', games })
            delete rooms[lobby[userID].activeGameId][userID]
        }
        delete lobby[userID]
    })

    ws.on('error', console.error)

})



// Routes

app.get('/api', (req, res) => res.json({ message: 'From api with love' }))



// Server

const PORT = 50000 // on production: 3000
app.listen(PORT, '0.0.0.0', () => init())