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
const games = genGame(50)



// Middlewares

app.use(cors())
app.use(express.json())



// Functions

const getArray = (from) => {
    return Object.values(from)
}

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
    Object.keys(games).forEach((id) => rooms[id] = {})
}



// Websocket

wss.on('connection', (ws) => {
    const userID = genRandom()

    ws.on('message', (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'INIT_PLYR') {
            const user = {
                id: userID,
                isGuest: true,
                isInLobby: true,
                gameID: '',
                balance: 100,
                color: genColor(),
                name: `Guest #${Math.round(Math.random() * 10000 - 1).toString().padEnd(4, '0')}`
            }

            Object.assign(ws, user)
            lobby[userID] = ws

            ws.send(JSON.stringify({ command: 'INIT_PLYR', user }))
            ws.send(JSON.stringify({ command: 'UPDT_GAMES', games: getArray(games) }))
            console.log(`[${lobby[userID].name}]\x1b[1;32m Joined\x1b[0m 🥳`)
        } else if (req.command === 'JOIN_GAME') {
            const liveGameID = lobby[userID].gameID

            if (liveGameID) {
                if (games[liveGameID]) {
                    if (games[liveGameID].players.joined === 1) {
                        delete rooms[liveGameID]
                        delete games[liveGameID]
                    } else {
                        games[liveGameID].players.list = games[liveGameID].players.list.filter(p => p.name !== req.name)
                        games[liveGameID].players.joined--
                        delete rooms[liveGameID][userID]

                        sendRoom(liveGameID, { command: 'UPDT_GAME', game: games[liveGameID] })
                    }
                } else {
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

                lobby[userID].gameID = ''
            }

            lobby[userID].gameID = req.id
            rooms[req.id][userID] = ws
            games[req.id].players.list.push({ id: userID, name: req.name, color: req.color, isFinished: false })
            games[req.id].players.joined++
            games[req.id].answers[userID] = Array(games[req.id].duration).fill({ answer: '', isTrue: null })

            ws.send(JSON.stringify({ command: 'JOIN_GAME', game: games[req.id] }))
            sendRoom(req.id, { command: 'UPDT_GAME', game: games[req.id] })

            if (games[req.id].players.joined === games[req.id].players.all) {
                liveGames[req.id] = games[req.id]
                liveGames[req.id].quiz = getQuiz(liveGames[req.id].duration)
                delete games[req.id]
                sendRoom(req.id, { command: 'START_GAME', quiz: liveGames[req.id].quiz })
            }

            sendLobby({ command: 'UPDT_GAMES', games: getArray(games) })
        } else if (req.command === 'LEAVE_GAME') {
            if (games[req.id].players.joined === 1) {
                delete rooms[req.id]
                delete games[req.id]
            } else {
                games[req.id].players.list = games[req.id].players.list.filter(p => p.name !== req.name)
                games[req.id].players.joined--
                delete rooms[req.id][userID]
            }

            lobby[userID].gameID = ''

            ws.send(JSON.stringify({ command: 'LEAVE_GAME', game: games[req.id] }))
            sendRoom(req.id, { command: 'UPDT_GAME', game: games[req.id] })
            sendLobby({ command: 'UPDT_GAMES', games: getArray(games) })
        } else if (req.command === 'CREATE_GAME') {
            const gameID = genRandom(8, 10)

            games[gameID] = {
                id: gameID,
                topic: req.game.topic,
                duration: req.game.duration,
                token: req.game.token,
                players: { all: req.game.players.all, joined: 1, list: [{ id: userID, name: req.user.name, color: req.user.color, isFinished: false }] },
                answers: { [userID]: Array(req.game.duration).fill({ answer: '', isTrue: null }) }
            }

            lobby[userID].gameID = gameID
            rooms[gameID] = {}
            rooms[gameID][userID] = ws
            ws.send(JSON.stringify({ command: 'JOIN_GAME', game: games[gameID] }))
            sendRoom(gameID, { command: 'UPDT_GAME', game: games[gameID] })
            sendLobby({ command: 'UPDT_GAMES', games: getArray(games) })
        } else if (req.command === 'SEND_ANSR') {
            if (req.answer) {
                liveGames[req.id].answers[userID][req.index] = { answer: req.answer, isTrue: req.answer === liveGames[req.id].quiz[req.index].correct }
                sendRoom(req.id, { command: 'UPDT_ANSR', answers: liveGames[req.id].answers })

                if (liveGames[req.id].answers[userID].findIndex(a => a.answer === '') === -1) {
                    liveGames[req.id].players.list[liveGames[req.id].players.list.findIndex(p => p.id === userID)].isFinished = true
                    sendRoom(req.id, { command: 'UPDT_PLYRS', players: liveGames[req.id].players })
                }
            } else {
                liveGames[req.id].players.list[liveGames[req.id].players.list.findIndex(p => p.id === userID)].isFinished = true
                sendRoom(req.id, { command: 'UPDT_PLYRS', players: liveGames[req.id].players })
            }

            if (liveGames[req.id].players.list.findIndex(p => p.isFinished === false) === -1) {
                let stats = []

                liveGames[req.id].players.list.forEach((player) => {
                    lobby[player.id].gameID = ''
                    
                    stats.push({
                        id: player.id,
                        name: player.name,
                        correct: liveGames[req.id].answers[player.id].filter(a => a.isTrue).length,
                        wrong: liveGames[req.id].answers[player.id].filter(a => a.isTrue === false).length,
                    })
                })

                stats = stats.sort((a, b) => a.wrong - b.wrong).sort((a, b) => b.correct - a.correct)

                sendRoom(req.id, { command: 'FNSH_GAME', winner: stats[0] })

                delete rooms[req.id]
                delete liveGames[req.id]
            }
        }
    })

    ws.on('close', () => {
        console.log(`[${lobby[userID].name}]\x1b[1;31m Disconnected\x1b[0m 💀`)

        const liveGameID = lobby[userID].gameID

        if (liveGameID) {
            if (games[liveGameID]) {
                if (games[liveGameID].players.joined === 1) {
                    delete rooms[liveGameID]
                    delete games[liveGameID]
                } else {
                    games[liveGameID].players.list = games[liveGameID].players.list.filter(p => p.name !== lobby[userID].name)
                    games[liveGameID].players.joined--
                    delete rooms[liveGameID][userID]

                    sendRoom(liveGameID, { command: 'UPDT_GAME', game: games[liveGameID] })
                }

                sendLobby({ command: 'UPDT_GAMES', games })
            } else {
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

            lobby[userID].gameID = ''
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