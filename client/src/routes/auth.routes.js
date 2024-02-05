import { send } from './routes'


export const signIn = (email, password) => new Promise(async (resolve, reject) => {
    const body = JSON.stringify({ email, password })
    const headers = { 'Content-Type': 'application/json' }

    send('/auth/signin', { method: 'POST', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})


export const signUp = (username, email, password) => new Promise(async (resolve, reject) => {
    const body = JSON.stringify({ username, email, password })
    const headers = { 'Content-Type': 'application/json' }

    send('/auth/signup', { method: 'POST', headers, body })
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})