import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STUI, STProfile, STFilters, STGames } from '../stores/app.store'
import { Icon } from '../components/core.cmp'

import { Profile } from './profile.ui'

import sty from '../styles/modules/controls.module.css'


export const Controls = ({ core }) => {
    const SSUI = useSnapshot(STUI)
    const SSGames = useSnapshot(STGames)
    const SSProfile = useSnapshot(STProfile)
    const SSFilters = useSnapshot(STFilters)

    const posthog = usePostHog()

    const inActiveNavs = useAnimation()
    const activeNavs = useAnimation()

    const navs = ['Play', 'Create', 'Discover', 'Tournaments', 'Community']


    const Balance = () => {
        return (
            <div className={sty.balance}>
                <h5 className={sty.balanceLbl}>{SSProfile.balance}</h5>
                <Icon name='brain-token' size={24} color='--system-pink' />
            </div>
        )
    }


    const filterVt = (margin = 10, index) => {
        return {
            initial: { width: 0, marginLeft: 0, scale: 0, opacity: 0 },
            animate: { width: 'auto', marginLeft: `${margin}px`, scale: 1, opacity: 1, transition: { ease: 'easeInOut', duration: 0.3, delay: 0.1 * index } },
            exit: { width: 0, marginLeft: 0, scale: 0, opacity: 0, transition: { ease: 'easeInOut', duration: 0.3, delay: 0.1 * index } },
        }
    }


    const changeFilter = (filter) => {
        let { topic, players, duration, token } = SSFilters

        if (filter === 'topic') {
            const topics = ['All', 'Anatomy', 'Art', 'Astronomy', 'Cinema', 'Economics', 'Game', 'Geography', 'Mathematics', 'Mixed', 'Music', 'Sports', 'Technology']
            topic = topics.at(1 + topics.indexOf(SSFilters.topic) - topics.length)
            STFilters.topic = topic
        } else if (filter === 'players') {
            const playersCount = ['All', 2, 3, 4, 6, 8]
            players = playersCount.at(1 + playersCount.indexOf(SSFilters.players) - playersCount.length)
            STFilters.players = players
        } else if (filter === 'duration') {
            const durations = ['All', 5, 10, 15]
            duration = durations.at(1 + durations.indexOf(SSFilters.duration) - durations.length)
            STFilters.duration = duration
        } else if (filter === 'token') {
            const tokens = ['All', 20, 50, 100, 150, 200]
            token = tokens.at(1 + tokens.indexOf(SSFilters.token) - tokens.length)
            STFilters.token = token
        }

        let games = SSGames.all.filter(game => topic === 'All' ? game : game.topic.name === topic)
        games = games.filter(game => players === 'All' ? game : game.players.all === players)
        games = games.filter(game => duration === 'All' ? game : game.duration === duration)
        STGames.filtered = games.filter(game => token === 'All' ? game : game.token === token)
    }


    useEffect(() => {
        posthog.capture('Navigated', { page: SSUI.value.name })

        if (SSUI.value.name === 'Home') inActiveNavs.start({ width: 'unset', marginRight: '20px', opacity: 1 })
        else {
            inActiveNavs.start({ width: 0, marginRight: 0, opacity: 0 })
            activeNavs.start({ width: 'unset', marginRight: '20px', opacity: 1 })
        }
    }, [SSUI.value.name])


    return (
        <div className={sty.controlsHitSlop}>
            <AnimatePresence>
                {SSUI.value.showControls && <motion.div className={sty.controls} style={{ flexDirection: core.isMobile ? 'column' : 'row' }}
                    initial={{ y: -115 }}
                    animate={{ y: 0 }}
                    exit={{ y: -115 }}
                    transition={{ duration: 0.8, delay: SSUI.history.index === 0 ? 2.2 : 0 }}
                >
                    {!core.isMobile && <Profile core={core} />}

                    <div className={sty.navbar} style={{ transform: `scale(${core.isMobile ? 0.60 : 1})` }}>
                        <div className={sty.menu}>
                            <div className={sty.menuIc} onClick={() => STUI.value.name = 'Home'} >
                                <Icon name='grid' size={24} color='--primary-tint' />
                            </div>
                            {navs.map((item) => {
                                return (
                                    <motion.div className={sty.menuItem} key={item}
                                        onClick={() => STUI.value.name = item}
                                        animate={SSUI.value.name === item ? activeNavs : inActiveNavs}
                                        transition={{ ease: 'easeInOut', duration: 0.6 }}
                                    >
                                        {item}
                                    </motion.div>
                                )
                            })}
                        </div>

                        <AnimatePresence>
                            {SSUI.value.name === 'Play' && <motion.div className={sty.filters}>
                                <motion.div className={sty.filter}
                                    variants={filterVt(15, 0)}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    onClick={() => changeFilter('topic')}
                                >
                                    <div className={sty.filterIc}>
                                        <Icon name='book' size={24} color='--system-yellow' />
                                    </div>
                                    <div className={sty.filterBody}>
                                        <h4 className={sty.filterTtl}>Topic</h4>
                                        <h5 className={sty.filterSbtl}>{SSFilters.topic}</h5>
                                    </div>
                                </motion.div>
                                <motion.div className={sty.filter}
                                    variants={filterVt(10, 1)}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    onClick={() => changeFilter('players')}
                                >
                                    <div className={sty.filterIc}>
                                        <Icon name='person' size={22} color='--primary-tint' />
                                    </div>
                                    <div className={sty.filterBody}>
                                        <h4 className={sty.filterTtl}>Players</h4>
                                        <h5 className={sty.filterSbtl}>{`${SSFilters.players}${SSFilters.players !== 'All' ? ' players' : ''}`}</h5>
                                    </div>
                                </motion.div>
                                <motion.div className={sty.filter}
                                    variants={filterVt(10, 2)}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    onClick={() => changeFilter('duration')}
                                >
                                    <div className={sty.filterIc}>
                                        <Icon name='reader' size={24} color='--primary-label' />
                                    </div>
                                    <div className={sty.filterBody}>
                                        <h4 className={sty.filterTtl}>Questions</h4>
                                        <h5 className={sty.filterSbtl}>{`${SSFilters.duration}${SSFilters.duration !== 'All' ? ' questions' : ''}`}</h5>
                                    </div>
                                </motion.div>
                                <motion.div className={sty.filter}
                                    variants={filterVt(10, 3)}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    onClick={() => changeFilter('token')}
                                >
                                    <div className={sty.filterIc}>
                                        <Icon name='brain-token' size={22} color='--system-pink' />
                                    </div>
                                    <div className={sty.filterBody}>
                                        <h4 className={sty.filterTtl}>Token</h4>
                                        <h5 className={sty.filterSbtl}>{`${SSFilters.token}${SSFilters.token !== 'All' ? ' token' : ''}`}</h5>
                                    </div>
                                </motion.div>
                            </motion.div>}
                        </AnimatePresence>
                    </div>

                    {core.isMobile && <div className={sty.mobNav}>
                        <Profile core={core} />
                        <Balance />
                    </div>}

                    {!core.isMobile && <Balance />}
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}