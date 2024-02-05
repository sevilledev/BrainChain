import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { Icon, Segment } from '../components/core.cmp'
import { RTAuth } from '../routes/routes'
import { STProfile, STSettings } from '../stores/app.store'

import sty from '../styles/modules/profile.module.css'


export const Profile = () => {
    const SSProfile = useSnapshot(STProfile)
    const SSSettings = useSnapshot(STSettings)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const menuRef = useRef()

    const segments = ['Sign in', 'Sign up']


    const onChange = (value, set) => {
        set(value)
    }

    const openMenu = () => {
        STSettings.ui = STSettings.ui !== '' ? '' : STProfile.isGuest ? 'Sign in' : 'Sign up'
    }

    const onSegment = (segment) => {
        STSettings.ui = segment
    }

    const signIn = () => {
        RTAuth.signIn(email, password).then((data) => console.log(data))
    }

    const signUp = () => {
        RTAuth.signUp(username, email, password).then((data) => console.log(data))
    }



    useEffect(() => {
        const handler = (e) => {
            if (!STSettings.ui) return
            if (!menuRef.current.contains(e.target)) STSettings.ui = ''
        }
        document.addEventListener('click', handler, true)
        return () => document.removeEventListener('click', handler)
    }, [STSettings.ui])


    return (
        <div className={sty.profile} ref={menuRef}>
            <div className={sty.profileBtn} onClick={() => openMenu()}>
                <Icon name='person-circle-o' size={30} color='--white' />
                {SSProfile.isGuest && <h5 className={sty.profileLbl}>Guest</h5>}
            </div>

            {SSSettings.ui !== '' && <>
                <div className={sty.menuBg}>
                    <div className={sty.notch}></div>
                    <Segment segments={segments} state={SSSettings.ui} onChange={(index, segment) => onSegment(segment)} />
                    {SSSettings.ui === 'Sign in' && <div className={sty.menu}>
                        <input className={sty.menuInput} style={{ marginTop: 15 }} name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                        <input className={sty.menuInput} style={{ marginTop: 5 }} name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                        <button className={sty.menuBtn} onClick={() => signIn()}>Sign in</button>
                    </div>}
                    {SSSettings.ui === 'Sign up' && <div className={sty.menu}>
                        <input className={sty.menuInput} style={{ marginTop: 15 }} name='username' placeholder='Username' type='text' value={username} onChange={(e) => onChange(e.target.value, setUsername)} />
                        <input className={sty.menuInput} style={{ marginTop: 5 }} name='email' placeholder='Email' type='text' value={email} onChange={(e) => onChange(e.target.value, setEmail)} />
                        <input className={sty.menuInput} style={{ marginTop: 5 }} name='password' placeholder='Password' type='password' value={password} onChange={(e) => onChange(e.target.value, setPassword)} />
                        <button className={sty.menuBtn} onClick={() => signUp()}>Sign Up</button>
                    </div>}
                </div>
            </>}
        </div>
    )
}