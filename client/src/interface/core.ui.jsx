import { Router } from '../components/core.cmp'

import { Home } from './home.ui'
import { Play } from './play.ui'
import { Join } from './join.ui'
import { Game } from './game.ui'

import { Controls } from './controls.ui'
import { Indicator } from './indicator.ui'


export const Interface = ({ ws }) => {
    return (
        <>
            <Router>
                <Home name='Home' />
                <Play name='Play' ws={ws} />
                <Join name='Join' ws={ws} />
                <Game name='Game' ws={ws} />
            </Router>
            <Controls />
            <Indicator />
        </>
    )
}