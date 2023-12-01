import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { proxy, useSnapshot } from 'valtio'
import { Icon } from '../components/core.cmp'

import { STGame, STUI } from '../stores/app.store'

import sty from '../styles/modules/game.module.css'


const STState = proxy({ countdown: 3, timer: 0 })

let interval = null


export const Game = ({ ws }) => {
    const SSState = useSnapshot(STState)
    const SSGame = useSnapshot(STGame)
    const SSUI = useSnapshot(STUI)

    const countdownAnim = useAnimation()
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
                console.log('You finished!')
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
            STState.timer = (SSState.timer + 45) > (30 + STGame.quiz.length * 12) ? 30 + STGame.quiz.length * 12 + 1 : SSState.timer + 45 + 1
        }
        setTimeout(() => navigate('forward'), 500)
    }


    useEffect(() => { STState.timer = 30 + STGame.quiz.length * 12 }, [SSUI.value.name])

    useEffect(() => {
        interval = setInterval(() => {
            if (SSState.countdown > 0) {
                countdownAnim.set({ opacity: 1 })
                countdownAnim.start({ opacity: 0 })
                STState.countdown = SSState.countdown - 1
            } else if (SSState.timer > 0) {
                timerAnim.set({ opacity: 1 })
                timerAnim.start({ opacity: 0 })
                barAnim.start({ height: (400 * SSState.timer / (30 + STGame.quiz.length * 12)), backgroundColor: `hsl(${100 * SSState.timer / (30 + STGame.quiz.length * 12)} 100% 50%)` })
                STState.timer = SSState.timer - 1
            } else {
                clearInterval(interval)
                console.log('You lost!')
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [SSUI.value.name, SSState.countdown, SSState.timer])


    return (
        <div className={sty.game}>
            {SSState.countdown
                ? <motion.h1 className={sty.countdown}
                    initial={{ opacity: 1 }}
                    animate={countdownAnim}
                    exit={{ opacity: 1 }}
                    transition={{ ease: 'easeIn', duration: 0.8, delay: 0.2 }}
                >{SSState.countdown}</motion.h1>
                : <div className={sty.quiz}>
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
                            <h1 className={sty.timerLbl} style={{ color: SSState.timer > 10 ? 'var(--white)' : 'var(--system-red)' }}>{SSState.timer}</h1>
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
            }
        </div>
    )
}