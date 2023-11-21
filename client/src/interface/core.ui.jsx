import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { STUI } from '../stores/app.store'

import { Home } from './home.ui'
import { Play } from './play.ui'
import { Join } from './join.ui'
import { Controls } from './controls.ui'
import { Indicator } from './indicator.ui'

import sty from '../styles/modules/app.module.css'


const UISwap = (props) => {
    const SSUI = useSnapshot(STUI)

    const uiSwapVt = {
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.9, transitionEnd: { display: 'none' } }
    }


    return props.children.map((ui) => {
        return (
            <motion.div className={sty.uiSwap} key={ui.props.name}
                style={ui.props.name !== 'Home' && ui.props.name === SSUI.name && { display: 'flex' }}
                variants={uiSwapVt}
                animate={ui.props.name === SSUI.name ? 'in' : 'out'}
                transition={{ ease: 'easeInOut', duration: 0.6 }}
            >
                {ui}
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
            </UISwap>
            <Controls />
            <Indicator />
        </>
    )
}