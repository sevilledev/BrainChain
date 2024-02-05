import { signIn, signUp } from './auth.routes'


export const RTAuth = { signIn, signUp }

export const API_URL = 'https://brch.azurewebsites.net'

export const send = async (url, config) => new Promise(async (resolve, reject) => {
    config.headers = config.headers || {}
    fetch(API_URL + url, config)
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err))
})