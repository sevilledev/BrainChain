import { Stats } from '@react-three/drei'
import { Controls } from 'react-three-gui'


export const Canvas = ({ children }) => {
    return (
        <Controls.Provider>
            <Controls.Canvas shadows>{children}</Controls.Canvas>
            {false && <Controls title='Settings' />}
            {false && <Stats />}
        </Controls.Provider>
    )
}