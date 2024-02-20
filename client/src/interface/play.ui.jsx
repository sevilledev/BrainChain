import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { usePostHog } from 'posthog-js/react'
import { STIndicator, STProfile } from '../stores/app.store'
import { Icon, Matrix } from '../components/core.cmp'

import sty from '../styles/modules/play.module.css'


export const Play = ({ ws, core }) => {
    const SSIndicator = useSnapshot(STIndicator)
    const SSProfile = useSnapshot(STProfile)

    const posthog = usePostHog()

    const icons = {
        'Anatomy': 'body',
        'Art': 'color-palette',
        'Astronomy': 'planet',
        'Cinema': 'film',
        'Economics': 'bar-chart',
        'Game': 'game-controller',
        'Geography': 'compass',
        'Mathematics': 'calculator',
        'Mixed': 'earth',
        'Music': 'musical-notes',
        'Sports': 'basketball',
        'Technology': 'code-slash'
    }


    const changeFilter = (filter) => {
        if (filter === 'topic') {
            const topics = ['Anatomy', 'Astronomy', 'Cinema', 'Economics', 'Game', 'Geography', 'Mathematics', 'Mixed', 'Music', 'Sports', 'Technology']
            let newTopic = topics.at(1 + topics.indexOf(SSIndicator.topic.name) - topics.length)
            STIndicator.topic = { name: newTopic, icon: icons[newTopic] }
        } else if (filter === 'players') {
            const playersCount = [2, 3, 4, 6, 8]
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
        posthog.capture('Created Game')
        ws.send(JSON.stringify({ command: 'CREATE_GAME', game: { ...SSIndicator }, user: { name: STProfile.name, color: STProfile.color } }))
    }

    const leaveGame = () => {
        posthog.capture('Canceled Game')
        ws.send(JSON.stringify({ command: 'LEAVE_GAME', id: SSProfile.gameID, name: SSProfile.name }))
    }


    return (
        <div className={sty.play}>
            <div className={sty.playCenter} style={{ width: 355, transform: `scale(${core.isMobile ? 0.65 : 1})` }}>
                <AnimatePresence>
                    {!SSProfile.gameID && <motion.div className={sty.filters}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                    >
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
                                <Icon name='reader' size={24} color='--primary-label' />
                            </div>
                            <div className={sty.filterBody}>
                                <h4 className={sty.filterTtl}>Questions</h4>
                                <h5 className={sty.filterSbtl}>{`${SSIndicator.duration} questions`}</h5>
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
                    </motion.div>}
                </AnimatePresence>

                <div className={sty.playWrapper}>
                    {SSProfile.gameID && <Matrix size={15} gap={3} />}
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
                            <h5 className={sty.playDurationLbl}>{SSIndicator.duration} questions</h5>
                        </div>
                        <div className={sty.playPlayers}>
                            {Array(SSIndicator.players.all).fill().map((player, index) => {
                                return (
                                    index < (SSProfile.gameID ? SSIndicator.players.joined : 1)
                                        ? <Icon name='person' size={34} color='--system-orange' key={index} />
                                        : <Icon name='person-o' size={34} color='--primary-tint' key={index} />
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className={sty.playBtns}>
                    {!SSProfile.gameID
                        ? <button className={sty.playBtn} onClick={() => createGame()}>
                            <h2 className={sty.playBtnLbl}>Play</h2>
                        </button>
                        : <button className={sty.leaveBtn} onClick={() => leaveGame()}>
                            <h2 className={sty.leaveBtnLbl}>Leave</h2>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}