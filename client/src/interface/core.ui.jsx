import { Router } from '../components/core.cmp'

import { Home } from './home.ui'
import { Play } from './play.ui'
import { Join } from './join.ui'
import { Game } from './game.ui'

import { Controls } from './controls.ui'
import { Indicator } from './indicator.ui'


export const Interface = ({ ws, core }) => {
    return (
        <>
            <Router>
                <Home name='Home' />
                <Play name='Play' ws={ws} core={core} />
                <Join name='Join' ws={ws} core={core} />
                <Game name='Game' ws={ws} core={core} />
            </Router>
            <Controls core={core} />
            <Indicator />
        </>
    )
}