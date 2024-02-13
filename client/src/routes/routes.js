import { jwtDecode } from 'jwt-decode'
import { refreshToken, signIn, signUp, signOut } from './auth.routes'


// const API_URL = 'https://brch.azurewebsites.net'
const API_URL = import.meta.env.VITE_API_URL



const fetchExt = async (url, config) => {
    const { timeout = 20000 } = config
    
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, { ...config, signal: controller.signal })
    clearTimeout(id)
    
    return response
}



export const sendAuth = (url, config) => new Promise((resolve, reject) => {
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'application/json'
    
    fetchExt(API_URL + url, config)
    .then(res => {
        try { return res.json() }
        catch { throw new Error(`Something went wrong!\nHttp: ${res.status}\nRequested URL: ${url}`) }
    })
    .then(data => resolve(data))
    .catch(err => reject(err))
})



export const send = async (url, config) => new Promise(async (resolve, reject) => {
    var payload = jwtDecode(localStorage.getItem('ACS_TKN'))
    config.headers = config.headers || {}
    
    if ((Date.now()) < (payload.exp * 1000) + 8000) {
        config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('ACS_TKN')
        sendAuth(url, config)
        .then((data) => resolve(data))
        .catch((err) => reject(err))
    } else {
        console.log('token refreshing')
        refreshToken().then(async () => {
            config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('ACS_TKN')
            sendAuth(url, config)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    }
})



export const RTAuth = { refreshToken, signIn, signUp, signOut }