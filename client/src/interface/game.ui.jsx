import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { Icon } from '../components/core.cmp'

import { STGame, STIndicator, STProfile, STClock, STUI, STScene } from '../stores/app.store'

import sty from '../styles/modules/game.module.css'


let interval = null


const Router = ({ children }) => {
    const SSGame = useSnapshot(STGame)

    return children.filter(ui => ui.props.name === SSGame.ui)
}


const Countdown = () => {
    const SSClock = useSnapshot(STClock)

    const countdownAnim = useAnimation()


    useEffect(() => {
        interval = setInterval(() => {
            if (SSClock.countdown > 1) {
                countdownAnim.set({ opacity: 1, scale: 1 })
                countdownAnim.start({ opacity: 0, scale: 0.6 })
                STClock.countdown = SSClock.countdown - 1
            } else {
                clearInterval(interval)
                STGame.ui = 'Quiz'
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [SSClock.countdown])


    return (
        <motion.h1 className={sty.countdown}
            initial={{ opacity: 1 }}
            animate={countdownAnim}
            exit={{ opacity: 1 }}
            transition={{ ease: 'easeIn', duration: 0.8, delay: 0.2 }}
        >{SSClock.countdown}</motion.h1>
    )
}


const Quiz = ({ ws, core }) => {
    const SSClock = useSnapshot(STClock)
    const SSGame = useSnapshot(STGame)
    const SSProfile = useSnapshot(STProfile)

    const timerAnim = useAnimation()
    const barAnim = useAnimation()


    const getNavStyle = (answer, index) => {
        let backgroundColor = 'var(--primary-fill)'
        let pointerEvents = 'default'
        let cursor = 'pointer'

        if (answer.hasOwnProperty('result')) {
            backgroundColor = answer.result ? '#30D1582B' : '#FF453A2B'
            pointerEvents = 'none'
            cursor = 'default'
        } else if (index === SSGame.questIndex) {
            backgroundColor = 'var(--system-yellow)'
        }

        return { backgroundColor, pointerEvents, cursor }
    }

    const navigate = (to) => {
        if (to === 'forward') {
            const nextIndex = STGame.answers.findIndex((a, i) => i > STGame.questIndex && !a.hasOwnProperty('result'))
            const lastIndex = STGame.answers.findIndex(a => !a.hasOwnProperty('result'))

            if (lastIndex !== -1) {
                STGame.questIndex = nextIndex !== -1 ? nextIndex : lastIndex
            } else {
                clearInterval(interval)
                STGame.ui = 'Finish'
            }
        } else if (to === 'backward') {
            const prevIndex = SSGame.answers.findLastIndex((a, i) => i < SSGame.questIndex && !a.hasOwnProperty('result'))
            STGame.questIndex = prevIndex !== -1 ? prevIndex : SSGame.answers.findLastIndex((a, i) => i < SSGame.answers.length && !a.hasOwnProperty('result'))
        }
    }

    const getChoiceStyle = (choice) => {
        return SSGame.answers[SSGame.questIndex].hasOwnProperty('result')
            ? choice === SSGame.answers[SSGame.questIndex].selected
                ? SSGame.answers[SSGame.questIndex].result
                    ? 'var(--system-green)'
                    : 'var(--system-red)'
                : choice === SSGame.answers[SSGame.questIndex].correct
                    ? 'var(--system-green)'
                    : 'var(--ultrathin-material)'
            : 'var(--ultrathin-material)'
    }

    const choose = (choice) => {
        STGame.answers[SSGame.questIndex] = {
            correct: STGame.quiz[SSGame.questIndex].correct,
            selected: choice,
            result: choice === STGame.quiz[SSGame.questIndex].correct
        }

        if (choice === STGame.quiz[SSGame.questIndex].correct) {
            STClock.prevTimer = SSClock.timer
            STClock.timer += Math.round((SSClock.prevTimer - SSClock.timer) / 2 + 1)
        }

        let timeSpent = 0

        if (STGame.answers.findIndex(e => !e.hasOwnProperty('result')) === -1) {
            timeSpent = Date.now() - SSClock.startTime
        }

        ws.send(JSON.stringify({ command: 'SEND_ANSR', id: SSProfile.gameID, index: SSGame.questIndex, answer: choice, timeSpent }))

        setTimeout(() => navigate('forward'), 500)
    }


    useEffect(() => {
        STClock.startTime = Date.now()
        STClock.timer = 30 + STGame.quiz.length * 6
        STClock.prevTimer = 30 + STGame.quiz.length * 6
    }, [])


    useEffect(() => {
        interval = setInterval(() => {
            if (SSClock.timer > 0) {
                timerAnim.set({ opacity: 1 })
                timerAnim.start({ opacity: 0 })
                barAnim.start({ height: (400 * SSClock.timer / (30 + STGame.quiz.length * 6)), backgroundColor: `hsl(${100 * SSClock.timer / (30 + STGame.quiz.length * 6)} 100% 50%)` })
                STClock.timer = SSClock.timer - 1
            } else {
                clearInterval(interval)
                STGame.ui = 'Timeout'
                ws.send(JSON.stringify({ command: 'SEND_ANSR', id: SSProfile.gameID }))
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [SSClock.timer])


    return (
        <div className={sty.quiz}>
            <div className={sty.quizBody} style={{ flexDirection: core.isMobile ? 'column-reverse' : 'row' }}>
                <div className={sty.quizNavbar} style={{ flexDirection: core.isMobile ? 'row-reverse' : 'column', margin: core.isMobile ? '0 0 15px' : '0 0 0 20px', transform: `scale(${core.isMobile ? 0.65 : 1})` }}>
                    <button onClick={() => navigate('forward')}>
                        <Icon name={`chevron-${core.isMobile ? 'forward' : 'up'}`} size={36} color='--system-blue' />
                    </button>
                    <div className={sty.quizNavList} style={{ flexDirection: core.isMobile ? 'row' : 'column-reverse' }}>
                        {SSGame.answers.map((answer, index) => {
                            return (
                                <div className={sty.quizNav} key={index} style={getNavStyle(answer, index)} onClick={() => STGame.questIndex = index}></div>
                            )
                        })}
                    </div>
                    <button onClick={() => navigate('backward')}>
                        <Icon name={`chevron-${core.isMobile ? 'back' : 'down'}`} size={36} color='--system-blue' />
                    </button>
                </div>

                <div className={sty.quizQuest} style={{ width: core.isMobile ? '100%' : '50%', marginLeft: core.isMobile ? 0 : '50%', transform: core.isMobile ? 'none' : 'translateX(-50%)' }}>
                    <div className={sty.quest} style={{ padding: core.isMobile ? 20 : 0 }}>
                        <h2 className={sty.questLbl} style={{ fontSize: core.isMobile ? 28 : 36 }}>{SSGame.quiz[SSGame.questIndex].quest}</h2>
                        {SSGame.quiz[SSGame.questIndex].hasContent && <h1 className={sty.questContent} style={{ fontSize: core.isMobile ? 36 : 40 }}>{SSGame.quiz[SSGame.questIndex].content}</h1>}
                    </div>
                    <div className={sty.choices} style={{ width: core.isMobile ? '100%' : '70%', padding: core.isMobile ? 20 : 0, gap: core.isMobile ? 20 : 30 }}>
                        {SSGame.quiz[SSGame.questIndex].choices.map((choice, index) => {
                            return (
                                <div className={sty.choice} key={index}
                                    style={{ width: core.isMobile ? '100%' : 250, height: core.isMobile ? 50 : 60, backgroundColor: getChoiceStyle(choice), flexBasis: core.isMobile ? 'auto' : 'calc(50% - 15px)' }}
                                    onClick={() => choose(choice)}
                                >
                                    <h3 className={sty.choiceLbl} style={{ fontSize: core.isMobile ? 26 : 30 }}>{choice}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className={sty.quizTimer} style={{ transform: core.isMobile ? 'rotate(90deg) scale(0.85)' : 'rotate(0) scale(1)', flexDirection: core.isMobile ? 'row-reverse' : 'column', height: core.isMobile ? 138 : 'unset' }}>
                    <h1 className={sty.timerLbl} style={{ color: SSClock.timer > 10 ? 'var(--white)' : 'var(--system-red)', transform: core.isMobile ? 'rotate(-90deg)' : 'rotate(0)' }}>{SSClock.timer}</h1>
                    <div className={sty.timerBar}>
                        <motion.div className={sty.timerBarInd}
                            initial={{ height: '100%' }}
                            animate={barAnim}
                            exit={{ height: '0%' }}
                            transition={{ ease: 'linear', duration: 1 }}
                        >
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const Timeout = () => {
    useEffect(() => { setTimeout(() => STGame.ui = 'Board', 2000) }, [])


    return (
        <div className={sty.timeout}>
            <h1 className={sty.timeoutLbl}>Timeout</h1>
        </div>
    )
}


const Finish = () => {
    useEffect(() => { setTimeout(() => { if (STGame.ui !== 'Winner') STGame.ui = 'Board' }, 2000) }, [])


    return (
        <div className={sty.finish}>
            <h1 className={sty.finishLbl}>Finish</h1>
        </div>
    )
}


const Winner = () => {
    useEffect(() => {
        setTimeout(() => { STScene.name = 'Game'; STGame.ui = 'Board' }, 10000)
    }, [])

    return <div className={sty.winner}></div>
}


const Board = ({ core }) => {
    const SSGame = useSnapshot(STGame)
    const SSIndicator = useSnapshot(STIndicator)
    const SSProfile = useSnapshot(STProfile)


    const leaveGame = () => {
        STProfile.gameID = ''
        Object.assign(STIndicator, { id: '', topic: { name: 'Anatomy', icon: 'body' }, duration: 5, token: 20, players: { all: 2, joined: 0, list: [] } })
        STScene.name = 'Lobby'
        STUI.value.name = 'Home'
        STUI.value.showControls = true
    }


    useEffect(() => {
        const stats = []

        console.log(SSIndicator)

        SSIndicator.players.list.forEach((player) => {
            stats.push({
                id: player.id,
                name: player.name,
                color: player.color,
                os: player.os,
                timeSpent: player.timeSpent,
                correct: SSIndicator.answers[player.id].filter(a => a.isTrue).length,
                wrong: SSIndicator.answers[player.id].filter(a => a.isTrue === false).length,
                empty: SSIndicator.answers[player.id].filter(a => a.isTrue === null).length,
                progress: player.isFinished ? 'Finished' : 'In Game'
            })
        })

        STGame.stats = stats.sort((a, b) => a.timeSpent - b.timeSpent).sort((a, b) => a.wrong - b.wrong).sort((a, b) => b.correct - a.correct)
    }, [SSIndicator.answers, SSIndicator.players])


    return (
        <div className={sty.board}>
            <div className={sty.table} style={{ transform: `scale(${core.isMobile ? 0.54 : 1})` }}>
                <div className={sty.tableHead}>
                    <div className={sty.tableHeadLbl}>
                        <Icon name='podium-o' size={30} color='--system-blue' />
                    </div>
                    <div className={sty.tableHeadLbl} style={{ width: 250 }} >
                    </div>
                    <div className={sty.tableHeadLbl}>
                        <Icon name='checkmark-circle-o' size={30} color='--system-green' />
                    </div>
                    <div className={sty.tableHeadLbl}>
                        <Icon name='close-circle-o' size={30} color='--system-red' />
                    </div>
                    <div className={sty.tableHeadLbl}>
                        <Icon name='ellipse-o' size={30} color='--white' />
                    </div>
                    <div className={sty.tableHeadLbl} style={{ width: 140 }} >
                        <Icon name='timer-o' size={30} color='--white' />
                    </div>
                    <div className={sty.tableHeadLbl}>
                        <Icon name='game-controller-o' size={30} color='--system-yellow' />
                    </div>
                </div>

                <div className={sty.tableBody}>
                    {SSGame.stats.map((player, index) => {
                        return (
                            <div className={sty.tableBodyRow} key={index} style={{ backgroundColor: player.id === SSProfile.id ? 'var(--primary-fill)' : 'transparent' }}>
                                <h4 className={sty.tableBodyLbl}>{index + 1}</h4>
                                <div style={{ alignItems: 'center', width: 250 }}>
                                    <Icon name='person-circle-o' size={30} color={player.color} />
                                    <h4 className={sty.tableBodyLbl} style={{ width: '100%', paddingLeft: 5, textAlign: 'left' }}>{player.name}</h4>
                                </div>
                                <h4 className={sty.tableBodyLbl}>{player.correct}</h4>
                                <h4 className={sty.tableBodyLbl}>{player.wrong}</h4>
                                <h4 className={sty.tableBodyLbl}>{player.empty}</h4>
                                <h4 className={sty.tableBodyLbl} style={{ width: 140 }}>{player.progress}</h4>
                                <div style={{ alignItems: 'center', padding: 10 }}>
                                    {player.os === 'iOS' && <Icon name='logo-apple' size={30} color='--white' />}
                                    {player.os === 'Android' && <Icon name='logo-android' size={30} color='--system-green' />}
                                    {player.os === 'PC' && <Icon name='desktop' size={30} color='--system-gray1' />}
                                    {player.os === 'AI' && <Icon name='dice' size={32} color='--white' />}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <button className={sty.leaveBtn} onClick={() => leaveGame()}>
                    <h2 className={sty.leaveBtnLbl}>Leave</h2>
                </button>
            </div>
        </div>
    )
}


export const Game = ({ ws, core }) => {
    const SSGame = useSnapshot(STGame)


    useEffect(() => {
        return () => {
            Object.assign(STGame, { quiz: [], answers: [], questIndex: 0, ui: 'Countdown', stats: [] })
            Object.assign(STClock, { countdown: 3, timer: 0 })
        }
    }, [])


    return (
        <div className={['Winner', 'Board'].includes(SSGame.ui) ? sty.game : sty.gameBlur}>
            <Router>
                <Countdown name='Countdown' />
                <Quiz name='Quiz' ws={ws} core={core} />
                <Timeout name='Timeout' />
                <Finish name='Finish' />
                <Winner name='Winner' />
                <Board name='Board' core={core} />
            </Router>
        </div>
    )
}