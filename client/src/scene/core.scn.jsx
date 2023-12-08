import { Canvas } from './canvas.scn'
import { CamCon } from './camcon.scn'
import { Lights } from './lights.scn'
import { Env } from './env.scn'
import { Floor } from './floor.scn'
import { Swap } from './swap.scn'

import { Lobby } from './lobby.scn'
import { Game } from './game.scn'
import { Winner } from './winner.scn'



export const Scene = ({ core }) => {
    return (
        <Canvas>
            <CamCon core={core} />
            <Lights />
            <Env />
            <Floor />
            <Swap>
                <Lobby name='Lobby' />
                <Game name='Game' />
                <Winner name='Winner' />
            </Swap>
        </Canvas>
    )
}