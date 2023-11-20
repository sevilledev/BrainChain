exports.genRandom = (length = 8, base = 36) => {
    return (Math.round(Math.random() * ((base ** (length - 1) * (base - 1)) - 1)) + (base ** (length - 1))).toString(base)
}


exports.genColor = () => {
    const hexToHsl = (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        var r = parseInt(result[1], 16)
        var g = parseInt(result[2], 16)
        var b = parseInt(result[3], 16)
        r /= 255, g /= 255, b /= 255
        var max = Math.max(r, g, b), min = Math.min(r, g, b)
        var h, s, l = (max + min) / 2
        if (max == min) {
            h = s = 0 // achromatic
        } else {
            var d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6
        }

        h = Math.round(h * 360)
        s = Math.round(s * 100)
        l = Math.round(l * 100)

        return { h, s, l }
    }

    const hslToHex = (h, s, l) => {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    const color = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padEnd(6, 'f')}`
    return hslToHex(hexToHsl(color).h, hexToHsl(color).s < 30 ? 100 - hexToHsl(color).s : hexToHsl(color).s, hexToHsl(color).l < 50 ? 100 - hexToHsl(color).l : hexToHsl(color).l)
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
        const list = names.sort(() => (Math.random() > .5) ? 1 : -1).slice(0, joined).map((name) => { return { name, color: this.genColor() } })
        return { all, joined, list }
    }

    for (let i = 0; i < count; i++) {
        games.push({
            id: this.genRandom(8, 10),
            topic: topics[Math.floor(Math.random() * topics.length)],
            duration: durations[Math.floor(Math.random() * durations.length)],
            token: tokens[Math.floor(Math.random() * tokens.length)],
            players: genPlayers()
        })
    }

    return games
}