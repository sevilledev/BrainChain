import { useEffect } from 'react'
import { STApp } from './stores/app.store'

import { Scene } from './scene/core.scene'
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
            let games = res.games
                .sort((a, b) => a.token - b.token)
                .sort((a, b) => a.duration - b.duration)
                .sort((a, b) => (a.players.all - a.players.joined) - (b.players.all - b.players.joined))
                .sort((a, b) => a.players.all - b.players.all)
            STApp.games = games
            STApp.filteredGames = games
        } else if (res.command === 'JOIN_LOBBY') {
            STApp.uiName = 'Home'
            if (res.action === 'leave') {
                STApp.lobby.props = {}
                STApp.isInLobby = false
            } else if (res.action == 'join') {
                STApp.lobby.props = res.game
                STApp.isInLobby = true
            }
        }
    }

    useEffect(() => {
        if (ws.readyState) {
            setTimeout(() => ws.send(JSON.stringify({ command: 'INIT_PLYR' })), 500)
        }
    }, [])


    return (
        <>
            <Scene core={core} />
            <Interface ws={ws} />
            <Alert.Container />
        </>
    )
}