import { proxy } from 'valtio'
import { proxyWithHistory } from 'valtio/utils'


export const STUI = proxyWithHistory({ name: 'Home', showControls: true, showIndicator: false })

export const STApp = proxy({ render: false })

export const STPrevUI = proxy({ name: 'Home' })

export const STScene = proxy({ name: 'Lobby', state: '' })

export const STProfile = proxy({ id: '', isInLobby: true, gameID: '', color: '', name: '', email: '', balance: 0, isGuest: true })

export const STSettings = proxy({ ui: '' })

export const STFilters = proxy({ topic: 'All', players: 'All', duration: 'All', token: 'All' })

export const STIndicator = proxy({ id: '', topic: { name: 'Anatomy', icon: 'body' }, duration: 5, token: 20, players: { all: 2, joined: 0, list: [] }, answers: {} })

export const STGame = proxy(({ quiz: [], answers: [], questIndex: 0, ui: 'Countdown', stats: [], winner: {} }))

export const STClock = proxy({ countdown: 5, timer: 0, prevTimer: 0 })

export const STGames = proxy({ all: [], filtered: [] })