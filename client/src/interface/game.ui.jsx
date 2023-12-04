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
                countdownAnim.set({ opacity: 1 })
                countdownAnim.start({ opacity: 0 })
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


const Quiz = ({ ws }) => {
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
            STClock.timer = (SSClock.timer + 45) > (30 + STGame.quiz.length * 12) ? 30 + STGame.quiz.length * 12 + 1 : SSClock.timer + 45 + 1
        }

        ws.send(JSON.stringify({ command: 'SEND_ANSR', id: SSProfile.gameID, index: SSGame.questIndex, answer: choice }))

        setTimeout(() => navigate('forward'), 500)
    }


    useEffect(() => {
        STClock.timer = 30 + STGame.quiz.length * 12
    }, [])

    useEffect(() => {
        interval = setInterval(() => {
            if (SSClock.timer > 0) {
                timerAnim.set({ opacity: 1 })
                timerAnim.start({ opacity: 0 })
                barAnim.start({ height: (400 * SSClock.timer / (30 + STGame.quiz.length * 12)), backgroundColor: `hsl(${100 * SSClock.timer / (30 + STGame.quiz.length * 12)} 100% 50%)` })
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
            <div className={sty.quizBody}>
                <div className={sty.quizNavbar}>
                    <button onClick={() => navigate('forward')}>
                        <Icon name='chevron-up' size={36} color='--system-blue' />
                    </button>
                    <div className={sty.quizNavList}>
                        {SSGame.answers.map((answer, index) => {
                            return (
                                <div className={sty.quizNav} key={index} style={getNavStyle(answer, index)} onClick={() => STGame.questIndex = index}></div>
                            )
                        })}
                    </div>
                    <button onClick={() => navigate('backward')}>
                        <Icon name='chevron-down' size={36} color='--system-blue' />
                    </button>
                </div>
                <div className={sty.quizQuest}>
                    <div className={sty.quest}>
                        <h2 className={sty.questLbl}>{SSGame.quiz[SSGame.questIndex].quest}</h2>
                        {SSGame.quiz[SSGame.questIndex].hasContent && <h1 className={sty.questContent}>{SSGame.quiz[SSGame.questIndex].content}</h1>}
                    </div>
                    <div className={sty.choices}>
                        {SSGame.quiz[SSGame.questIndex].choices.map((choice, index) => {
                            return (
                                <div className={sty.choice} key={index}
                                    style={{ backgroundColor: getChoiceStyle(choice) }}
                                    onClick={() => choose(choice)}
                                >
                                    <h3 className={sty.choiceLbl}>{choice}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={sty.quizTimer}>
                    <h1 className={sty.timerLbl} style={{ color: SSClock.timer > 10 ? 'var(--white)' : 'var(--system-red)' }}>{SSClock.timer}</h1>
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


const Lost = () => {
    useEffect(() => { setTimeout(() => STGame.ui = 'Board', 2000) }, [])


    return (
        <div className={sty.lost}>
            <h1 className={sty.lostLbl}>You Lost</h1>
        </div>
    )
}


const Win = () => {
    useEffect(() => { setTimeout(() => STGame.ui = 'Board', 2000) }, [])


    return (
        <div className={sty.win}>
            <h1 className={sty.winLbl}>You Win</h1>
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
    useEffect(() => { setTimeout(() => STGame.ui = 'Board', 2000) }, [])


    return (
        <div className={sty.finish}>
            <h1 className={sty.finishLbl}>Finish</h1>
        </div>
    )
}


const Board = () => {
    const SSGame = useSnapshot(STGame)
    const SSIndicator = useSnapshot(STIndicator)


    const leaveGame = () => {
        STProfile.gameID = ''
        Object.assign(STIndicator, { id: '', topic: { name: 'Anatomy', icon: 'body' }, duration: 5, token: 20, players: { all: 2, joined: 0, list: [] } })
        STScene.name = 'Lobby'
        STUI.value.name = 'Home'
        STUI.value.showControls = true
    }


    useEffect(() => {
        const stats = []

        SSIndicator.players.list.forEach((player) => {
            stats.push({
                name: player.name,
                correct: SSIndicator.answers[player.id].filter(a => a.isTrue).length,
                wrong: SSIndicator.answers[player.id].filter(a => a.isTrue === false).length,
                empty: SSIndicator.answers[player.id].filter(a => a.isTrue === null).length,
                progress: player.isFinished ? 'Finished' : 'In Game'
            })
        })

        STGame.stats = stats.sort((a, b) => a.wrong - b.wrong).sort((a, b) => b.correct - a.correct)
    }, [SSIndicator.answers, SSIndicator.players])


    return (
        <div className={sty.board}>
            <button className={sty.leaveBtn} onClick={() => leaveGame()}>
                <Icon name='exit-o' size={24} color='--system-red' />
            </button>
            <h1 className={sty.boardLbl}>Leaderboard</h1>
            <div className={sty.boardHeader}>
                <h3 className={sty.orderLbl}>Ranking</h3>
                <h3 className={sty.nameLbl}>Name</h3>
                <h3 className={sty.correctLbl}>Correct</h3>
                <h3 className={sty.wrongLbl}>Wrong</h3>
                <h3 className={sty.emptyLbl}>Empty</h3>
                <h3 className={sty.progressLbl}>Progress</h3>
            </div>
            <div className={sty.boardList}>
                {SSGame.stats.map((player, index) => {
                    return (
                        <div className={sty.boardItem} key={index}>
                            <h3 className={sty.order}>{index + 1}</h3>
                            <h3 className={sty.name}>{player.name}</h3>
                            <h3 className={sty.correct}>{player.correct}</h3>
                            <h3 className={sty.wrong}>{player.wrong}</h3>
                            <h3 className={sty.empty}>{player.empty}</h3>
                            <h3 className={sty.progress}>{player.progress}</h3>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export const Game = ({ ws }) => {
    useEffect(() => {
        return () => {
            Object.assign(STGame, { quiz: [], answers: [], questIndex: 0, ui: 'Countdown', stats: [] })
            Object.assign(STClock, { countdown: 3, timer: 0 })
        }
    }, [])


    return (
        <div className={sty.game}>
            <Router>
                <Countdown name='Countdown' />
                <Quiz name='Quiz' ws={ws} />
                <Lost name='Lost' />
                <Win name='Win' />
                <Timeout name='Timeout' />
                <Finish name='Finish' />
                <Board name='Board' />
            </Router>
        </div>
    )
}