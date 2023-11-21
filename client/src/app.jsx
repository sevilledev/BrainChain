import { useEffect } from 'react'
import { STGames, STInLobby, STIndicator, STProfile } from './stores/app.store'

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
            Object.assign(STProfile, res.user)
        } else if (res.command === 'JOIN_GAME') {
            STProfile.activeGameId = res.game.id
            STInLobby.is = false
            Object.assign(STIndicator, res.game)
        } else if (res.command === 'LEAVE_GAME') {
            STProfile.activeGameId = ''
            STInLobby.is = true
            Object.assign(STIndicator, { id: '', topic: { name: 'Anatomy', icon: 'body' }, duration: 5, token: 20, players: { all: 2, joined: 0, list: [] } })
        } else if (res.command === 'UPDT_GAME') {
            Object.assign(STIndicator, res.game)
        } else if (res.command === 'UPDT_GAMES') {
            let games = res.games
                .sort((a, b) => a.token - b.token)
                .sort((a, b) => a.duration - b.duration)
                // .sort((a, b) => (a.players.all - a.players.joined) - (b.players.all - b.players.joined))
                .sort((a, b) => a.players.all - b.players.all)
            STGames.all = games
            STGames.filtered = games
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