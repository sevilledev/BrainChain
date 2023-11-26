import { proxy } from 'valtio'


export const STUI = proxy({ name: 'Home', showControls: true, showIndicator: false })

export const STScene = proxy({ name: 'Lobby', state: '' })

export const STProfile = proxy({ isGuest: true, isInLobby: true, activeGameId: '', color: '', name: '', balance: 0 })

export const STFilters = proxy({ topic: 'All', players: 'All', duration: 'All', token: 'All' })

export const STIndicator = proxy({ id: '', topic: { name: 'Anatomy', icon: 'body' }, duration: 5, token: 20, players: { all: 2, joined: 0, list: [] } })

export const STGame = proxy(({ quiz: [], answers: [], questIndex: 0 }))

export const STGames = proxy({ all: [], filtered: [] })