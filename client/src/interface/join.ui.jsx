import { useSnapshot } from 'valtio'
import { Icon } from '../components/core.cmp'
import { STApp } from '../stores/app.store'

import sty from '../styles/modules/app.module.css'


export const Join = ({ ws }) => {
    const appSnap = useSnapshot(STApp)


    const joinGame = (game) => {
        ws.send(JSON.stringify({ command: 'JOIN_LOBBY', action: game.id === appSnap.lobby.props.id ? 'leave' : 'join', id: game.id, username: appSnap.profile.username }))
    }


    return (
        <div className={sty.join}>
            <div className={sty.games}>
                {appSnap.filteredGames.map((game) => {
                    return (
                        <div className={sty.game} key={game.id}
                            style={{ backgroundColor: appSnap.lobby.props.id === game.id ? 'var(--system-gray2)' : 'var(--thin-material)' }}
                            onClick={() => joinGame(game)}
                        >
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
                    )
                })}
            </div>
        </div>
    )
}