import { useSnapshot } from 'valtio'
import { genColor } from '../utilities/core.utils'
import { STIndicator } from '../stores/app.store'
import { Player } from './player.scn'


export const Game = () => {
    const SSIndicator = useSnapshot(STIndicator)

    const radius = SSIndicator.players.all * 0.8
    const angle = 360 / SSIndicator.players.all


    const toRadian = (index) => {
        return angle * (Math.PI / 180) * index
    }

    const pos = (index) => {
        return [
            /* Pos X */ +(Math.cos(Math.PI / 2 + toRadian(index)) * radius).toFixed(3),
            /* Pos Y */ 0,
            /* Pos Z */ +(Math.sin(Math.PI / 2 + toRadian(index)) * radius).toFixed(3)
        ]
    }


    return (
        Array(SSIndicator.players.all).fill().map((player, index) => {
            return <Player key={index}
                position={pos(index)}
                rotation={[0, Math.PI - toRadian(index), 0]}
                player={SSIndicator.players.joined > index ? SSIndicator.players.list[index] : { name: 'Waiting...', color: genColor() }}
            />
        })
    )
}