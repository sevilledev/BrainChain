import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import { STPrevUI, STUI } from '../../stores/app.store'

import sty from './router.module.css'


export const Router = (props) => {
    const SSUI = useSnapshot(STUI)
    const SSPrevUI = useSnapshot(STPrevUI)


    const routerVt = {
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 0.9, transitionEnd: { display: 'none' } }
    }


    useEffect(() => {
        STPrevUI.show = true
        setTimeout(() => STPrevUI.show = false, 600)
    }, [SSUI.value.name])


    return props.children.map((ui) => {
        return (
            <motion.div className={sty.router} key={ui.props.name}
                style={ui.props.name !== 'Home' && ui.props.name === SSUI.value.name && { display: 'flex' }}
                variants={routerVt}
                animate={ui.props.name === SSUI.value.name ? 'in' : 'out'}
                transition={{ ease: 'easeInOut', duration: 0.6 }}
            >
                {((ui.props.name === SSUI.value.name) || (SSPrevUI.show && ui.props.name === SSUI.history.snapshots[SSUI.history.index - 1]?.name)) && ui}
            </motion.div>
        )
    })
}