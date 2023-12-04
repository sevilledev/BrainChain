import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { STPrevUI, STUI } from '../../stores/app.store'

import sty from './router.module.css'


export const Router = ({ children }) => {
    const SSUI = useSnapshot(STUI)
    const SSPrevUI = useSnapshot(STPrevUI)


    const routerVt = {
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.9, transitionEnd: { display: 'none' } }
    }


    useEffect(() => {
        setTimeout(() => STPrevUI.name = SSUI.value.name, 600)
    }, [SSUI.value.name])


    return children.map((ui) => {
        return (
            <motion.div className={sty.router} key={ui.props.name}
                style={ui.props.name !== 'Home' && ui.props.name === SSUI.value.name && { display: 'flex' }}
                variants={routerVt}
                animate={ui.props.name === SSUI.value.name ? 'in' : 'out'}
                transition={{ ease: 'easeInOut', duration: 0.6 }}
            >
                {(ui.props.name === SSUI.value.name || ui.props.name === SSPrevUI.name) && ui}
            </motion.div>
        )
    })
}