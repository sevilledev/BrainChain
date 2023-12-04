import { useSnapshot } from 'valtio'
import { Icon, Matrix } from '../components/core.cmp'
import { STGames, STProfile } from '../stores/app.store'

import sty from '../styles/modules/join.module.css'


export const Join = ({ ws }) => {
    const SSProfile = useSnapshot(STProfile)
    const SSGames = useSnapshot(STGames)


    const actGame = (game) => {
        ws.send(JSON.stringify({ command: game.id === SSProfile.gameID ? 'LEAVE_GAME' : 'JOIN_GAME', id: game.id, name: SSProfile.name, color: SSProfile.color }))
    }


    return (
        <div className={sty.join}>
            <div className={sty.games}>
                {SSGames.filtered.map((game) => {
                    return (
                        <div className={sty.gameWrapper} key={game.id}>
                            {SSProfile.gameID === game.id && <Matrix count={100} width={18} height={18} gap={2} />}
                            <div className={sty.gameCard} onClick={() => actGame(game)}>
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