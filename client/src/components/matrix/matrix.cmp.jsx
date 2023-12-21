import { motion } from 'framer-motion'

import sty from './matrix.module.css'


export const Matrix = ({ size, gap }) => {
    return (
        <motion.div className={sty.matrixWrap}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 1.5 }}
        >
            <div style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)`, gap }} className={sty.matrix}>
                {Array(size ** 2).fill().map((cube, index) => {
                    return (
                        <div className={sty.matrixItem} key={index} style={{
                            animationDuration: `${(Math.random().toFixed(2) * 4 + 2)}s`,
                            animationDelay: `${(Math.random().toFixed(2) * 2)}s`,
                            transitionDelay: `${Math.random().toFixed(2)}s`
                        }}></div>
                    )
                })}
            </div>
        </motion.div>
    )
}