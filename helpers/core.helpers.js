exports.genRandom = (length = 8, base = 36) => {
    return (Math.round(Math.random() * ((base ** (length - 1) * (base - 1)) - 1)) + (base ** (length - 1))).toString(base)
}


exports.genColor = () => {
    const h = { min: 0, max: 360 }
    const s = { min: 50, max: 100 }
    const l = { min: 30, max: 70 }

    const hslToHex = (h, s, l) => {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    const random = (x) => {
        return +(Math.random() * (x.max - x.min) + x.min).toFixed()
    }

    const r = { h: random(h), s: random(s), l: random(l) }

    return hslToHex(r.h, r.s, r.l)
}


exports.genGame = (count = 20) => {
    const games = {}
    const durations = [5, 10, 15]
    const tokens = [20, 50, 100, 150, 200]
    const names = ['Salvador Johnston', 'Wallace Long', 'Howard Beck', 'Alfredo Curtis', 'Stephen Williamson', 'Logan Carter', 'Travis Stevens', 'Derrick Kuhn', 'Kylie Grant', 'Jonathan Gordon']
    const topics = [
        {
            name: 'Anatomy',
            icon: 'body'
        },
        {
            name: 'Astronomy',
            icon: 'planet'
        },
        {
            name: 'Economics',
            icon: 'bar-chart'
        },
        {
            name: 'Geography',
            icon: 'compass'
        },
        {
            name: 'Mathematics',
            icon: 'calculator'
        },
        {
            name: 'Mixed',
            icon: 'earth'
        },
        {
            name: 'Music',
            icon: 'musical-notes'
        },
        {
            name: 'Sports',
            icon: 'basketball'
        }
    ]

    const genPlayers = () => {
        const all = 2 * Math.floor(1 + Math.random() * 4)
        const joined = Math.floor(1 + Math.random() * (all - 1))
        const list = names.sort(() => (Math.random() > .5) ? 1 : -1).slice(0, joined).map((name) => { return { id: this.genRandom(), name, color: this.genColor(), isFinished: false } })
        return { all, joined, list }
    }

    for (let i = 0; i < count; i++) {
        const id = this.genRandom(8, 10)

        games[id] = {
            id,
            topic: topics[Math.floor(Math.random() * topics.length)],
            duration: durations[Math.floor(Math.random() * durations.length)],
            token: tokens[Math.floor(Math.random() * tokens.length)],
            players: genPlayers(),
            answers: {}
        }
    }

    return games
}