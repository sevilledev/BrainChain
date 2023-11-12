export const getColor = (color) => {
    const colors = {
        '--primary-label': '#FFFFFF',
        '--secondary-label': '#EBEBF599',
        '--tertiary-label': '#EBEBF54D',
        '--quarternary-label': '#EBEBF52E',
        '--placeholder-text': '#EBEBF54C',

        '--primary-tint': '#0A84FF',

        '--primary-fill': '#7878805C',
        '--secondary-fill': '#78788052',
        '--tertiary-fill': '#7676803E',
        '--quarternary-fill': '#7474802E',

        '--thick-material': '#202020EC',
        '--regular-material': '#252525C8',
        '--thin-material': '#2525259A',
        '--ultrathin-material': '#46464680',

        '--material-seperator': '#FFFFFF4D',

        '--opaque-separator': '#38383A',
        '--nonopaque-separator': '#545458A6',

        '--primary-sb': '#000000',
        '--secondary-sb': '#1C1C1E',
        '--tertiary-sb': '#2C2C2E',
        '--quarternary-sb': '#3A3A3C',

        '--primary-gb': '#000000',
        '--secondary-gb': '#1C1C1E',
        '--tertiary-gb': '#2C2C2E',
        '--quarternary-gb': '#3A3A3C',

        '--system-gray1': '#8E8E93',
        '--system-gray2': '#636366',
        '--system-gray3': '#48484A',
        '--system-gray4': '#3A3A3C',
        '--system-gray5': '#2C2C2E',
        '--system-gray6': '#1C1C1E',

        '--link': '#0984FFFF',

        '--dark-text': '#000000FF',
        '--light-text': '#FFFFFF99',

        '--black': '#000000',
        '--white': '#FFFFFF',

        '--system-blue': '#0A84FF',
        '--system-green': '#30D158',
        '--system-indigo': '#5E5CE6',
        '--system-orange': '#FF9F0A',
        '--system-pink': '#FF375F',
        '--system-purple': '#BF5AF2',
        '--system-red': '#FF453A',
        '--system-teal': '#64D2FF',
        '--system-yellow': '#FFD60A',

        '--d1': '#64D2FF',
        '--d2': '#BF5AF2',
        '--d3': '#FFD60A',
    }

    return colors.hasOwnProperty(color) ? colors[color] : `${color}`
}


export const genColor = () => {
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


export const genGame = (count = 20) => {
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