import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { STApp } from '../stores/app.store'

import { Home } from './home.ui'
import { Join } from './join.ui'
import { Controls } from './controls.ui'
import { Lobby } from './lobby.ui'

import sty from '../styles/modules/app.module.css'


const UISwap = (props) => {
    const appSnap = useSnapshot(STApp)

    const uiSwapVt = {
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.9, transitionEnd: { display: 'none' } }
    }


    return props.children.map((ui) => {
        return (
            <motion.div className={sty.uiSwap} key={ui.props.uiName}
                style={ui.props.uiName !== 'Home' && ui.props.uiName === appSnap.uiName && { display: 'flex' }}
                variants={uiSwapVt}
                animate={ui.props.uiName === appSnap.uiName ? 'in' : 'out'}
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
                <Home uiName='Home' />
                <Join uiName='Join' ws={ws} />
            </UISwap>
            <Controls />
            <Lobby />
        </>
    )
}