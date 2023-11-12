exports.genRandom = (bytes = 4) => {
    return require('crypto').randomBytes(bytes).toString('hex')
}


exports.genGame = (count = 20) => {
    let games = []
    const durations = [5, 10, 15, 20]
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
            name: 'Language',
            icon: 'language'
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
        const usernames = names.sort(() => (Math.random() > .5) ? 1 : -1).slice(0, joined)
        return { all, joined, usernames }
    }

    for (let i = 0; i < count; i++) {
        games.push({
            id: (Math.random() * 1000000).toString(36).replace('.', '').padEnd(11, 'x'),
            topic: topics[Math.floor(Math.random() * topics.length)],
            duration: durations[Math.floor(Math.random() * durations.length)],
            token: tokens[Math.floor(Math.random() * tokens.length)],
            players: genPlayers()
        })
    }

    return games
}