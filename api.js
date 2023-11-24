const { WebSocketServer, WebSocket } = require('ws')
const { genRandom, genGame, genColor } = require('./helpers/core.helpers')
const express = require('express')
const cors = require('cors')

const app = express()
const wss = new WebSocketServer({ port: 50001 })  // on production: 3001



// Storage

const lobby = {}
const rooms = {}
const liveGames = {}
var games = genGame(20)



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

const getQuiz = (count) => {
    const quiz = [
        {
            hasContent: false,
            quest: 'Desert is to oasis as ocean is to:',
            choices: ['Water', 'Sand', 'Sea', 'Island'],
            correct: 'Island'
        },
        {
            hasContent: true,
            quest: 'Which number follows?',
            content: '1, 4, 9, 16, 25',
            contentType: 'text',
            choices: ['27', '34', '36', '45'],
            correct: '36'
        },
        {
            hasContent: true,
            quest: 'Choose the conclusion that validly follows from the argument:',
            content: 'All kittens are playful. Some pets are kittens. Therefore:',
            contentType: 'text',
            choices: ['All kittens are pets', 'Some kittens are pets', 'All pets are playful', 'Some pets are playful'],
            correct: 'Some pets are playful'
        },
        {
            hasContent: false,
            quest: 'You are building an open-ended (straight) fence by stringing wire between posts 25 meters apart. If the fence is 100 meters long how many posts should you use?',
            choices: ['2', '3', '4', '5'],
            correct: '5'
        },
        {
            hasContent: true,
            quest: 'Rearrange the letters and select the correct category.',
            content: 'R A S P I',
            contentType: 'text',
            choices: ['City', 'Fruit', 'Animal', 'Vegetable'],
            correct: 'City'
        },
        {
            hasContent: false,
            quest: 'Real Madrid is first in the league, and Real Betis is fifth while Osasuna is right between them. If Barcelona has more points than Celta Vigo and Celta Vigo is exactly below Osasuna, who is second?',
            choices: ['Barcelona', 'Osasuna', 'Real Betis', 'Celta Vigo'],
            correct: 'Barcelona'
        },
        {
            hasContent: false,
            quest: 'If the day before yesterday is two days after Monday, then what day is it today?',
            choices: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
            correct: 'Friday'
        },
        {
            hasContent: false,
            quest: 'Zeta Leonis is both the fifth smallest and fifth largest star in a constellation. How many stars are there?',
            choices: ['8', '9', '10', '11'],
            correct: '9'
        },
        {
            hasContent: false,
            quest: 'Aztecs is to Mexico as Incas is to:',
            choices: ['Chile', 'Peru', 'Brazil', 'Cuba'],
            correct: 'Peru'
        },
        {
            hasContent: false,
            quest: 'Tiger is to stripes as leopard is to:',
            choices: ['Spots', 'Streaks', 'Paws', 'Tail'],
            correct: 'Spots'
        },
        {
            hasContent: true,
            quest: 'Which number follows?',
            content: '3, 9, 6, 12, 9, 15, 12, 18',
            contentType: 'text',
            choices: ['11', '14', '15', '21'],
            correct: '15'
        },
        {
            hasContent: false,
            quest: 'If two typists can type four pages in two minutes, how many typists will it take to type forty pages in ten minutes?',
            choices: ['2', '4', '6', '8'],
            correct: '4'
        },
        {
            hasContent: true,
            quest: 'Rearrange the letters and select the correct category.',
            content: 'F A R E F I G',
            contentType: 'text',
            choices: ['City', 'Fruit', 'Animal', 'Vegetable'],
            correct: 'Animal'
        },
        {
            hasContent: true,
            quest: 'Which letter follows?',
            content: 'T, Q, N, K, H',
            contentType: 'text',
            choices: ['F', 'E', 'D', 'G'],
            correct: 'E'
        },
        {
            hasContent: false,
            quest: 'Part is to trap as net is to:',
            choices: ['Ten', 'Whole', 'Web', 'Cover'],
            correct: 'Ten'
        },
    ]

    return quiz.sort(() => (Math.random() > .5) ? 1 : -1).slice(0, count)
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
            if (lobby[userID].activeGameID) {
                const activeGame = games.filter(g => g.id === lobby[userID].activeGameID)[0]

                if (activeGame) {
                    if (activeGame.players.joined === 1) {
                        delete rooms[activeGame.id]
                        games = games.filter(g => g.id !== activeGame.id)
                    } else {
                        activeGame.players.list = activeGame.players.list.filter(p => p.name !== req.name)
                        activeGame.players.joined--
                        delete rooms[lobby[userID].activeGameID][userID]

                        sendRoom(activeGame.id, { command: 'UPDT_GAME', game: activeGame })
                    }
                } else {
                    const liveGameID = lobby[userID].activeGameID

                    if (liveGames[liveGameID].players.joined === 1) {
                        delete rooms[liveGameID]
                        delete liveGames[liveGameID]
                    } else {
                        liveGames[liveGameID].players.list = liveGames[liveGameID].players.list.filter(p => p.name !== req.name)
                        liveGames[liveGameID].players.joined--
                        delete rooms[liveGameID][userID]

                        sendRoom(liveGameID, { command: 'UPDT_GAME', game: liveGames[liveGameID] })
                    }
                }

                lobby[userID].activeGameID = ''
            }

            let game = games.filter(g => g.id === req.id)[0]

            lobby[userID].activeGameID = game.id
            rooms[req.id][userID] = ws
            game.players.list.push({ name: req.name, color: req.color })
            game.players.joined++

            ws.send(JSON.stringify({ command: 'JOIN_GAME', game }))
            sendRoom(game.id, { command: 'UPDT_GAME', game })

            if (game.players.joined === game.players.all) {
                liveGames[game.id] = game
                games = games.filter(g => g.id !== game.id)
                sendRoom(game.id, { command: 'START_GAME', quiz: getQuiz(game.duration) })
            }

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

            lobby[userID].activeGameID = ''

            ws.send(JSON.stringify({ command: 'LEAVE_GAME', game }))
            sendRoom(game.id, { command: 'UPDT_GAME', game })
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
            lobby[userID].activeGameID = game.id
            rooms[game.id] = {}
            rooms[game.id][userID] = ws
            ws.send(JSON.stringify({ command: 'JOIN_GAME', game }))
            sendRoom(game.id, { command: 'UPDT_GAME', game })
            sendLobby({ command: 'UPDT_GAMES', games })
        }
    })

    ws.on('close', () => {
        console.log(`[${lobby[userID].name}]\x1b[1;31m Disconnected\x1b[0m 💀`)

        if (lobby[userID].activeGameID) {
            const activeGame = games.filter(g => g.id === lobby[userID].activeGameID)[0]

            if (activeGame) {
                if (activeGame.players.joined === 1) {
                    delete rooms[activeGame.id]
                    games = games.filter(g => g.id !== activeGame.id)
                } else {
                    activeGame.players.list = activeGame.players.list.filter(p => p.name !== lobby[userID].name)
                    activeGame.players.joined--
                    delete rooms[lobby[userID].activeGameID][userID]

                    sendRoom(activeGame.id, { command: 'UPDT_GAME', game: activeGame })
                }

                sendLobby({ command: 'UPDT_GAMES', games })
            } else {
                const liveGameID = lobby[userID].activeGameID

                if (liveGames[liveGameID].players.joined === 1) {
                    delete rooms[liveGameID]
                    delete liveGames[liveGameID]
                } else {
                    liveGames[liveGameID].players.list = liveGames[liveGameID].players.list.filter(p => p.name !== lobby[userID].name)
                    liveGames[liveGameID].players.joined--
                    delete rooms[liveGameID][userID]

                    sendRoom(liveGameID, { command: 'UPDT_GAME', game: liveGames[liveGameID] })
                }
            }

            lobby[userID].activeGameID = ''
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