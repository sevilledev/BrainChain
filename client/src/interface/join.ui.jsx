import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { Icon } from '../components/core.cmp'
import { STApp } from '../stores/app.store'

import sty from '../styles/modules/app.module.css'


export const Join = ({ ws }) => {
    const appSnap = useSnapshot(STApp)


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


    const joinGame = (game) => {
        ws.send(JSON.stringify({ command: 'JOIN_LOBBY', action: game.id === appSnap.lobby.props.id ? 'leave' : 'join', id: game.id, username: appSnap.profile.username }))
    }


    return (
        <div className={sty.join}>
            <div className={sty.games}>
                {appSnap.filteredGames.map((game) => {
                    return (
                        <div className={sty.gameWrapper} key={game.id}>
                            {appSnap.lobby.props.id === game.id && <GameBg />}
                            <div className={sty.game} onClick={() => joinGame(game)}>
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