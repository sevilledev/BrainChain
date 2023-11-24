import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STIndicator, STProfile } from '../stores/app.store'
import { Icon } from '../components/core.cmp'

import sty from '../styles/modules/app.module.css'


export const Play = ({ ws }) => {
    const SSIndicator = useSnapshot(STIndicator)
    const SSProfile = useSnapshot(STProfile)

    const icons = {
        'Anatomy': 'body',
        'Astronomy': 'planet',
        'Economics': 'bar-chart',
        'Geography': 'compass',
        'Language': 'language',
        'Mathematics': 'calculator',
        'Mixed': 'earth',
        'Music': 'musical-notes',
        'Sports': 'basketball'
    }


    const PlayBg = () => {
        const [toggle, setToggle] = useState()


        useEffect(() => {
            setTimeout(() => setToggle(!toggle), 800)
        }, [toggle])


        return (
            <motion.div style={{ gap: 3 }} className={sty.playBg}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ ease: 'easeOut', duration: 1.5 }}
            >
                {Array(400).fill().map((cube, index) => {
                    const toggle = Math.round(Math.random())
                    return (
                        <div key={index} style={{
                            width: 23.8,
                            height: 23.8,
                            opacity: 0.6,
                            backgroundColor: toggle ? 'var(--system-green)' : 'transparent',
                            transition: `all 1s linear ${Math.random().toFixed(2)}s`
                        }}></div>
                    )
                })}
            </motion.div>
        )
    }


    const changeFilter = (filter) => {
        if (filter === 'topic') {
            const topics = ['Anatomy', 'Astronomy', 'Economics', 'Geography', 'Language', 'Mathematics', 'Mixed', 'Music', 'Sports']
            let newTopic = topics.at(1 + topics.indexOf(SSIndicator.topic.name) - topics.length)
            STIndicator.topic = { name: newTopic, icon: icons[newTopic] }
        } else if (filter === 'players') {
            const playersCount = [2, 4, 6, 8]
            STIndicator.players.all = playersCount.at(1 + playersCount.indexOf(SSIndicator.players.all) - playersCount.length)
        } else if (filter === 'duration') {
            const durations = [5, 10, 15]
            STIndicator.duration = durations.at(1 + durations.indexOf(SSIndicator.duration) - durations.length)
        } else if (filter === 'token') {
            const tokens = [20, 50, 100, 150, 200]
            STIndicator.token = tokens.at(1 + tokens.indexOf(SSIndicator.token) - tokens.length)
        }
    }

    const createGame = () => {
        ws.send(JSON.stringify({ command: 'CREATE_GAME', game: { ...SSIndicator }, user: { name: SSProfile.name, color: SSProfile.color } }))
    }

    const leaveGame = () => {
        ws.send(JSON.stringify({ command: 'LEAVE_GAME', id: SSProfile.activeGameId, name: SSProfile.name }))
    }


    return (
        <div className={sty.play}>
            {!SSProfile.activeGameId && <div className={sty.playFilters}>
                <div className={sty.filter} onClick={() => changeFilter('topic')}>
                    <div className={sty.filterIc}>
                        <Icon name='book' size={24} color='--system-yellow' />
                    </div>
                    <div className={sty.filterBody}>
                        <h4 className={sty.filterTtl}>Topic</h4>
                        <h5 className={sty.filterSbtl}>{SSIndicator.topic.name}</h5>
                    </div>
                </div>
                <div className={sty.filter} onClick={() => changeFilter('players')}>
                    <div className={sty.filterIc}>
                        <Icon name='person' size={22} color='--primary-tint' />
                    </div>
                    <div className={sty.filterBody}>
                        <h4 className={sty.filterTtl}>Players</h4>
                        <h5 className={sty.filterSbtl}>{`${SSIndicator.players.all} players`}</h5>
                    </div>
                </div>
                <div className={sty.filter} onClick={() => changeFilter('duration')}>
                    <div className={sty.filterIc}>
                        <Icon name='timer-o' size={24} color='--primary-label' />
                    </div>
                    <div className={sty.filterBody}>
                        <h4 className={sty.filterTtl}>Duration</h4>
                        <h5 className={sty.filterSbtl}>{`${SSIndicator.duration} min`}</h5>
                    </div>
                </div>
                <div className={sty.filter} onClick={() => changeFilter('token')}>
                    <div className={sty.filterIc}>
                        <Icon name='brain-token' size={22} color='--system-pink' />
                    </div>
                    <div className={sty.filterBody}>
                        <h4 className={sty.filterTtl}>Token</h4>
                        <h5 className={sty.filterSbtl}>{`${SSIndicator.token} token`}</h5>
                    </div>
                </div>
            </div>}

            <div className={sty.playWrapper}>
                {SSProfile.activeGameId && <PlayBg />}
                <div className={sty.playGame}>
                    <div className={sty.playHeader}>
                        <Icon name={SSIndicator.topic.icon} size={50} color='--system-yellow' />
                        <div className={sty.playToken}>
                            <h5 className={sty.playTokenLbl}>{SSIndicator.token}</h5>
                            <Icon name='brain-token' size={48} color='--system-pink' />
                        </div>
                    </div>
                    <div className={sty.playTopic}>
                        <h2 className={sty.playTopicLbl}>{SSIndicator.topic.name}</h2>
                        <h5 className={sty.playDurationLbl}>{SSIndicator.duration} min</h5>
                    </div>
                    <div className={sty.playPlayers}>
                        {Array(SSIndicator.players.all).fill().map((player, index) => {
                            return (
                                index < (SSProfile.activeGameId ? SSIndicator.players.joined : 1)
                                    ? <Icon name='person' size={34} color='--primary-tint' key={index} />
                                    : <Icon name='person-o' size={34} color='--primary-tint' key={index} />
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className={sty.playBtns}>
                {!SSProfile.activeGameId
                    ? <button className={sty.playBtn} onClick={() => createGame()}>
                        <h2 className={sty.playBtnLbl}>Play</h2>
                    </button>
                    : <button className={sty.leaveBtn} onClick={() => leaveGame()}>
                        <h2 className={sty.leaveBtnLbl}>Leave</h2>
                    </button>
                }
            </div>
        </div>
    )
}