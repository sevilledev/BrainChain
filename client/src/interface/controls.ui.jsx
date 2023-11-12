import { useEffect } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { STApp } from '../stores/app.store'
import { Icon } from '../components/core.cmp'

import sty from '../styles/modules/app.module.css'


export const Controls = () => {
    const appSnap = useSnapshot(STApp)
    const inActiveNavs = useAnimation()

    const navs = ['Play', 'Join', 'Discover', 'Tournaments', 'Community']
    

    const filterVt = (margin = 10, index) => {
        return {
            initial: { width: 0, marginLeft: 0, scale: 0, opacity: 0 },
            animate: { width: 'auto', marginLeft: `${margin}px`, scale: 1, opacity: 1, transition: { ease: 'easeInOut', duration: 0.3, delay: 0.1 * index } },
            exit: { width: 0, marginLeft: 0, scale: 0, opacity: 0, transition: { ease: 'easeInOut', duration: 0.3, delay: 0.1 * index } },
        }
    }


    const changeFilter = (filter) => {
        let { topic, players, duration, token } = appSnap.filters

        if (filter === 'topic') {
            const topics = ['All', 'Anatomy', 'Astronomy', 'Economics', 'Geography', 'Language', 'Mathematics', 'Mixed', 'Music', 'Sports']
            topic = topics.at(1 + topics.indexOf(appSnap.filters.topic) - topics.length)
            STApp.filters.topic = topic
        } else if (filter === 'players') {
            const playersCount = ['All', 2, 4, 6, 8]
            players = playersCount.at(1 + playersCount.indexOf(appSnap.filters.players) - playersCount.length)
            STApp.filters.players = players
        } else if (filter === 'duration') {
            const durations = ['All', 5, 10, 15, 20]
            duration = durations.at(1 + durations.indexOf(appSnap.filters.duration) - durations.length)
            STApp.filters.duration = duration
        } else if (filter === 'token') {
            const tokens = ['All', 20, 50, 100, 150, 200]
            token = tokens.at(1 + tokens.indexOf(appSnap.filters.token) - tokens.length)
            STApp.filters.token = token
        }

        let games = appSnap.games.filter(game => topic === 'All' ? game : game.topic.name === topic)
        games = games.filter(game => players === 'All' ? game : game.players.all === players)
        games = games.filter(game => duration === 'All' ? game : game.duration === duration)
        STApp.filteredGames = games.filter(game => token === 'All' ? game : game.token === token)
    }


    useEffect(() => {
        if (appSnap.uiName === 'Home') inActiveNavs.start({ width: 'unset', marginRight: '20px', opacity: 1 })
        else inActiveNavs.start({ width: 0, marginRight: 0, opacity: 0 })
    }, [appSnap.uiName])


    return (
        <div className={sty.controls}>
            <div className={sty.profile}>
                <Icon name='person-circle-o' size={30} color='--white' />
                {!appSnap.profile.isActive && <h5 className={sty.profileLbl}>Guest</h5>}
            </div>
            <div className={sty.navbar}>
                <div className={sty.menu}>
                    <div className={sty.menuIc} onClick={() => STApp.uiName = 'Home'} >
                        <Icon name='grid' size={24} color='--primary-tint' />
                    </div>
                    {navs.map((item) => {
                        return (
                            <motion.div className={sty.menuItem} key={item}
                                onClick={() => STApp.uiName = item}
                                animate={appSnap.uiName !== item && inActiveNavs}
                                transition={{ ease: 'easeInOut', duration: 0.6 }}
                            >
                                {item}
                            </motion.div>
                        )
                    })}
                </div>

                <AnimatePresence>
                    {appSnap.uiName === 'Join' && <motion.div className={sty.filters}
                    >
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
                                <h5 className={sty.filterSbtl}>{appSnap.filters.topic}</h5>
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
                                <h5 className={sty.filterSbtl}>{`${appSnap.filters.players}${appSnap.filters.players !== 'All' ? ' players' : ''}`}</h5>
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
                                <Icon name='timer-o' size={24} color='--primary-label' />
                            </div>
                            <div className={sty.filterBody}>
                                <h4 className={sty.filterTtl}>Duration</h4>
                                <h5 className={sty.filterSbtl}>{`${appSnap.filters.duration}${appSnap.filters.duration !== 'All' ? ' min' : ''}`}</h5>
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
                                <h5 className={sty.filterSbtl}>{`${appSnap.filters.token}${appSnap.filters.token !== 'All' ? ' token' : ''}`}</h5>
                            </div>
                        </motion.div>
                    </motion.div>}
                </AnimatePresence>
            </div>
            <div className={sty.balance}>
                <h5 className={sty.balanceLbl}>{appSnap.profile.balance}</h5>
                <Icon name='brain-token' size={24} color='--system-pink' />
            </div>
        </div>
    )
}