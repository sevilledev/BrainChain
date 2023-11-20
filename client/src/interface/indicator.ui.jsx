import { useSnapshot } from 'valtio'
import { AnimatePresence, motion } from 'framer-motion'
import { STInLobby, STIndicator, STUI } from '../stores/app.store'
import { Icon } from '../components/core.cmp'

import sty from '../styles/modules/app.module.css'


export const Indicator = () => {
    const SSUI = useSnapshot(STUI)
    const SSInLobby = useSnapshot(STInLobby)
    const SSIndicator = useSnapshot(STIndicator)

    console.log('ind rendered')


    return (
        <div className={sty.indicatorHitSlop}>
            <AnimatePresence>
                {SSUI.name !== 'Home' && SSUI.name !== 'Join' && !SSInLobby.is && <motion.div className={sty.indicator}
                    initial={{ y: 70 }}
                    animate={{ y: 0 }}
                    exit={{ y: 70 }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                >
                    <div className={sty.indicatorIc}>
                        <Icon name={SSIndicator.topic.icon} size={30} color='--system-yellow' />
                    </div>
                    <div className={sty.indicatorPlayers}>
                        {Array(SSIndicator.players.all).fill().map((player, index) => {
                            return (
                                index < SSIndicator.players.joined
                                    ? <Icon name='person' size={30} color='--primary-tint' key={index} />
                                    : <Icon name='person-o' size={30} color='--primary-tint' key={index} />
                            )

                        })}
                    </div>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}