import { useSnapshot } from 'valtio'
import { AnimatePresence, motion } from 'framer-motion'
import { STIndicator, STUI } from '../stores/app.store'
import { Icon } from '../components/core.cmp'

import sty from '../styles/modules/app.module.css'


export const Indicator = () => {
    const SSUI = useSnapshot(STUI)
    const SSIndicator = useSnapshot(STIndicator)

    const exceptions = ['Home', 'Play', 'Join']

    return (
        <div className={sty.indicatorHitSlop}>
            <AnimatePresence>
                {!exceptions.includes(SSUI.name) && SSUI.showIndicator && <motion.div className={sty.indicator}
                    initial={{ y: 70 }}
                    animate={{ y: 0 }}
                    exit={{ y: 70 }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    onClick={() => STUI.name = 'Play'}
                >
                    <div className={sty.indicatorTopicIc}>
                        <Icon name={SSIndicator.topic.icon} size={30} color='--system-yellow' />
                    </div>
                    <div className={sty.indicatorPlayers}>
                        {Array(SSIndicator.players.all).fill().map((player, index) => {
                            return (
                                index < SSIndicator.players.joined
                                    ? <div className={sty.indicatorPlayerIc} key={index}>
                                        <Icon name='person' size={30} color='--primary-tint' />
                                        <div className='tooltip tooltipTop'>{SSIndicator.players.list[index].name}</div>
                                    </div>
                                    : <div className={sty.indicatorPlayerIc} key={index}>
                                        <Icon name='person-o' size={30} color='--primary-tint' />
                                        <div className='tooltip tooltipTop'>Waiting...</div>
                                    </div>
                            )

                        })}
                    </div>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}