import { proxy } from 'valtio'

export const STApp = proxy({
    uiName: 'Home',
    profile: {
        isActive: false,
        username: 'Ariana Grande',
        balance: 780
    },
    isInLobby: false,
    lobby: { props: {}, players: [] },
    games: [],
    filteredGames: [],
    filters: { topic: 'All', players: 'All', duration: 'All', token: 'All' }
})