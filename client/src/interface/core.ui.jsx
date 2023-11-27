import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { STPrevUI, STUI } from '../stores/app.store'

import { Home } from './home.ui'
import { Play } from './play.ui'
import { Join } from './join.ui'
import { Game } from './game.ui'
import { Controls } from './controls.ui'
import { Indicator } from './indicator.ui'

import sty from '../styles/modules/app.module.css'


const UISwap = (props) => {
    const SSUI = useSnapshot(STUI)
    const SSPrevUI = useSnapshot(STPrevUI)


    const uiSwapVt = {
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.9, transitionEnd: { display: 'none' } }
    }

    
    useEffect(() => {
        STPrevUI.show = true
        setTimeout(() => STPrevUI.show = false, 600)
    }, [SSUI.value.name])


    return props.children.map((ui) => {
        return (
            <motion.div className={sty.uiSwap} key={ui.props.name}
                style={ui.props.name !== 'Home' && ui.props.name === SSUI.value.name && { display: 'flex' }}
                variants={uiSwapVt}
                animate={ui.props.name === SSUI.value.name ? 'in' : 'out'}
                transition={{ ease: 'easeInOut', duration: 0.6 }}
            >
                {((ui.props.name === SSUI.value.name) || (SSPrevUI.show && ui.props.name === SSUI.history.snapshots[SSUI.history.index - 1]?.name)) && ui}
            </motion.div>
        )
    })
}


export const Interface = ({ ws }) => {
    return (
        <>
            <UISwap>
                <Home name='Home' />
                <Play name='Play' ws={ws} />
                <Join name='Join' ws={ws} />
                <Game name='Game' ws={ws} />
            </UISwap>
            <Controls />
            <Indicator />
        </>
    )
}