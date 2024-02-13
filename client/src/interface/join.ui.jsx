import { motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { usePostHog } from 'posthog-js/react'
import { Icon, Matrix } from '../components/core.cmp'
import { STGames, STProfile } from '../stores/app.store'

import sty from '../styles/modules/join.module.css'


export const Join = ({ ws, core }) => {
    const SSProfile = useSnapshot(STProfile)
    const SSGames = useSnapshot(STGames)

    const posthog = usePostHog()


    const actGame = (game) => {
        const act = game.id === SSProfile.gameID
        posthog.capture(act ? 'Left Game' : 'Joined Game')
        ws.send(JSON.stringify({ command: act ? 'LEAVE_GAME' : 'JOIN_GAME', id: game.id, name: SSProfile.name, color: SSProfile.color }))
    }


    return (
        <div className={sty.join}>
            <div className={sty.games} style={{ width: core.isMobile ? '100%' : '80%', gap: core.isMobile ? 25 : 20 }}>
                {SSGames.filtered.map((game) => {
                    return (
                        <motion.div className={sty.gameWrapper} key={game.id}
                            style={{ width: core.isMobile ? 'calc(50vw - 40px)' : 198, height: core.isMobile ? 'calc(50vw - 40px)' : 198 }}
                            initial={{ backdropFilter: 'inherit', WebkitBackdropFilter: 'inherit' }}
                            animate={{ backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            {SSProfile.gameID === game.id && (
                                core.isMobile
                                    ? <Matrix size={9} gap={2} />
                                    : <Matrix size={10} gap={2} />
                            )}
                            <div className={sty.gameCard} onClick={() => actGame(game)} style={{ width: core.isMobile ? '100%' : 198, height: core.isMobile ? '100%' : 198 }}>
                                <div className={sty.gameHeader}>
                                    <Icon name={game.topic.icon} size={34} color='--system-yellow' />
                                    <div className={sty.gameToken}>
                                        <h5 className={sty.gameTokenLbl}>{game.token}</h5>
                                        <Icon name='brain-token' size={32} color='--system-pink' />
                                    </div>
                                </div>
                                <div className={sty.gameTopic}>
                                    <h2 className={sty.gameTopicLbl}>{game.topic.name}</h2>
                                    <h5 className={sty.gameDurationLbl}>{game.duration} questions</h5>
                                </div>
                                <div className={sty.gamePlayers}>
                                    {Array(game.players.all).fill().map((player, index) => {
                                        return (
                                            index < game.players.joined
                                                ? <Icon name='person' size={20} color='--primary-tint' key={index} />
                                                : <Icon name='person-o' size={20} color='--primary-tint' key={index} />
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}