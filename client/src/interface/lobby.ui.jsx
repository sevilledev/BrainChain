import { useSnapshot } from 'valtio'
import { AnimatePresence, motion } from 'framer-motion'
import { STApp } from '../stores/app.store'
import { Icon } from '../components/core.cmp'

import sty from '../styles/modules/app.module.css'


export const Lobby = () => {
    const appSnap = useSnapshot(STApp)


    return (
        <div className={sty.lobbyHitSlop}>
            <AnimatePresence>
                {appSnap.uiName !== 'Home' && appSnap.uiName !== 'Join' && appSnap.isInLobby && <motion.div className={sty.lobby}
                    initial={{ y: 70 }}
                    animate={{ y: 0 }}
                    exit={{ y: 70 }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                >
                    <div className={sty.lobbyIc}>
                        <Icon name={appSnap.lobby.props.topic.icon} size={30} color='--system-yellow' />
                    </div>
                    <div className={sty.lobbyPlayers}>
                        {Array(appSnap.lobby.props.players.all).fill().map((player, index) => {
                            return (
                                index < appSnap.lobby.props.players.joined
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