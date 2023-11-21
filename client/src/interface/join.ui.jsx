import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { Icon } from '../components/core.cmp'
import { STGames, STProfile } from '../stores/app.store'

import sty from '../styles/modules/app.module.css'


export const Join = ({ ws }) => {
    const SSProfile = useSnapshot(STProfile)
    const SSGames = useSnapshot(STGames)


    const GameBg = () => {
        const [toggle, setToggle] = useState()


        useEffect(() => {
            setTimeout(() => setToggle(!toggle), 800)
        }, [toggle])


        return (
            <motion.div style={{ gap: 2 }} className={sty.gameBg}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ ease: 'easeOut', duration: 1.5 }}
            >
                {Array(100).fill().map((cube, index) => {
                    const toggle = Math.round(Math.random())
                    return (
                        <div key={index} style={{
                            width: 18.2,
                            height: 18.2,
                            opacity: 0.6,
                            backgroundColor: toggle ? 'var(--system-green)' : 'transparent',
                            transition: `all 1s linear ${Math.random().toFixed(2)}s`
                        }}></div>
                    )
                })}
            </motion.div>
        )
    }


    const actGame = (game) => {
        ws.send(JSON.stringify({ command: game.id === SSProfile.activeGameId ? 'LEAVE_GAME' : 'JOIN_GAME', id: game.id, name: SSProfile.name, color: SSProfile.color }))
    }


    return (
        <div className={sty.join}>
            <div className={sty.games}>
                {SSGames.filtered.map((game) => {
                    return (
                        <div className={sty.gameWrapper} key={game.id}>
                            {SSProfile.activeGameId === game.id && <GameBg />}
                            <div className={sty.game} onClick={() => actGame(game)}>
                                <div className={sty.gameHeader}>
                                    <Icon name={game.topic.icon} size={34} color='--system-yellow' />
                                    <div className={sty.gameToken}>
                                        <h5 className={sty.gameTokenLbl}>{game.token}</h5>
                                        <Icon name='brain-token' size={32} color='--system-pink' />
                                    </div>
                                </div>
                                <div className={sty.gameTopic}>
                                    <h2 className={sty.gameTopicLbl}>{game.topic.name}</h2>
                                    <h5 className={sty.gameDurationLbl}>{game.duration} min</h5>
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
                        </div>
                    )
                })}
            </div>
        </div>
    )
}