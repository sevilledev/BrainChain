import { useEffect } from 'react'
import { STGame, STGames, STIndicator, STProfile, STScene, STUI } from './stores/app.store'

import { Scene } from './scene/core.scn'
import { Interface } from './interface/core.ui'
import { Alert } from './components/core.cmp'


const core = {}
try { document.createEvent('TouchEvent'); core.isMobile = true } catch (e) { core.isMobile = false }

const ws = new WebSocket(`ws://${window.location.hostname}:50001`)  // on production: 3001


export const App = () => {

    ws.onmessage = (msg) => {
        const res = JSON.parse(msg.data)
        console.log(res)

        if (res.command === 'INIT_PLYR') {
            Object.assign(STProfile, res.user)
        } else if (res.command === 'JOIN_GAME') {
            STProfile.gameID = res.game.id
            STUI.value.showIndicator = true
            Object.assign(STIndicator, res.game)
            STScene.name = 'Game'
        } else if (res.command === 'LEAVE_GAME') {
            STScene.name = 'Lobby'
            STProfile.gameID = ''
            STUI.value.showIndicator = false
            Object.assign(STIndicator, { id: '', topic: { name: 'Anatomy', icon: 'body' }, duration: 5, token: 20, players: { all: 2, joined: 0, list: [] } })
        } else if (res.command === 'UPDT_GAME') {
            Object.assign(STIndicator, res.game)
        } else if (res.command === 'START_GAME') {
            STGame.quiz = res.quiz
            STGame.answers = Array(res.quiz.length).fill({})
            STUI.value.showIndicator = false
            STUI.value.showControls = false
            STUI.value.name = 'Game'
        } else if (res.command === 'UPDT_GAMES') {
            let games = res.games
                .sort((a, b) => a.token - b.token)
                .sort((a, b) => a.duration - b.duration)
                // .sort((a, b) => (a.players.all - a.players.joined) - (b.players.all - b.players.joined))
                .sort((a, b) => a.players.all - b.players.all)
            STGames.all = games
            STGames.filtered = games
        } else if (res.command === 'UPDT_ANSR') {
            STIndicator.answers = res.answers
        } else if (res.command === 'UPDT_PLYRS') {
            STIndicator.players = res.players
        } else if (res.command === 'FNSH_GAME') {
            STProfile.gameID = ''
            STGame.ui = res.winner.id === STProfile.id ? 'Win' : 'Lost'
        }
    }

    useEffect(() => {
        setTimeout(() => ws.send(JSON.stringify({ command: 'INIT_PLYR' })), 500)
    }, [])


    return (
        <>
            <Scene core={core} />
            <Interface ws={ws} />
            <Alert.Container />
        </>
    )
}