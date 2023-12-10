const { WebSocketServer, WebSocket } = require('ws')
const { genRandom, genGame, genColor } = require('./helpers/core.helpers')
const { createServer } = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })
const PORT = process.env.PORT || 50000



// Storage

const lobby = {}
const rooms = {}
const liveGames = {}
const games = genGame(40)



// Middlewares

app.use(cors())
app.use(express.json())



// Functions

const getArray = (from) => {
    return Object.values(from)
}

const sendLobby = (obj) => {
    for (const userID in lobby) {
        if (lobby[userID].readyState === WebSocket.OPEN) lobby[userID].send(JSON.stringify(obj))
    }
}

const sendRoom = (id, obj) => {
    for (const userID in rooms[id]) {
        if (rooms[id][userID].readyState === WebSocket.OPEN) rooms[id][userID].send(JSON.stringify(obj))
    }
}

const getQuiz = (topic, count) => {
    // const quiz = [
    //     {
    //         hasContent: false,
    //         quest: 'Desert is to oasis as ocean is to:',
    //         choices: ['Water', 'Sand', 'Sea', 'Island'],
    //         correct: 'Island'
    //     },
    //     {
    //         hasContent: true,
    //         quest: 'Which number follows?',
    //         content: '1, 4, 9, 16, 25',
    //         contentType: 'text',
    //         choices: ['27', '34', '36', '45'],
    //         correct: '36'
    //     },
    //     {
    //         hasContent: true,
    //         quest: 'Choose the conclusion that validly follows from the argument:',
    //         content: 'All kittens are playful. Some pets are kittens. Therefore:',
    //         contentType: 'text',
    //         choices: ['All kittens are pets', 'Some kittens are pets', 'All pets are playful', 'Some pets are playful'],
    //         correct: 'Some pets are playful'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'You are building an open-ended (straight) fence by stringing wire between posts 25 meters apart. If the fence is 100 meters long how many posts should you use?',
    //         choices: ['2', '3', '4', '5'],
    //         correct: '5'
    //     },
    //     {
    //         hasContent: true,
    //         quest: 'Rearrange the letters and select the correct category.',
    //         content: 'R A S P I',
    //         contentType: 'text',
    //         choices: ['City', 'Fruit', 'Animal', 'Vegetable'],
    //         correct: 'City'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'Real Madrid is first in the league, and Real Betis is fifth while Osasuna is right between them. If Barcelona has more points than Celta Vigo and Celta Vigo is exactly below Osasuna, who is second?',
    //         choices: ['Barcelona', 'Osasuna', 'Real Betis', 'Celta Vigo'],
    //         correct: 'Barcelona'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'If the day before yesterday is two days after Monday, then what day is it today?',
    //         choices: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    //         correct: 'Friday'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'Zeta Leonis is both the fifth smallest and fifth largest star in a constellation. How many stars are there?',
    //         choices: ['8', '9', '10', '11'],
    //         correct: '9'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'Aztecs is to Mexico as Incas is to:',
    //         choices: ['Chile', 'Peru', 'Brazil', 'Cuba'],
    //         correct: 'Peru'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'Tiger is to stripes as leopard is to:',
    //         choices: ['Spots', 'Streaks', 'Paws', 'Tail'],
    //         correct: 'Spots'
    //     },
    //     {
    //         hasContent: true,
    //         quest: 'Which number follows?',
    //         content: '3, 9, 6, 12, 9, 15, 12, 18',
    //         contentType: 'text',
    //         choices: ['11', '14', '15', '21'],
    //         correct: '15'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'If two typists can type four pages in two minutes, how many typists will it take to type forty pages in ten minutes?',
    //         choices: ['2', '4', '6', '8'],
    //         correct: '4'
    //     },
    //     {
    //         hasContent: true,
    //         quest: 'Rearrange the letters and select the correct category.',
    //         content: 'F A R E F I G',
    //         contentType: 'text',
    //         choices: ['City', 'Fruit', 'Animal', 'Vegetable'],
    //         correct: 'Animal'
    //     },
    //     {
    //         hasContent: true,
    //         quest: 'Which letter follows?',
    //         content: 'T, Q, N, K, H',
    //         contentType: 'text',
    //         choices: ['F', 'E', 'D', 'G'],
    //         correct: 'E'
    //     },
    //     {
    //         hasContent: false,
    //         quest: 'Part is to trap as net is to:',
    //         choices: ['Ten', 'Whole', 'Web', 'Cover'],
    //         correct: 'Ten'
    //     },
    // ]

    const quiz = {
        astronomy: [
            {
                hasContent: false,
                quest: 'The solar wind primarily consists of:',
                choices: ['Hydrogen', 'Oxygen', 'Electrons and protons', 'Helium'],
                correct: 'Electrons and protons'
            },
            {
                hasContent: false,
                quest: 'An exoplanet is defined as:',
                choices: ['A planet within the solar system', 'A moon of a planet', 'A planet orbiting a star other than the Sun', 'A distant star'],
                correct: 'A planet orbiting a star other than the Sun'
            },
            {
                hasContent: false,
                quest: 'Which planet in our solar system is known for its prominent ring system?',
                choices: ['Mars', 'Jupiter', 'Saturn', 'Venus'],
                correct: 'Saturn'
            },
            {
                hasContent: false,
                quest: 'What theory describes the early development of the Universe?',
                choices: ['Steady State Theory', 'Pulsating Universe Theory', 'Big Bang Theory', 'Plasma Cosmology'],
                correct: 'Big Bang Theory'
            },
            {
                hasContent: false,
                quest: 'A point in space where gravity is so strong that not even light can escape is known as a:',
                choices: ['Nebula', 'Quasar', 'Black Hole', 'White Dwarf'],
                correct: 'Black Hole'
            },
            {
                hasContent: false,
                quest: 'Who proposed the theory of general relativity, which describes the structure of space-time?',
                choices: ['Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Galileo Galilei'],
                correct: 'Albert Einstein'
            },
            {
                hasContent: false,
                quest: 'The Sun primarily consists of which two elements?',
                choices: ['Hydrogen and Oxygen', 'Hydrogen and Helium', 'Helium and Nitrogen', 'Carbon and Oxygen'],
                correct: 'Hydrogen and Helium'
            },
            {
                hasContent: false,
                quest: 'Which method detects exoplanets by observing the dimming of a star as a planet crosses in front of it?',
                choices: ['Radial Velocity', 'Transit Method', 'Direct Imaging', 'Astrometry'],
                correct: 'Transit Method'
            },
            {
                hasContent: false,
                quest: 'A nebula is primarily composed of:',
                choices: ['Rock and ice', 'Gas and dust', 'Dark matter', 'Plasma'],
                correct: 'Gas and dust'
            },
            {
                hasContent: false,
                quest: 'Which force is responsible for the structure of space-time around massive objects?',
                choices: ['Electromagnetic Force', 'Weak Nuclear Force', 'Strong Nuclear Force', 'Gravitational Force'],
                correct: 'Gravitational Force'
            },
            {
                hasContent: false,
                quest: 'Who discovered that the universe is expanding?',
                choices: ['Albert Einstein', 'Edwin Hubble', 'Stephen Hawking', 'Isaac Newton'],
                correct: 'Edwin Hubble'
            },
            {
                hasContent: false,
                quest: 'Solar wind can cause which phenomenon on Earth?',
                choices: ['Earthquakes', 'Volcanic Eruptions', 'Auroras', 'Tsunamis'],
                correct: 'Auroras'
            },
            {
                hasContent: false,
                quest: 'The Moon\'s gravitational influence primarily affects Earth\'s:',
                choices: ['Atmosphere', 'Orbit around the Sun', 'Tides', 'Magnetic Field'],
                correct: 'Tides'
            },
            {
                hasContent: false,
                quest: 'An exoplanet in the "habitable zone" of a star is also referred to as a:',
                choices: ['Goldilocks Planet', 'Rogue Planet', 'Gas Giant', 'Ice Giant'],
                correct: 'Goldilocks Planet'
            }
        ],

        anatomy: [
            {
                hasContent: false,
                quest: 'What organ pumps blood throughout the body?',
                choices: ['Heart', 'Lung', 'Brain', 'Liver'],
                correct: 'Heart'
            },
            {
                hasContent: false,
                quest: 'What is the largest organ of the human body?',
                choices: ['Skin', 'Liver', 'Heart', 'Brain'],
                correct: 'Skin'
            },
            {
                hasContent: false,
                quest: 'Which bone is located in the arm?',
                choices: ['Femur', 'Tibia', 'Radius', 'Pelvis'],
                correct: 'Radius'
            },
            {
                hasContent: false,
                quest: 'What is the main function of the kidneys?',
                choices: ['Digestion', 'Circulation', 'Filtration', 'Breathing'],
                correct: 'Filtration'
            },
            {
                hasContent: false,
                quest: 'What structure connects muscle to bone?',
                choices: ['Ligament', 'Tendon', 'Cartilage', 'Fascia'],
                correct: 'Tendon'
            },
            {
                hasContent: false,
                quest: 'Which part of the brain controls balance?',
                choices: ['Cerebrum', 'Cerebellum', 'Brainstem', 'Amygdala'],
                correct: 'Cerebellum'
            },
            {
                hasContent: false,
                quest: 'What cells carry oxygen in the blood?',
                choices: ['Platelets', 'Neurons', 'Red Cells', 'White Cells'],
                correct: 'Red Cells'
            },
            {
                hasContent: false,
                quest: 'Which organ is part of the digestive system?',
                choices: ['Heart', 'Liver', 'Lung', 'Kidney'],
                correct: 'Liver'
            },
            {
                hasContent: false,
                quest: 'What is the smallest bone in the human body?',
                choices: ['Femur', 'Stapes', 'Radius', 'Ulna'],
                correct: 'Stapes'
            },
            {
                hasContent: false,
                quest: 'What tissue connects bones at joints?',
                choices: ['Muscle', 'Ligament', 'Tendon', 'Cartilage'],
                correct: 'Ligament'
            },
            {
                hasContent: false,
                quest: 'Where are red blood cells produced?',
                choices: ['Heart', 'Lung', 'Liver', 'Bone Marrow'],
                correct: 'Bone Marrow'
            },
            {
                hasContent: false,
                quest: 'Which organ is responsible for detoxification?',
                choices: ['Heart', 'Liver', 'Kidney', 'Lung'],
                correct: 'Liver'
            },
            {
                hasContent: false,
                quest: 'Which system includes the heart and blood vessels?',
                choices: ['Digestive', 'Nervous', 'Circulatory', 'Respiratory'],
                correct: 'Circulatory'
            },
            {
                hasContent: false,
                quest: 'What part of the eye controls light entry?',
                choices: ['Lens', 'Retina', 'Iris', 'Cornea'],
                correct: 'Iris'
            },
            {
                hasContent: false,
                quest: 'What is the primary function of the lungs?',
                choices: ['Digestion', 'Circulation', 'Respiration', 'Filtration'],
                correct: 'Respiration'
            },
            {
                hasContent: false,
                quest: 'Which gland produces insulin?',
                choices: ['Thyroid', 'Pancreas', 'Pituitary', 'Adrenal'],
                correct: 'Pancreas'
            },
            {
                hasContent: false,
                quest: 'Which part of the brain controls memory?',
                choices: ['Cerebrum', 'Cerebellum', 'Hippocampus', 'Brainstem'],
                correct: 'Hippocampus'
            },
            {
                hasContent: false,
                quest: 'What is the primary unit of the nervous system?',
                choices: ['Neuron', 'Muscle', 'Cell', 'Tissue'],
                correct: 'Neuron'
            },
            {
                hasContent: false,
                quest: 'What type of joint is the knee?',
                choices: ['Ball', 'Hinge', 'Pivot', 'Saddle'],
                correct: 'Hinge'
            },
            {
                hasContent: false,
                quest: 'What organ produces bile?',
                choices: ['Pancreas', 'Gallbladder', 'Liver', 'Kidney'],
                correct: 'Liver'
            },
            {
                hasContent: false,
                quest: 'What protects the brain and spinal cord?',
                choices: ['Skull', 'Vertebrae', 'Cranium', 'Meninges'],
                correct: 'Meninges'
            },
            {
                hasContent: false,
                quest: 'What muscle is used in breathing?',
                choices: ['Diaphragm', 'Biceps', 'Triceps', 'Latissimus'],
                correct: 'Diaphragm'
            },
            {
                hasContent: false,
                quest: 'Which organ filters waste from blood?',
                choices: ['Heart', 'Liver', 'Kidney', 'Lung'],
                correct: 'Kidney'
            },
            {
                hasContent: false,
                quest: 'What is the main function of white blood cells?',
                choices: ['Transport', 'Digestion', 'Immunity', 'Oxygenation'],
                correct: 'Immunity'
            }
        ],

        economy: [
            {
                hasContent: false,
                quest: 'What term describes the total value of goods and services produced in a country?',
                choices: ['GDP', 'Inflation', 'Deficit', 'Revenue'],
                correct: 'GDP'
            },
            {
                hasContent: false,
                quest: 'What is a market condition with declining prices called?',
                choices: ['Boom', 'Recession', 'Deflation', 'Inflation'],
                correct: 'Deflation'
            },
            {
                hasContent: false,
                quest: 'Which economic system is based on supply and demand with little government intervention?',
                choices: ['Capitalism', 'Socialism', 'Communism', 'Feudalism'],
                correct: 'Capitalism'
            },
            {
                hasContent: false,
                quest: 'What term is used for the decrease in a currency’s buying power?',
                choices: ['Growth', 'Deflation', 'Inflation', 'Recession'],
                correct: 'Inflation'
            },
            {
                hasContent: false,
                quest: 'Which organization aims to ensure global financial stability?',
                choices: ['UN', 'IMF', 'NATO', 'WHO'],
                correct: 'IMF'
            },
            {
                hasContent: false,
                quest: 'What term describes the proportion of unemployed individuals in the labor force?',
                choices: ['GDP', 'Inflation', 'Unemployment', 'Deficit'],
                correct: 'Unemployment'
            },
            {
                hasContent: false,
                quest: 'What is it called when government spending exceeds its revenue?',
                choices: ['Profit', 'Surplus', 'Deficit', 'Debt'],
                correct: 'Deficit'
            },
            {
                hasContent: false,
                quest: 'What term describes the total money owed by a government?',
                choices: ['Deficit', 'Surplus', 'Debt', 'Loan'],
                correct: 'Debt'
            },
            {
                hasContent: false,
                quest: 'Which policy involves adjusting the money supply to influence the economy?',
                choices: ['Fiscal', 'Monetary', 'Trade', 'Budget'],
                correct: 'Monetary'
            },
            {
                hasContent: false,
                quest: 'What is the practice of buying and selling goods and services across borders?',
                choices: ['Trade', 'Export', 'Import', 'Commerce'],
                correct: 'Trade'
            },
            {
                hasContent: false,
                quest: 'Which economic indicator measures the average change in prices over time?',
                choices: ['GDP', 'CPI', 'PPP', 'EPS'],
                correct: 'CPI'
            },
            {
                hasContent: false,
                quest: 'What term describes a prolonged period of low economic activity?',
                choices: ['Boom', 'Growth', 'Recession', 'Peak'],
                correct: 'Recession'
            },
            {
                hasContent: false,
                quest: 'What is the practice of investing in a variety of assets to reduce risk?',
                choices: ['Saving', 'Diversify', 'Speculate', 'Hedge'],
                correct: 'Diversify'
            },
            {
                hasContent: false,
                quest: 'What term describes a stock market with declining prices?',
                choices: ['Bull', 'Bear', 'Stag', 'Wolf'],
                correct: 'Bear'
            },
            {
                hasContent: false,
                quest: 'What is the term for the price at which a currency can be exchanged for another?',
                choices: ['Rate', 'Value', 'Exchange', 'Forex'],
                correct: 'Exchange'
            },
            {
                hasContent: false,
                quest: 'What do you call the period of rapid economic growth and high employment?',
                choices: ['Recession', 'Depression', 'Boom', 'Crisis'],
                correct: 'Boom'
            },
            {
                hasContent: false,
                quest: 'What is a loan taken to purchase property, usually a house, called?',
                choices: ['Credit', 'Mortgage', 'Debt', 'Lease'],
                correct: 'Mortgage'
            },
            {
                hasContent: false,
                quest: 'Which term refers to the cost of borrowing or the return on savings?',
                choices: ['Profit', 'Interest', 'Dividend', 'Yield'],
                correct: 'Interest'
            },
            {
                hasContent: false,
                quest: 'What is a person or entity that owns shares in a company called?',
                choices: ['Creditor', 'Investor', 'Shareholder', 'Manager'],
                correct: 'Shareholder'
            },
            {
                hasContent: false,
                quest: 'Which term refers to a market condition with rising prices?',
                choices: ['Bear', 'Bull', 'Stag', 'Wolf'],
                correct: 'Bull'
            },
            {
                hasContent: false,
                quest: 'What is a government-imposed limit on the quantity of a product imported called?',
                choices: ['Tariff', 'Quota', 'Ban', 'Levy'],
                correct: 'Quota'
            },
            {
                hasContent: false,
                quest: 'What term describes the transfer of a company or organization from public to private?',
                choices: ['Nationalize', 'Privatize', 'Merge', 'Acquire'],
                correct: 'Privatize'
            },
            {
                hasContent: false,
                quest: 'What is a financial asset that represents a part ownership in a company?',
                choices: ['Bond', 'Stock', 'Fund', 'Note'],
                correct: 'Stock'
            },
            {
                hasContent: false,
                quest: 'What term is used for a sudden economic crash or downturn?',
                choices: ['Growth', 'Peak', 'Bubble', 'Crisis'],
                correct: 'Crisis'
            }
        ],

        geography: [
            {
                hasContent: false,
                quest: 'What is the largest continent by area?',
                choices: ['Asia', 'Africa', 'Europe', 'America'],
                correct: 'Asia'
            },
            {
                hasContent: false,
                quest: 'Which river is the longest in the world?',
                choices: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'],
                correct: 'Nile'
            },
            {
                hasContent: false,
                quest: 'Mount Everest is part of which mountain range?',
                choices: ['Alps', 'Himalayas', 'Rockies', 'Andes'],
                correct: 'Himalayas'
            },
            {
                hasContent: false,
                quest: 'What is the capital city of France?',
                choices: ['Paris', 'Berlin', 'London', 'Rome'],
                correct: 'Paris'
            },
            {
                hasContent: false,
                quest: 'Which desert is the largest in the world?',
                choices: ['Sahara', 'Gobi', 'Arabian', 'Kalahari'],
                correct: 'Sahara'
            },
            {
                hasContent: false,
                quest: 'What is the smallest country by area?',
                choices: ['Monaco', 'Nauru', 'Vatican', 'Malta'],
                correct: 'Vatican'
            },
            {
                hasContent: false,
                quest: 'Which ocean is the largest by area?',
                choices: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
                correct: 'Pacific'
            },
            {
                hasContent: false,
                quest: 'What is the longest river in North America?',
                choices: ['Mississippi', 'Missouri', 'Yukon', 'Colorado'],
                correct: 'Mississippi'
            },
            {
                hasContent: false,
                quest: 'Which country has the largest population?',
                choices: ['China', 'India', 'USA', 'Indonesia'],
                correct: 'China'
            },
            {
                hasContent: false,
                quest: 'The Great Barrier Reef is located off the coast of which country?',
                choices: ['Australia', 'USA', 'Brazil', 'India'],
                correct: 'Australia'
            },
            {
                hasContent: false,
                quest: 'Which is the world’s smallest ocean?',
                choices: ['Arctic', 'Indian', 'Atlantic', 'Pacific'],
                correct: 'Arctic'
            },
            {
                hasContent: false,
                quest: 'What is the capital of Japan?',
                choices: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'],
                correct: 'Tokyo'
            },
            {
                hasContent: false,
                quest: 'The Amazon Rainforest is primarily located in which country?',
                choices: ['Brazil', 'Peru', 'Colombia', 'Venezuela'],
                correct: 'Brazil'
            },
            {
                hasContent: false,
                quest: 'What country is known as the Land of the Rising Sun?',
                choices: ['Japan', 'China', 'Thailand', 'India'],
                correct: 'Japan'
            },
            {
                hasContent: false,
                quest: 'Which African country has the most pyramids?',
                choices: ['Egypt', 'Sudan', 'Algeria', 'Libya'],
                correct: 'Sudan'
            },
            {
                hasContent: false,
                quest: 'The Victoria Falls are located on the border of Zambia and which other country?',
                choices: ['Zimbabwe', 'Botswana', 'Namibia', 'Angola'],
                correct: 'Zimbabwe'
            },
            {
                hasContent: false,
                quest: 'What is the largest island in the world?',
                choices: ['Greenland', 'New Guinea', 'Borneo', 'Madagascar'],
                correct: 'Greenland'
            },
            {
                hasContent: false,
                quest: 'Which country is both a continent and a country?',
                choices: ['Australia', 'India', 'Brazil', 'Egypt'],
                correct: 'Australia'
            },
            {
                hasContent: false,
                quest: 'The Danube River flows into which body of water?',
                choices: ['Black Sea', 'Baltic Sea', 'Red Sea', 'Caspian Sea'],
                correct: 'Black Sea'
            },
            {
                hasContent: false,
                quest: 'What is the capital of Canada?',
                choices: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'],
                correct: 'Ottawa'
            },
            {
                hasContent: false,
                quest: 'The Sahara Desert spans across how many African countries?',
                choices: ['8', '11', '5', '13'],
                correct: '11'
            },
            {
                hasContent: false,
                quest: 'Which European country is known for its fjords?',
                choices: ['Norway', 'Sweden', 'Finland', 'Iceland'],
                correct: 'Norway'
            },
            {
                hasContent: false,
                quest: 'What is the deepest point in the world’s oceans?',
                choices: ['Mariana Trench', 'Java Trench', 'Tonga Trench', 'Puerto Rico Trench'],
                correct: 'Mariana Trench'
            },
            {
                hasContent: false,
                quest: 'Which country is not a part of Scandinavia?',
                choices: ['Norway', 'Denmark', 'Finland', 'Sweden'],
                correct: 'Finland'
            }
        ],

        mathematics: [
            {
                hasContent: false,
                quest: 'What is the value of Pi up to two decimal places?',
                choices: ['3.14', '3.15', '3.16', '3.17'],
                correct: '3.14'
            },
            {
                hasContent: false,
                quest: 'In geometry, how many sides does a hexagon have?',
                choices: ['5', '6', '7', '8'],
                correct: '6'
            },
            {
                hasContent: false,
                quest: 'What is the square root of 144?',
                choices: ['10', '11', '12', '13'],
                correct: '12'
            },
            {
                hasContent: true,
                quest: 'This theorem in geometry states that a²+b²=c² in a right triangle.',
                content: 'It is named after a famous Greek mathematician.',
                choices: ['Euclid', 'Pythagoras', 'Archimedes', 'Plato'],
                correct: 'Pythagoras'
            },
            {
                hasContent: false,
                quest: 'What is the sum of angles in a triangle?',
                choices: ['180°', '360°', '90°', '270°'],
                correct: '180°'
            },
            {
                hasContent: false,
                quest: 'Which number is represented by the Roman numeral "X"?',
                choices: ['5', '10', '15', '20'],
                correct: '10'
            },
            {
                hasContent: true,
                quest: 'Identify the sequence where each number is the sum of the two preceding ones.',
                content: 'This sequence starts with 0 and 1.',
                choices: ['Prime', 'Fibonacci', 'Square', 'Cube'],
                correct: 'Fibonacci'
            },
            {
                hasContent: false,
                quest: 'What is 7 factorial (7!)?',
                choices: ['5040', '4032', '720', '840'],
                correct: '5040'
            },
            {
                hasContent: false,
                quest: 'Which branch of mathematics deals with the properties of space?',
                choices: ['Algebra', 'Calculus', 'Geometry', 'Trigonometry'],
                correct: 'Geometry'
            },
            {
                hasContent: true,
                quest: 'In this type of graph, data is represented by symbols such as bars.',
                content: 'It is commonly used to compare different groups or track changes over time.',
                choices: ['Pie chart', 'Line graph', 'Bar graph', 'Histogram'],
                correct: 'Bar graph'
            },
            {
                hasContent: false,
                quest: 'What is the smallest prime number?',
                choices: ['0', '1', '2', '3'],
                correct: '2'
            },
            {
                hasContent: false,
                quest: 'What term describes a number divisible only by 1 and itself?',
                choices: ['Composite', 'Prime', 'Even', 'Odd'],
                correct: 'Prime'
            },
            {
                hasContent: true,
                quest: 'This constant is approximately 2.718 and is the base of natural logarithms.',
                content: 'It is named after a famous mathematician.',
                choices: ['Pi', 'Euler', 'Newton', 'Gauss'],
                correct: 'Euler'
            },
            {
                hasContent: false,
                quest: 'In probability, what does P(A) represent?',
                choices: ['Product A', 'Probability of A', 'Power of A', 'Position of A'],
                correct: 'Probability of A'
            },
            {
                hasContent: false,
                quest: 'What is the perimeter of a square with side length 4 units?',
                choices: ['8', '12', '16', '20'],
                correct: '16'
            },
            {
                hasContent: true,
                quest: 'This mathematical principle states that the order of numbers does not change the sum.',
                content: 'It applies to both addition and multiplication.',
                choices: ['Associative', 'Distributive', 'Commutative', 'Subtractive'],
                correct: 'Commutative'
            },
            {
                hasContent: false,
                quest: 'What is the derivative of x²?',
                choices: ['2x', 'x', '2x²', 'x³'],
                correct: '2x'
            },
            {
                hasContent: true,
                quest: 'What is the probability of rolling a total of 7 with two dice?',
                content: 'Consider all possible outcomes when two dice are rolled.',
                choices: ['1/6', '1/12', '1/18', '1/36'],
                correct: '1/6'
            },
            {
                hasContent: true,
                quest: 'Identify the next number: 2, 4, 8, 16...',
                content: 'This sequence doubles each time.',
                choices: ['20', '24', '32', '36'],
                correct: '32'
            },
            {
                hasContent: false,
                quest: 'What is the square root of 81?',
                choices: ['7', '8', '9', '10'],
                correct: '9'
            },
            {
                hasContent: true,
                quest: 'Solve the equation: 5x - 10 = 0',
                content: 'Find the value of x.',
                choices: ['0', '2', '10', '20'],
                correct: '2'
            },
            {
                hasContent: false,
                quest: 'How many sides does a decagon have?',
                choices: ['8', '10', '12', '14'],
                correct: '10'
            },
            {
                hasContent: true,
                quest: 'What is the sum of the angles in a quadrilateral?',
                content: 'A quadrilateral is a four-sided polygon.',
                choices: ['180°', '270°', '360°', '450°'],
                correct: '360°'
            },
            {
                hasContent: false,
                quest: 'What is 15% of 200?',
                choices: ['20', '30', '40', '50'],
                correct: '30'
            },
            {
                hasContent: true,
                quest: 'Calculate the median of these numbers: 3, 7, 9, 13, 17',
                content: 'The median is the middle number in a sorted list.',
                choices: ['7', '9', '13', '17'],
                correct: '9'
            },
            {
                hasContent: false,
                quest: 'What is the factorial of 5 (5!)?',
                choices: ['100', '120', '150', '180'],
                correct: '120'
            },
            {
                hasContent: true,
                quest: 'If a circle has a diameter of 8 cm, what is its radius?',
                content: 'Radius is half the diameter of a circle.',
                choices: ['2 cm', '4 cm', '8 cm', '16 cm'],
                correct: '4 cm'
            },
            {
                hasContent: false,
                quest: 'What is the common ratio in the geometric sequence 2, 6, 18, 54?',
                choices: ['2', '3', '4', '6'],
                correct: '3'
            },
            {
                hasContent: true,
                quest: 'Solve for x: x/2 + x/4 = 6',
                content: 'Combine the fractions and solve the equation.',
                choices: ['4', '6', '8', '12'],
                correct: '8'
            },
            {
                hasContent: false,
                quest: 'Which of these is a prime number?',
                choices: ['31', '51', '81', '91'],
                correct: '31'
            },
            {
                hasContent: true,
                quest: 'This theorem is used in trigonometry to find the lengths of sides in a right triangle.',
                content: 'It relates the sides of the triangle to its angles.',
                choices: ['Pythagorean', 'Euclidean', 'Sine Rule', 'Cosine Rule'],
                correct: 'Sine Rule'
            }
        ],

        music: [
            {
                hasContent: false,
                quest: 'Who composed the "Moonlight Sonata"?',
                choices: ['Ludwig van Beethoven', 'Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Frederic Chopin'],
                correct: 'Ludwig van Beethoven'
            },
            {
                hasContent: false,
                quest: 'Which musical instrument is known as the "king of instruments"?',
                choices: ['Piano', 'Violin', 'Guitar', 'Organ'],
                correct: 'Organ'
            },
            {
                hasContent: false,
                quest: 'Who is the lead singer of the band Queen?',
                choices: ['Freddie Mercury', 'David Bowie', 'Elton John', 'Mick Jagger'],
                correct: 'Freddie Mercury'
            },
            {
                hasContent: false,
                quest: 'Which country is the birthplace of reggae music?',
                choices: ['Jamaica', 'Brazil', 'United States', 'Nigeria'],
                correct: 'Jamaica'
            },
            {
                hasContent: false,
                quest: 'What is the highest male voice type?',
                choices: ['Baritone', 'Tenor', 'Bass', 'Alto'],
                correct: 'Tenor'
            },
            {
                hasContent: false,
                quest: 'Who wrote the opera "Madame Butterfly"?',
                choices: ['Giuseppe Verdi', 'Giacomo Puccini', 'Richard Wagner', 'Wolfgang Amadeus Mozart'],
                correct: 'Giacomo Puccini'
            },
            {
                hasContent: false,
                quest: 'What is the term for the speed of a piece of music?',
                choices: ['Rhythm', 'Tempo', 'Beat', 'Melody'],
                correct: 'Tempo'
            },
            {
                hasContent: false,
                quest: 'In which musical key do most American blues songs typically perform?',
                choices: ['C Major', 'G Major', 'B-flat Major', 'E Major'],
                correct: 'E Major'
            },
            {
                hasContent: false,
                quest: 'What is the name of the musical symbol that indicates silence?',
                choices: ['Clef', 'Rest', 'Note', 'Beat'],
                correct: 'Rest'
            },
            {
                hasContent: false,
                quest: 'Who composed "The Four Seasons"?',
                choices: ['Antonio Vivaldi', 'Johann Sebastian Bach', 'Ludwig van Beethoven', 'Pyotr Ilyich Tchaikovsky'],
                correct: 'Antonio Vivaldi'
            },
            {
                hasContent: false,
                quest: 'Which artist is known as the "King of Pop"?',
                choices: ['Michael Jackson', 'Elvis Presley', 'Prince', 'David Bowie'],
                correct: 'Michael Jackson'
            },
            {
                hasContent: false,
                quest: 'What genre of music originated in New Orleans in the early 20th century?',
                choices: ['Rock', 'Jazz', 'Blues', 'Country'],
                correct: 'Jazz'
            },
            {
                hasContent: false,
                quest: 'What is the name of the Indian stringed instrument used in classical music?',
                choices: ['Sitar', 'Tabla', 'Veena', 'Sarod'],
                correct: 'Sitar'
            },
            {
                hasContent: false,
                quest: 'Who composed the "Brandenburg Concertos"?',
                choices: ['Johann Sebastian Bach', 'Ludwig van Beethoven', 'Wolfgang Amadeus Mozart', 'George Frideric Handel'],
                correct: 'Johann Sebastian Bach'
            },
            {
                hasContent: false,
                quest: 'Which musical note is represented by a symbol that looks like an oval with a stem?',
                choices: ['Whole note', 'Half note', 'Quarter note', 'Eighth note'],
                correct: 'Quarter note'
            },
            {
                hasContent: true,
                quest: 'What is the style of singing where the voice fluctuates rapidly between two notes?',
                content: 'This style is commonly used in opera and is characterized by a trembling effect.',
                choices: ['Vibrato', 'Falsetto', 'Yodeling', 'Belting'],
                correct: 'Vibrato'
            },
            {
                hasContent: true,
                quest: 'Who is the composer famous for his symphonies, including the "Choral Symphony"?',
                content: 'This composer was deaf for much of his life but continued to create groundbreaking music.',
                choices: ['Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Ludwig van Beethoven', 'Franz Schubert'],
                correct: 'Ludwig van Beethoven'
            },
            {
                hasContent: true,
                quest: 'Which instrument is commonly used in Flamenco music?',
                content: 'This stringed instrument is integral to the sound and style of Flamenco music, originating in Spain.',
                choices: ['Violin', 'Guitar', 'Piano', 'Saxophone'],
                correct: 'Guitar'
            }
        ],

        sports: [
            {
                hasContent: false,
                quest: 'Which sport is known as "the beautiful game"?',
                choices: ['Basketball', 'Football', 'Tennis', 'Golf'],
                correct: 'Football'
            },
            {
                hasContent: true,
                quest: 'Identify the sport based on the playing area: diamond.',
                content: 'This sport involves a bat, a ball, and bases arranged in a diamond shape.',
                choices: ['Cricket', 'Baseball', 'Softball', 'Lacrosse'],
                correct: 'Baseball'
            },
            {
                hasContent: false,
                quest: 'In tennis, what is a zero score called?',
                choices: ['Love', 'Nil', 'Zero', 'Ace'],
                correct: 'Love'
            },
            {
                hasContent: true,
                quest: 'Which team won the FIFA World Cup in 2014?',
                content: 'This tournament was held in Brazil.',
                choices: ['Brazil', 'Germany', 'Spain', 'Argentina'],
                correct: 'Germany'
            },
            {
                hasContent: false,
                quest: 'How many players are there in a basketball team?',
                choices: ['4', '5', '6', '7'],
                correct: '5'
            },
            {
                hasContent: true,
                quest: 'What is the highest score possible in 10-pin bowling?',
                content: 'This score is achieved by getting a strike in every frame.',
                choices: ['200', '250', '300', '350'],
                correct: '300'
            },
            {
                hasContent: false,
                quest: 'Which country originated the martial art of judo?',
                choices: ['China', 'Korea', 'Japan', 'Thailand'],
                correct: 'Japan'
            },
            {
                hasContent: true,
                quest: 'Who is known as "The King of Clay" in tennis?',
                content: 'This player has won multiple French Open titles.',
                choices: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Andy Murray'],
                correct: 'Rafael Nadal'
            },
            {
                hasContent: false,
                quest: 'What is the term for a score of three under par in golf?',
                choices: ['Eagle', 'Birdie', 'Albatross', 'Bogey'],
                correct: 'Albatross'
            },
            {
                hasContent: true,
                quest: 'What sport is played at Wimbledon?',
                content: 'Wimbledon is the oldest tennis tournament in the world.',
                choices: ['Cricket', 'Rugby', 'Tennis', 'Squash'],
                correct: 'Tennis'
            },
            {
                hasContent: false,
                quest: 'In which sport would you perform a "Fosbury Flop"?',
                choices: ['Diving', 'High Jump', 'Pole Vault', 'Gymnastics'],
                correct: 'High Jump'
            },
            {
                hasContent: true,
                quest: 'Who holds the record for the most Olympic gold medals?',
                content: 'This athlete is a swimmer.',
                choices: ['Usain Bolt', 'Michael Phelps', 'Mark Spitz', 'Carl Lewis'],
                correct: 'Michael Phelps'
            },
            {
                hasContent: false,
                quest: 'What is the length of a marathon race?',
                choices: ['26.2 miles', '13.1 miles', '10 km', '5 km'],
                correct: '26.2 miles'
            },
            {
                hasContent: true,
                quest: 'What is the national sport of Japan?',
                content: 'This sport involves two wrestlers in a circular ring.',
                choices: ['Karate', 'Judo', 'Sumo', 'Kendo'],
                correct: 'Sumo'
            },
            {
                hasContent: false,
                quest: 'Which sport uses terms like "stalefish" and "nosegrab"?',
                choices: ['Surfing', 'Skateboarding', 'Snowboarding', 'BMX'],
                correct: 'Snowboarding'
            },
            {
                hasContent: true,
                quest: 'Which country hosted the 2016 Summer Olympics?',
                content: 'This event was held in South America.',
                choices: ['Brazil', 'Argentina', 'Chile', 'Colombia'],
                correct: 'Brazil'
            },
            {
                hasContent: false,
                quest: 'In which sport do players use mallets to hit balls through hoops?',
                choices: ['Polo', 'Croquet', 'Golf', 'Lacrosse'],
                correct: 'Croquet'
            },
            {
                hasContent: true,
                quest: 'Who is the most decorated gymnast in history?',
                content: 'This athlete has won a total of 25 World Championship medals.',
                choices: ['Simone Biles', 'Nadia Comăneci', 'Shannon Miller', 'Svetlana Khorkina'],
                correct: 'Simone Biles'
            }
        ],

        cinema: [
            {
                hasContent: false,
                quest: 'Who directed the movie "Jaws"?',
                choices: ['Steven Spielberg', 'Martin Scorsese', 'Stanley Kubrick', 'George Lucas'],
                correct: 'Steven Spielberg'
            },
            {
                hasContent: true,
                quest: 'What is the highest-grossing film of all time?',
                content: 'This film, released in 2009, was re-released in 2021.',
                choices: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Star Wars: The Force Awakens'],
                correct: 'Avatar'
            },
            {
                hasContent: false,
                quest: 'Which actor played The Joker in "The Dark Knight"?',
                choices: ['Heath Ledger', 'Jack Nicholson', 'Joaquin Phoenix', 'Jared Leto'],
                correct: 'Heath Ledger'
            },
            {
                hasContent: true,
                quest: 'Name the movie with the famous quote: "I\'ll be back."',
                content: 'This quote is from a 1984 science fiction film.',
                choices: ['Terminator', 'RoboCop', 'Total Recall', 'Predator'],
                correct: 'Terminator'
            },
            {
                hasContent: false,
                quest: 'Which movie features the song "My Heart Will Go On"?',
                choices: ['Titanic', 'The Bodyguard', 'Ghost', 'Pretty Woman'],
                correct: 'Titanic'
            },
            {
                hasContent: true,
                quest: 'What was the first full-length animated feature film ever released?',
                content: 'This film was released by Disney in 1937.',
                choices: ['Cinderella', 'Snow White and the Seven Dwarfs', 'Pinocchio', 'Fantasia'],
                correct: 'Snow White and the Seven Dwarfs'
            },
            {
                hasContent: false,
                quest: 'Who starred as the lead role in "Cast Away"?',
                choices: ['Tom Hanks', 'Brad Pitt', 'Leonardo DiCaprio', 'Matt Damon'],
                correct: 'Tom Hanks'
            },
            {
                hasContent: true,
                quest: 'Which film won the first ever Academy Award for Best Picture?',
                content: 'This film won the award in 1929.',
                choices: ['Wings', 'The Jazz Singer', 'Sunrise', 'Metropolis'],
                correct: 'Wings'
            },
            {
                hasContent: false,
                quest: 'In which film did Julia Roberts play a character named Vivian Ward?',
                choices: ['Erin Brockovich', 'Pretty Woman', 'Mystic Pizza', 'Notting Hill'],
                correct: 'Pretty Woman'
            },
            {
                hasContent: true,
                quest: 'Who is known for directing "Psycho" and "The Birds"?',
                content: 'This director is famous for his suspense and psychological thriller films.',
                choices: ['Alfred Hitchcock', 'Orson Welles', 'John Ford', 'Howard Hawks'],
                correct: 'Alfred Hitchcock'
            },
            {
                hasContent: false,
                quest: 'What is the name of the fictional African country in "Black Panther"?',
                choices: ['Wakanda', 'Zamunda', 'Genovia', 'Aldovia'],
                correct: 'Wakanda'
            },
            {
                hasContent: true,
                quest: 'Which 1994 film features a character named Andy Dufresne?',
                content: 'This film is based on a novella by Stephen King.',
                choices: ['Shawshank Redemption', 'Pulp Fiction', 'Forrest Gump', 'The Green Mile'],
                correct: 'Shawshank Redemption'
            },
            {
                hasContent: false,
                quest: 'Which actor played the lead role in "Indiana Jones"?',
                choices: ['Harrison Ford', 'Sean Connery', 'Tom Selleck', 'Bruce Willis'],
                correct: 'Harrison Ford'
            },
            {
                hasContent: true,
                quest: 'What is the highest-grossing R-rated movie of all time?',
                content: 'As of 2023, this film is a superhero movie released in 2019.',
                choices: ['Deadpool', 'Joker', 'Logan', 'It'],
                correct: 'Joker'
            },
            {
                hasContent: false,
                quest: 'In which film would you find the character Jack Dawson?',
                choices: ['Titanic', 'Inception', 'The Revenant', 'Gangs of New York'],
                correct: 'Titanic'
            },
            {
                hasContent: true,
                quest: 'Which film popularized the phrase "May the Force be with you"?',
                content: 'This phrase is from a popular space opera franchise.',
                choices: ['Star Wars', 'Star Trek', 'Battlestar Galactica', 'Guardians of the Galaxy'],
                correct: 'Star Wars'
            },
            {
                hasContent: false,
                quest: 'What is the name of the wizard played by Ian McKellen in "The Lord of the Rings"?',
                choices: ['Gandalf', 'Saruman', 'Elrond', 'Radagast'],
                correct: 'Gandalf'
            },
            {
                hasContent: true,
                quest: 'Which film did Tom Hanks win his first Oscar for Best Actor?',
                content: 'He won this Oscar in 1994.',
                choices: ['Forrest Gump', 'Philadelphia', 'Cast Away', 'Saving Private Ryan'],
                correct: 'Philadelphia'
            }
        ],

        political: [
            {
                hasContent: false,
                quest: 'Who is the "Father of the Constitution"?',
                choices: ['Madison', 'Hamilton', 'Jefferson', 'Adams'],
                correct: 'Madison'
            },
            {
                hasContent: false,
                quest: 'What is the supreme law of the land?',
                choices: ['The Constitution', 'The President', 'The Congress', 'The Judiciary'],
                correct: 'The Constitution'
            },
            {
                hasContent: true,
                quest: 'Which ideology promotes public ownership?',
                content: 'Capitalism, Socialism, Anarchism, Monarchy',
                contentType: 'text',
                choices: ['Capitalism', 'Socialism', 'Anarchism', 'Monarchy'],
                correct: 'Socialism'
            },
            {
                hasContent: false,
                quest: 'What is the term for policy of extending power?',
                choices: ['Imperialism', 'Democracy', 'Oligarchy', 'Theocracy'],
                correct: 'Imperialism'
            },
            {
                hasContent: true,
                quest: 'Who was the first female Prime Minister?',
                content: 'UK political history',
                contentType: 'text',
                choices: ['Thatcher', 'Merkel', 'Gandhi', 'Meir'],
                correct: 'Thatcher'
            },
            {
                hasContent: false,
                quest: 'What is a government by the people called?',
                choices: ['Democracy', 'Monarchy', 'Dictatorship', 'Aristocracy'],
                correct: 'Democracy'
            },
            {
                hasContent: true,
                quest: 'Which system has a king but limited powers?',
                content: 'Monarchy types',
                contentType: 'text',
                choices: ['Absolute', 'Constitutional', 'Federal', 'Unitary'],
                correct: 'Constitutional'
            },
            {
                hasContent: false,
                quest: 'What is the political term for city rule?',
                choices: ['Urbanism', 'Municipalism', 'Ruralism', 'Regionalism'],
                correct: 'Municipalism'
            },
            {
                hasContent: true,
                quest: 'What is the lower house of US Congress?',
                content: 'US legislative branches',
                contentType: 'text',
                choices: ['Senate', 'House', 'Assembly', 'Council'],
                correct: 'House'
            },
            {
                hasContent: false,
                quest: 'What is rule by a few powerful people?',
                choices: ['Oligarchy', 'Plutocracy', 'Democracy', 'Autocracy'],
                correct: 'Oligarchy'
            },
            {
                hasContent: true,
                quest: 'Which country has a Chancellor as head?',
                content: 'European political titles',
                contentType: 'text',
                choices: ['France', 'UK', 'Germany', 'Italy'],
                correct: 'Germany'
            },
            {
                hasContent: false,
                quest: 'What is the study of government called?',
                choices: ['Sociology', 'Anthropology', 'Political Science', 'Economics'],
                correct: 'Political Science'
            },
            {
                hasContent: true,
                quest: 'Who is known for nonviolent resistance?',
                content: 'Civil rights movement',
                contentType: 'text',
                choices: ['King', 'Gandhi', 'Mandela', 'X'],
                correct: 'Gandhi'
            },
            {
                hasContent: false,
                quest: 'What is a political system with a god at the center?',
                choices: ['Monarchy', 'Theocracy', 'Democracy', 'Anarchy'],
                correct: 'Theocracy'
            },
            {
                hasContent: true,
                quest: 'Which term describes fair treatment through law?',
                content: 'Legal principles',
                contentType: 'text',
                choices: ['Justice', 'Equity', 'Freedom', 'Order'],
                correct: 'Justice'
            },
            {
                hasContent: false,
                quest: 'What is a government without a monarch called?',
                choices: ['Republic', 'Empire', 'Kingdom', 'Dynasty'],
                correct: 'Republic'
            },
            {
                hasContent: true,
                quest: 'Which country transitioned from apartheid?',
                content: 'Historical political changes',
                contentType: 'text',
                choices: ['South Africa', 'Brazil', 'India', 'China'],
                correct: 'South Africa'
            },
            {
                hasContent: false,
                quest: 'What is the term for a state ruled by religious law?',
                choices: ['Secular', 'Clerical', 'Sharia', 'Canonical'],
                correct: 'Sharia'
            }
        ],

        game: [
            {
                hasContent: false,
                quest: 'What was the first video game console?',
                choices: ['Atari', 'Odyssey', 'NES', 'Sega'],
                correct: 'Odyssey'
            },
            {
                hasContent: false,
                quest: 'Who created the character of Mario?',
                choices: ['Kojima', 'Miyamoto', 'Carmack', 'Spector'],
                correct: 'Miyamoto'
            },
            {
                hasContent: false,
                quest: 'What is the best-selling video game of all time?',
                choices: ['Tetris', 'Minecraft', 'GTA V', 'Wii Sports'],
                correct: 'Minecraft'
            },
            {
                hasContent: false,
                quest: 'What year was the first "Call of Duty" game released?',
                choices: ['2001', '2003', '2005', '2007'],
                correct: '2003'
            },
            {
                hasContent: false,
                quest: 'Which game features an enemy-eating, egg-throwing dinosaur?',
                choices: ['Sonic', 'Mario', 'Zelda', 'Metroid'],
                correct: 'Mario'
            },
            {
                hasContent: false,
                quest: 'What game involves crossing a road and river as a frog?',
                choices: ['Frogger', 'Donkey Kong', 'Pac-Man', 'Space Invaders'],
                correct: 'Frogger'
            },
            {
                hasContent: false,
                quest: 'What was thought to be the first video game?',
                choices: ['Tennis for Two', 'Spacewar!', 'Pong', 'Asteroids'],
                correct: 'Pong'
            },
            {
                hasContent: false,
                quest: 'Which spooky game stars Mario’s brother in a haunted house?',
                choices: ['Mario\'s Mansion', 'Luigi\'s Mansion', 'Wario\'s Haunt', 'Peach\'s Castle'],
                correct: 'Luigi\'s Mansion'
            },
            {
                hasContent: false,
                quest: 'Which console pioneered motion controls in 2006?',
                choices: ['PlayStation 3', 'Xbox 360', 'Wii', 'Nintendo DS'],
                correct: 'Wii'
            },
            {
                hasContent: false,
                quest: 'What is Mario\'s original name in "Donkey Kong"?',
                choices: ['Jumpman', 'Plumber', 'Mario', 'Luigi'],
                correct: 'Jumpman'
            },
            {
                hasContent: false,
                quest: 'Which game features a blue hedgehog?',
                choices: ['Sonic', 'Crash', 'Spyro', 'Kirby'],
                correct: 'Sonic'
            },
            {
                hasContent: false,
                quest: 'What is the name of Link’s fairy companion?',
                choices: ['Zelda', 'Epona', 'Navi', 'Midna'],
                correct: 'Navi'
            },
            {
                hasContent: false,
                quest: 'Which game is set in the post-apocalyptic world of Pandora?',
                choices: ['Fallout', 'Borderlands', 'Bioshock', 'Destiny'],
                correct: 'Borderlands'
            },
            {
                hasContent: false,
                quest: 'What is the virtual currency in "Fortnite" called?',
                choices: ['Coins', 'V-Bucks', 'Gems', 'Credits'],
                correct: 'V-Bucks'
            },
            {
                hasContent: false,
                quest: 'Which game series features the assassin Ezio Auditore?',
                choices: ['Hitman', 'Assassin\'s Creed', 'Splinter Cell', 'Metal Gear'],
                correct: 'Assassin\'s Creed'
            },
            {
                hasContent: true,
                quest: 'What is the name of the final course in "Mario Kart"?',
                content: 'Mario Kart series',
                contentType: 'text',
                choices: ['Bowser\'s Castle', 'Rainbow Road', 'Mario Circuit', 'Luigi Raceway'],
                correct: 'Rainbow Road'
            },
            {
                hasContent: true,
                quest: 'Which game features a battle royale on an island?',
                content: 'Battle royale genre',
                contentType: 'text',
                choices: ['Fortnite', 'PUBG', 'Apex Legends', 'Warzone'],
                correct: 'Fortnite'
            },
            {
                hasContent: true,
                quest: 'What is the name of the hero in "The Legend of Zelda"?',
                content: 'Zelda series protagonist',
                contentType: 'text',
                choices: ['Zelda', 'Link', 'Ganon', 'Sheik'],
                correct: 'Link'
            },
            {
                hasContent: false,
                quest: 'Which game features the terms "checkmate" and "stalemate"?',
                choices: ['Chess', 'Checkers', 'Go', 'Backgammon'],
                correct: 'Chess'
            },
            {
                hasContent: true,
                quest: 'Name the video game character known for jumping and wearing a red hat.',
                content: 'This character is a plumber and a mascot for Nintendo.',
                choices: ['Sonic', 'Mario', 'Link', 'Pikachu'],
                correct: 'Mario'
            },
            {
                hasContent: false,
                quest: 'In Monopoly, what color are the two cheapest properties?',
                choices: ['Red', 'Green', 'Brown', 'Yellow'],
                correct: 'Brown'
            },
            {
                hasContent: true,
                quest: 'What is the primary objective in "Minecraft"?',
                content: 'This sandbox game involves building and exploration.',
                choices: ['Racing', 'Survival', 'Fighting', 'Puzzle-solving'],
                correct: 'Survival'
            },
            {
                hasContent: false,
                quest: 'What card game includes "Reverse," "Skip," and "Draw Two" cards?',
                choices: ['Poker', 'Uno', 'Bridge', 'Solitaire'],
                correct: 'Uno'
            },
            {
                hasContent: true,
                quest: 'Which game, originally from Japan, involves capturing creatures called "Pocket Monsters"?',
                content: 'This franchise also includes a popular animated TV series.',
                choices: ['Digimon', 'Yu-Gi-Oh!', 'Pokémon', 'Dragon Ball'],
                correct: 'Pokémon'
            },
            {
                hasContent: false,
                quest: 'In "The Legend of Zelda" series, what is the name of the princess?',
                choices: ['Zelda', 'Peach', 'Daisy', 'Elena'],
                correct: 'Zelda'
            },
            {
                hasContent: true,
                quest: 'Identify the game with a map called "Summoner’s Rift".',
                content: 'This game is a popular multiplayer online battle arena (MOBA).',
                choices: ['Dota 2', 'League of Legends', 'Heroes of the Storm', 'Smite'],
                correct: 'League of Legends'
            },
            {
                hasContent: false,
                quest: 'What is the highest-selling video game of all time?',
                choices: ['Tetris', 'Minecraft', 'Grand Theft Auto V', 'Wii Sports'],
                correct: 'Minecraft'
            },
            {
                hasContent: true,
                quest: 'In which game do players fight to be the last one standing on an ever-shrinking battlefield?',
                content: 'This genre of games has become extremely popular in recent years.',
                choices: ['Fortnite', 'Apex Legends', 'PUBG', 'Call of Duty: Warzone'],
                correct: 'Fortnite'
            },
            {
                hasContent: false,
                quest: 'Which game is known for the line "Would you kindly"?',
                choices: ['Bioshock', 'Mass Effect', 'Half-Life', 'Portal'],
                correct: 'Bioshock'
            },
            {
                hasContent: true,
                quest: 'What is the main activity in the game "SimCity"?',
                content: 'Players act as the mayor of a virtual city in this game.',
                choices: ['Building', 'Farming', 'Racing', 'Fighting'],
                correct: 'Building'
            },
            {
                hasContent: false,
                quest: 'What video game series is set in the fictional state of San Andreas?',
                choices: ['Grand Theft Auto', 'Fallout', 'The Elder Scrolls', 'Far Cry'],
                correct: 'Grand Theft Auto'
            },
            {
                hasContent: true,
                quest: 'Which game features historical figures like Leonardo da Vinci and Rodrigo Borgia?',
                content: 'This series blends historical fiction with real events.',
                choices: ['Assassin’s Creed', 'Civilization', 'Age of Empires', 'Total War'],
                correct: 'Assassin’s Creed'
            },
            {
                hasContent: false,
                quest: 'What is the name of the virtual world in "World of Warcraft"?',
                choices: ['Azeroth', 'Tamriel', 'Sanctuary', 'Norrath'],
                correct: 'Azeroth'
            },
            {
                hasContent: true,
                quest: 'What game series is known for the "Fus Ro Dah" shout?',
                content: 'This phrase comes from a popular action RPG series.',
                choices: ['Dark Souls', 'The Witcher', 'Dragon Age', 'The Elder Scrolls'],
                correct: 'The Elder Scrolls'
            },
            {
                hasContent: false,
                quest: 'Which game is primarily played on a grid of black and white tiles?',
                choices: ['Go', 'Chess', 'Checkers', 'Othello'],
                correct: 'Go'
            },
            {
                hasContent: true,
                quest: 'What was the first commercially successful video game?',
                content: 'Released in the 1970s, it featured simple two-dimensional graphics.',
                choices: ['Pong', 'Space Invaders', 'Pac-Man', 'Asteroids'],
                correct: 'Pong'
            }
        ],

        art: [
            {
                hasContent: false,
                quest: 'Who painted the "The Night Watch"?',
                choices: ['Rembrandt', 'Van Gogh', 'Vermeer', 'Picasso'],
                correct: 'Rembrandt'
            },
            {
                hasContent: false,
                quest: 'Which artist is famous for cutting off his own ear?',
                choices: ['Vincent van Gogh', 'Pablo Picasso', 'Salvador Dali', 'Claude Monet'],
                correct: 'Vincent van Gogh'
            },
            {
                hasContent: false,
                quest: 'What art movement is Claude Monet associated with?',
                choices: ['Impressionism', 'Cubism', 'Surrealism', 'Expressionism'],
                correct: 'Impressionism'
            },
            {
                hasContent: false,
                quest: 'What is the main subject of most of Georgia O\'Keeffe\'s paintings?',
                choices: ['Landscapes', 'Portraits', 'Flowers', 'Cityscapes'],
                correct: 'Flowers'
            },
            {
                hasContent: false,
                quest: 'Which artist created the sculpture "The Thinker"?',
                choices: ['Auguste Rodin', 'Michelangelo', 'Donatello', 'Bernini'],
                correct: 'Auguste Rodin'
            },
            {
                hasContent: false,
                quest: 'Where is the Louvre Museum located?',
                choices: ['Paris', 'London', 'New York', 'Berlin'],
                correct: 'Paris'
            },
            {
                hasContent: false,
                quest: 'Who is the artist of the famous painting "Guernica"?',
                choices: ['Pablo Picasso', 'Salvador Dali', 'Joan Miró', 'Francisco Goya'],
                correct: 'Pablo Picasso'
            },
            {
                hasContent: false,
                quest: 'What technique did Jackson Pollock famously use for his paintings?',
                choices: ['Pointillism', 'Impasto', 'Drip Painting', 'Fresco'],
                correct: 'Drip Painting'
            },
            {
                hasContent: false,
                quest: 'Which artist is known for the "Blue Period"?',
                choices: ['Pablo Picasso', 'Vincent van Gogh', 'Paul Cézanne', 'Henri Matisse'],
                correct: 'Pablo Picasso'
            },
            {
                hasContent: false,
                quest: 'What medium did Andy Warhol commonly use in his art?',
                choices: ['Oil Paint', 'Watercolor', 'Silkscreen', 'Charcoal'],
                correct: 'Silkscreen'
            },
            {
                hasContent: false,
                quest: 'In which city is the Van Gogh Museum located?',
                choices: ['Paris', 'Amsterdam', 'London', 'New York'],
                correct: 'Amsterdam'
            },
            {
                hasContent: false,
                quest: 'What is the primary subject of Henri Rousseau’s paintings?',
                choices: ['Cityscapes', 'Portraits', 'Landscapes', 'Jungle Scenes'],
                correct: 'Jungle Scenes'
            },
            {
                hasContent: false,
                quest: 'What is the art of paper folding known as?',
                choices: ['Origami', 'Papier-Mâché', 'Decoupage', 'Kirigami'],
                correct: 'Origami'
            },
            {
                hasContent: false,
                quest: 'Who painted the "Birth of Venus"?',
                choices: ['Botticelli', 'Raphael', 'Titian', 'Michelangelo'],
                correct: 'Botticelli'
            },
            {
                hasContent: false,
                quest: 'What movement is Marcel Duchamp associated with?',
                choices: ['Dadaism', 'Fauvism', 'Abstract Expressionism', 'Cubism'],
                correct: 'Dadaism'
            },
            {
                hasContent: true,
                quest: 'What is the main characteristic of Baroque art?',
                content: 'This art style is known for its exaggerated motion and clear detail used to produce drama and tension.',
                choices: ['Minimalism', 'Realism', 'Abstraction', 'Exaggeration'],
                correct: 'Exaggeration'
            },
            {
                hasContent: true,
                quest: 'Which artist is known for the "Campbell’s Soup Cans" artwork?',
                content: 'This piece is one of the most iconic works of the Pop Art movement.',
                choices: ['Andy Warhol', 'Roy Lichtenstein', 'Keith Haring', 'Jean-Michel Basquiat'],
                correct: 'Andy Warhol'
            },
            {
                hasContent: true,
                quest: 'Who painted "American Gothic," a famous portrait of a farmer and his daughter?',
                content: 'This painting is one of the most familiar images in 20th-century American art.',
                choices: ['Grant Wood', 'Edward Hopper', 'Norman Rockwell', 'John Steuart Curry'],
                correct: 'Grant Wood'
            }
        ],

        technology: [
            {
                hasContent: false,
                quest: 'What does CPU stand for?',
                choices: ['Central Processing Unit', 'Computer Processing Unit', 'Central Performance Unit', 'Computer Performance Unit'],
                correct: 'Central Processing Unit'
            },
            {
                hasContent: false,
                quest: 'Which is not an operating system?',
                choices: ['Windows', 'Linux', 'Java', 'MacOS'],
                correct: 'Java'
            },
            {
                hasContent: false,
                quest: 'What is the main function of a router?',
                choices: ['Data Processing', 'Data Storage', 'Traffic Directing', 'Power Supply'],
                correct: 'Traffic Directing'
            },
            {
                hasContent: false,
                quest: 'What is the binary system based on?',
                choices: ['Numbers 0 and 1', 'Numbers 0 to 9', 'Letters A and B', 'True and False'],
                correct: 'Numbers 0 and 1'
            },
            {
                hasContent: false,
                quest: 'What does LAN stand for?',
                choices: ['Large Access Network', 'Local Access Network', 'Local Area Network', 'Large Area Network'],
                correct: 'Local Area Network'
            },
            {
                hasContent: false,
                quest: 'What is a common video file format?',
                choices: ['JPEG', 'MP3', 'MP4', 'DOCX'],
                correct: 'MP4'
            },
            {
                hasContent: false,
                quest: 'Which company developed the Android OS?',
                choices: ['Apple', 'Microsoft', 'Google', 'IBM'],
                correct: 'Google'
            },
            {
                hasContent: false,
                quest: 'What is the term for unsolicited email?',
                choices: ['Malware', 'Spam', 'Phishing', 'Spyware'],
                correct: 'Spam'
            },
            {
                hasContent: false,
                quest: 'What does ROM stand for?',
                choices: ['Read Only Memory', 'Random Only Memory', 'Run On Memory', 'Random Operate Memory'],
                correct: 'Read Only Memory'
            },
            {
                hasContent: false,
                quest: 'What is the name for a network of networks?',
                choices: ['Intranet', 'Extranet', 'Internet', 'Ethernet'],
                correct: 'Internet'
            },
            {
                hasContent: false,
                quest: 'What is the term for data sent over the internet?',
                choices: ['Packet', 'Byte', 'Bit', 'Baud'],
                correct: 'Packet'
            },
            {
                hasContent: false,
                quest: 'What does GIF stand for?',
                choices: ['Graphics Interchange Format', 'Graphics Integrated Format', 'Graphical Interface Format', 'Graphical Integrated Format'],
                correct: 'Graphics Interchange Format'
            },
            {
                hasContent: false,
                quest: 'What is the term for a harmful computer program?',
                choices: ['Virus', 'Cookie', 'Cache', 'Applet'],
                correct: 'Virus'
            },
            {
                hasContent: false,
                quest: 'What does USB stand for?',
                choices: ['Universal Serial Bus', 'Universal System Bus', 'Unified Serial Bus', 'Unified System Bus'],
                correct: 'Universal Serial Bus'
            },
            {
                hasContent: false,
                quest: 'What is the term for making information unreadable?',
                choices: ['Encoding', 'Encrypting', 'Embossing', 'Engraving'],
                correct: 'Encrypting'
            },
            {
                hasContent: true,
                quest: 'What is the name for a pixelated image?',
                content: 'Image quality terms',
                contentType: 'text',
                choices: ['Vector', 'Bitmap', 'GIF', 'JPEG'],
                correct: 'Bitmap'
            },
            {
                hasContent: true,
                quest: 'What does "www" stand for in a URL?',
                content: 'Internet address prefix',
                contentType: 'text',
                choices: ['World Wide Web', 'Wide Web World', 'Web World Wide', 'Web Wide World'],
                correct: 'World Wide Web'
            },
            {
                hasContent: true,
                quest: 'What is the term for a digital ledger?',
                content: 'Blockchain technology',
                contentType: 'text',
                choices: ['Spreadsheet', 'Database', 'Blockchain', 'Document'],
                correct: 'Blockchain'
            }
        ],

        management: [
            {
                hasContent: false,
                quest: 'What is the primary goal of risk management?',
                choices: ['Profit Maximization', 'Risk Elimination', 'Risk Assessment', 'Risk Mitigation'],
                correct: 'Risk Mitigation'
            },
            {
                hasContent: false,
                quest: 'In management, what does "KPI" stand for?',
                choices: ['Key Performance Indicator', 'Knowledge Process Improvement', 'Key Personnel Identification', 'Knowledge Product Investment'],
                correct: 'Key Performance Indicator'
            },
            {
                hasContent: false,
                quest: 'What does the Peter Principle state?',
                choices: ['Employees rise to their level of competence', 'Management is inherently ineffective', 'Innovation drives success', 'Risk leads to reward'],
                correct: 'Employees rise to their level of competence'
            },
            {
                hasContent: false,
                quest: 'What is the focus of "Agile" project management?',
                choices: ['Speed', 'Flexibility', 'Cost Reduction', 'Quality Assurance'],
                correct: 'Flexibility'
            },
            {
                hasContent: false,
                quest: 'Who developed the 14 Principles of Management?',
                choices: ['Henry Fayol', 'Frederick Taylor', 'Peter Drucker', 'Max Weber'],
                correct: 'Henry Fayol'
            },
            {
                hasContent: false,
                quest: 'What management theory is associated with Maslow’s Hierarchy of Needs?',
                choices: ['X and Y Theory', 'Contingency Theory', 'Human Relations Theory', 'Systems Theory'],
                correct: 'Human Relations Theory'
            },
            {
                hasContent: false,
                quest: 'What is "outsourcing" in a business context?',
                choices: ['Expanding operations', 'Contracting external organizations', 'Reducing product lines', 'Increasing internal tasks'],
                correct: 'Contracting external organizations'
            },
            {
                hasContent: false,
                quest: 'What is the main concern of operations management?',
                choices: ['Marketing Strategies', 'Financial Investments', 'Production and Efficiency', 'Human Resource Policies'],
                correct: 'Production and Efficiency'
            },
            {
                hasContent: false,
                quest: 'What does "ERP" stand for in business management?',
                choices: ['Economic Resource Planning', 'Effective Reengineering Process', 'Employee Retention Program', 'Enterprise Resource Planning'],
                correct: 'Enterprise Resource Planning'
            },
            {
                hasContent: false,
                quest: 'Which theory emphasizes that different situations require different leadership styles?',
                choices: ['Trait Theory', 'Behavioral Theory', 'Situational Leadership', 'Transformational Leadership'],
                correct: 'Situational Leadership'
            },
            {
                hasContent: false,
                quest: 'In management, "SMART" goals refer to what?',
                choices: ['Specific, Measurable, Attainable, Relevant, Time-bound', 'Simple, Manageable, Achievable, Realistic, Timely', 'Strategic, Meaningful, Ambitious, Resourceful, Tangible', 'Systematic, Measurable, Aligned, Reliable, Thorough'],
                correct: 'Specific, Measurable, Attainable, Relevant, Time-bound'
            },
            {
                hasContent: false,
                quest: 'What is the main focus of strategic management?',
                choices: ['Day-to-Day Operations', 'Long-Term Planning', 'Employee Training', 'Immediate Problem Solving'],
                correct: 'Long-Term Planning'
            },
            {
                hasContent: false,
                quest: 'What is "benchmarking" in a business context?',
                choices: ['Setting performance standards', 'Evaluating employee benefits', 'Assessing financial risks', 'Comparing to industry bests'],
                correct: 'Comparing to industry bests'
            },
            {
                hasContent: false,
                quest: 'Which management style is characterized by decision-making with minimal input from others?',
                choices: ['Democratic', 'Autocratic', 'Laissez-faire', 'Transformational'],
                correct: 'Autocratic'
            },
            {
                hasContent: false,
                quest: 'What is the primary focus of crisis management?',
                choices: ['Predicting Future Trends', 'Maximizing Profits', 'Handling Sudden Challenges', 'Improving Public Image'],
                correct: 'Handling Sudden Challenges'
            },
            {
                hasContent: true,
                quest: 'What is the Hawthorne Effect?',
                content: 'It is a phenomenon where individuals change their behavior in response to their awareness of being observed.',
                choices: ['A marketing strategy', 'A management theory', 'A financial principle', 'A human resource policy'],
                correct: 'A management theory'
            },
            {
                hasContent: true,
                quest: 'Who proposed the concept of the Balanced Scorecard?',
                content: 'This framework is used for tracking and managing an organization’s strategy.',
                choices: ['Philip Kotler', 'Robert S. Kaplan and David P. Norton', 'Michael Porter', 'Peter Drucker'],
                correct: 'Robert S. Kaplan and David P. Norton'
            },
            {
                hasContent: true,
                quest: 'What does "Change Management" primarily focus on?',
                content: 'It deals with managing, controlling, and implementing changes in an organization.',
                choices: ['Adapting to Market Changes', 'Improving Employee Skills', 'Managing Organizational Change', 'Modifying Business Goals'],
                correct: 'Managing Organizational Change'
            }
        ],

        chemistry: [
            {
                hasContent: false,
                quest: 'What is the chemical symbol for Gold?',
                choices: ['Au', 'Ag', 'Ge', 'Ga'],
                correct: 'Au'
            },
            {
                hasContent: false,
                quest: 'What is the most abundant gas in the Earth\'s atmosphere?',
                choices: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
                correct: 'Nitrogen'
            },
            {
                hasContent: false,
                quest: 'What type of bond involves the sharing of electron pairs between atoms?',
                choices: ['Ionic Bond', 'Covalent Bond', 'Hydrogen Bond', 'Metallic Bond'],
                correct: 'Covalent Bond'
            },
            {
                hasContent: false,
                quest: 'What is the pH level of pure water?',
                choices: ['5', '7', '9', '11'],
                correct: '7'
            },
            {
                hasContent: false,
                quest: 'Who is known as the father of modern chemistry?',
                choices: ['Antoine Lavoisier', 'Dmitri Mendeleev', 'John Dalton', 'Albert Einstein'],
                correct: 'Antoine Lavoisier'
            },
            {
                hasContent: false,
                quest: 'Which element is named after the creator of the periodic table?',
                choices: ['Curium', 'Gadolinium', 'Mendelevium', 'Einsteinium'],
                correct: 'Mendelevium'
            },
            {
                hasContent: false,
                quest: 'What chemical compound is known as table salt?',
                choices: ['Sodium Chloride', 'Potassium Bromide', 'Calcium Carbonate', 'Magnesium Sulfate'],
                correct: 'Sodium Chloride'
            },
            {
                hasContent: false,
                quest: 'In the periodic table, what is the symbol for iron?',
                choices: ['Ir', 'Fe', 'In', 'I'],
                correct: 'Fe'
            },
            {
                hasContent: false,
                quest: 'What is the main constituent of natural gas?',
                choices: ['Methane', 'Ethane', 'Propane', 'Butane'],
                correct: 'Methane'
            },
            {
                hasContent: false,
                quest: 'What is the process of splitting a nucleus into two or more smaller nuclei called?',
                choices: ['Fusion', 'Fission', 'Decomposition', 'Reduction'],
                correct: 'Fission'
            },
            {
                hasContent: false,
                quest: 'What is the common name for dihydrogen monoxide?',
                choices: ['Salt', 'Sugar', 'Water', 'Acid'],
                correct: 'Water'
            },
            {
                hasContent: false,
                quest: 'What element has the highest melting point?',
                choices: ['Iron', 'Tungsten', 'Carbon', 'Uranium'],
                correct: 'Tungsten'
            },
            {
                hasContent: false,
                quest: 'Which gas is used in balloons to make them float?',
                choices: ['Oxygen', 'Hydrogen', 'Helium', 'Nitrogen'],
                correct: 'Helium'
            },
            {
                hasContent: false,
                quest: 'What type of substance changes the rate of a chemical reaction without being consumed?',
                choices: ['Enzyme', 'Catalyst', 'Solvent', 'Electrolyte'],
                correct: 'Catalyst'
            },
            {
                hasContent: false,
                quest: 'What is the chemical formula for ozone?',
                choices: ['O2', 'O3', 'CO2', 'H2O'],
                correct: 'O3'
            },
            {
                hasContent: true,
                quest: 'What is the color of bromine?',
                content: 'Bromine is one of only two elements on the periodic table that are liquid at room temperature.',
                choices: ['Colorless', 'Yellow', 'Red-brown', 'Blue'],
                correct: 'Red-brown'
            },
            {
                hasContent: true,
                quest: 'Who discovered penicillin?',
                content: 'This discovery in 1928 marked the start of modern antibiotics.',
                choices: ['Marie Curie', 'Alexander Fleming', 'Louis Pasteur', 'Gregor Mendel'],
                correct: 'Alexander Fleming'
            },
            {
                hasContent: true,
                quest: 'What is Avogadro’s number?',
                content: 'It’s the number of particles found in one mole of a substance and is approximately 6.022 x 10^23.',
                choices: ['6.022 x 10^23', '3.141 x 10^7', '9.81 x 10^2', '1.602 x 10^-19'],
                correct: '6.022 x 10^23'
            }
        ],

        physics: [
            {
                hasContent: false,
                quest: 'Who is known as the father of modern physics?',
                choices: ['Einstein', 'Newton', 'Galileo', 'Hawking'],
                correct: 'Einstein'
            },
            {
                hasContent: false,
                quest: 'What is the SI unit of force?',
                choices: ['Newton', 'Joule', 'Pascal', 'Watt'],
                correct: 'Newton'
            },
            {
                hasContent: true,
                quest: 'What does E=mc^2 represent?',
                content: 'Einstein\'s famous equation',
                contentType: 'text',
                choices: ['Energy', 'Mass', 'Speed', 'Gravity'],
                correct: 'Energy'
            },
            {
                hasContent: false,
                quest: 'What is the speed of light in a vacuum?',
                choices: ['3x10^8 m/s', '3x10^6 m/s', '1x10^8 m/s', '5x10^8 m/s'],
                correct: '3x10^8 m/s'
            },
            {
                hasContent: false,
                quest: 'What is the term for the bending of light?',
                choices: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'],
                correct: 'Refraction'
            },
            {
                hasContent: true,
                quest: 'What is the fourth state of matter?',
                content: 'Beyond solid, liquid, gas',
                contentType: 'text',
                choices: ['Plasma', 'Bose-Einstein', 'Dark Matter', 'Neutronium'],
                correct: 'Plasma'
            },
            {
                hasContent: false,
                quest: 'What is the main principle of Archimedes\' principle?',
                choices: ['Buoyancy', 'Leverage', 'Inertia', 'Density'],
                correct: 'Buoyancy'
            },
            {
                hasContent: false,
                quest: 'What is the name for H2O in solid form?',
                choices: ['Steam', 'Water', 'Ice', 'Vapor'],
                correct: 'Ice'
            },
            {
                hasContent: false,
                quest: 'What is the opposite of matter?',
                choices: ['Antimatter', 'Dark Matter', 'Energy', 'Vacuum'],
                correct: 'Antimatter'
            },
            {
                hasContent: false,
                quest: 'What is the unit of electrical resistance?',
                choices: ['Ohm', 'Volt', 'Ampere', 'Tesla'],
                correct: 'Ohm'
            },
            {
                hasContent: false,
                quest: 'What is the phenomenon of light splitting into colors?',
                choices: ['Refraction', 'Reflection', 'Dispersion', 'Diffraction'],
                correct: 'Dispersion'
            },
            {
                hasContent: false,
                quest: 'What is the term for the amount of matter in an object?',
                choices: ['Weight', 'Mass', 'Density', 'Volume'],
                correct: 'Mass'
            },
            {
                hasContent: false,
                quest: 'What is the force that holds nuclei together?',
                choices: ['Electromagnetic', 'Gravitational', 'Strong Nuclear', 'Weak Nuclear'],
                correct: 'Strong Nuclear'
            },
            {
                hasContent: false,
                quest: 'What is the term for the change in frequency due to motion?',
                choices: ['Doppler Effect', 'Sonic Boom', 'Redshift', 'Blueshift'],
                correct: 'Doppler Effect'
            },
            {
                hasContent: false,
                quest: 'What is the main source of Earth\'s magnetic field?',
                choices: ['Sun', 'Moon', 'Core', 'Atmosphere'],
                correct: 'Core'
            },
            {
                hasContent: true,
                quest: 'What is the name for the smallest particle of an element?',
                content: 'Building blocks of matter',
                contentType: 'text',
                choices: ['Atom', 'Molecule', 'Quark', 'Electron'],
                correct: 'Atom'
            },
            {
                hasContent: true,
                quest: 'What is the term for energy in motion?',
                content: 'Type of energy',
                contentType: 'text',
                choices: ['Potential', 'Kinetic', 'Thermal', 'Nuclear'],
                correct: 'Kinetic'
            },
            {
                hasContent: true,
                quest: 'What is the name for the point of zero motion in waves?',
                content: 'Wave mechanics',
                contentType: 'text',
                choices: ['Crest', 'Trough', 'Node', 'Antinode'],
                correct: 'Node'
            }
        ],

        mixed: [
            {
                hasContent: false,
                quest: 'What is the name of the galaxy that contains our Solar System?',
                choices: ['Andromeda', 'Milky Way', 'Whirlpool', 'Sombrero'],
                correct: 'Milky Way'
            },
            {
                hasContent: false,
                quest: 'In "The Lord of the Rings," who is Frodo Baggins\'s main companion?',
                choices: ['Gandalf', 'Aragorn', 'Samwise Gamgee', 'Legolas'],
                correct: 'Samwise Gamgee'
            },
            {
                hasContent: false,
                quest: 'What programming language is known for its simplicity and readability?',
                choices: ['C++', 'Python', 'Java', 'JavaScript'],
                correct: 'Python'
            },
            {
                hasContent: false,
                quest: 'What is the main component of the Sun?',
                choices: ['Liquid Lava', 'Molten Iron', 'Hydrogen and Helium', 'Rock'],
                correct: 'Hydrogen and Helium'
            },
            {
                hasContent: false,
                quest: 'Who is the author of "A Brief History of Time"?',
                choices: ['Stephen Hawking', 'Carl Sagan', 'Neil deGrasse Tyson', 'Brian Greene'],
                correct: 'Stephen Hawking'
            },
            {
                hasContent: false,
                quest: 'What is the world\'s largest active volcano?',
                choices: ['Mount Etna', 'Mauna Loa', 'Mount Vesuvius', 'Yellowstone Caldera'],
                correct: 'Mauna Loa'
            },
            {
                hasContent: false,
                quest: 'In computer science, what does "GUI" stand for?',
                choices: ['Graphical User Interface', 'General Utility Input', 'Generated User Interaction', 'Global Unifying Interface'],
                correct: 'Graphical User Interface'
            },
            {
                hasContent: false,
                quest: 'Which element on the periodic table has the atomic number 1?',
                choices: ['Oxygen', 'Helium', 'Hydrogen', 'Nitrogen'],
                correct: 'Hydrogen'
            },
            {
                hasContent: false,
                quest: 'In "Star Wars," who is Luke Skywalker\'s father?',
                choices: ['Han Solo', 'Obi-Wan Kenobi', 'Darth Vader', 'Yoda'],
                correct: 'Darth Vader'
            },
            {
                hasContent: false,
                quest: 'What is the smallest planet in our solar system?',
                choices: ['Mercury', 'Venus', 'Mars', 'Pluto'],
                correct: 'Mercury'
            },
            {
                hasContent: false,
                quest: 'What is the term for a word that is spelled the same forward and backward?',
                choices: ['Antonym', 'Synonym', 'Anagram', 'Palindrome'],
                correct: 'Palindrome'
            },
            {
                hasContent: false,
                quest: 'Which physicist developed the theory of general relativity?',
                choices: ['Isaac Newton', 'Niels Bohr', 'Albert Einstein', 'Richard Feynman'],
                correct: 'Albert Einstein'
            },
            {
                hasContent: false,
                quest: 'What is the capital of Japan?',
                choices: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
                correct: 'Tokyo'
            },
            {
                hasContent: false,
                quest: 'In "Harry Potter," what is the name of Harry\'s pet owl?',
                choices: ['Hedwig', 'Errol', 'Pigwidgeon', 'Crookshanks'],
                correct: 'Hedwig'
            },
            {
                hasContent: false,
                quest: 'What is the most abundant element in the universe?',
                choices: ['Oxygen', 'Carbon', 'Hydrogen', 'Helium'],
                correct: 'Hydrogen'
            },
            {
                hasContent: true,
                quest: 'What is the primary language used to write Android Apps?',
                content: 'This language is also one of the most popular programming languages globally.',
                choices: ['Python', 'Java', 'Swift', 'Kotlin'],
                correct: 'Java'
            },
            {
                hasContent: true,
                quest: 'Who wrote the science fiction novel "Dune"?',
                content: 'This novel, published in 1965, is one of the world’s best-selling science fiction novels.',
                choices: ['Frank Herbert', 'Isaac Asimov', 'Arthur C. Clarke', 'Philip K. Dick'],
                correct: 'Frank Herbert'
            },
            {
                hasContent: true,
                quest: 'Which planet in our solar system is known for having the most prominent ring system?',
                content: 'These rings are made primarily of ice particles, with a smaller amount of rocky debris and dust.',
                choices: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
                correct: 'Saturn'
            }
        ]
    }

    return quiz[topic.toLowerCase()].sort(() => (Math.random() > .5) ? 1 : -1).slice(0, count)
}

const init = () => {
    console.clear()
    console.log(`\x1b[33mApp running on 🔥\n\n\x1b[36m  http://localhost:${PORT}  \x1b[0m\n`); wss.on('error', console.error)

    // For generated games
    Object.keys(games).forEach((id) => rooms[id] = {})
}



// Websocket

wss.on('connection', (ws) => {
    const userID = genRandom()

    ws.on('message', (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'INIT_PLYR') {
            const user = {
                id: userID,
                isGuest: true,
                isInLobby: true,
                gameID: '',
                balance: 100,
                color: genColor(),
                name: `Guest #${Math.round(Math.random() * 10000 - 1).toString().padEnd(4, '0')}`,
                os: req.os
            }

            Object.assign(ws, user)
            lobby[userID] = ws

            ws.send(JSON.stringify({ command: 'INIT_PLYR', user }))
            ws.send(JSON.stringify({ command: 'UPDT_GAMES', games: getArray(games) }))
            console.log(`[${lobby[userID].name}]\x1b[1;32m Joined\x1b[0m 🥳`)
        } else if (req.command === 'JOIN_GAME') {
            const liveGameID = lobby[userID].gameID

            if (liveGameID) {
                if (games[liveGameID]) {
                    if (games[liveGameID].players.joined === 1) {
                        delete rooms[liveGameID]
                        delete games[liveGameID]
                    } else {
                        games[liveGameID].players.list = games[liveGameID].players.list.filter(p => p.name !== req.name)
                        games[liveGameID].players.joined--
                        delete rooms[liveGameID][userID]

                        sendRoom(liveGameID, { command: 'UPDT_GAME', game: games[liveGameID] })
                    }
                } else {
                    if (liveGames[liveGameID].players.joined === 1) {
                        delete rooms[liveGameID]
                        delete liveGames[liveGameID]
                    } else {
                        liveGames[liveGameID].players.list = liveGames[liveGameID].players.list.filter(p => p.name !== req.name)
                        liveGames[liveGameID].players.joined--
                        delete rooms[liveGameID][userID]

                        sendRoom(liveGameID, { command: 'UPDT_GAME', game: liveGames[liveGameID] })
                    }
                }

                lobby[userID].gameID = ''
            }

            lobby[userID].gameID = req.id
            rooms[req.id][userID] = ws
            games[req.id].players.list.push({ id: userID, name: req.name, color: req.color, os: lobby[userID].os, isFinished: false })
            games[req.id].players.joined++
            games[req.id].answers[userID] = Array(games[req.id].duration).fill({ answer: '', isTrue: null })

            ws.send(JSON.stringify({ command: 'JOIN_GAME', game: games[req.id] }))
            sendRoom(req.id, { command: 'UPDT_GAME', game: games[req.id] })

            if (games[req.id].players.joined === games[req.id].players.all) {
                liveGames[req.id] = games[req.id]
                liveGames[req.id].quiz = getQuiz(liveGames[req.id].topic.name, liveGames[req.id].duration)
                delete games[req.id]
                sendRoom(req.id, { command: 'START_GAME', quiz: liveGames[req.id].quiz })
            }

            sendLobby({ command: 'UPDT_GAMES', games: getArray(games) })
        } else if (req.command === 'LEAVE_GAME') {
            if (games[req.id].players.joined === 1) {
                delete rooms[req.id]
                delete games[req.id]
            } else {
                games[req.id].players.list = games[req.id].players.list.filter(p => p.name !== req.name)
                games[req.id].players.joined--
                delete rooms[req.id][userID]
            }

            lobby[userID].gameID = ''

            ws.send(JSON.stringify({ command: 'LEAVE_GAME', game: games[req.id] }))
            sendRoom(req.id, { command: 'UPDT_GAME', game: games[req.id] })
            sendLobby({ command: 'UPDT_GAMES', games: getArray(games) })
        } else if (req.command === 'CREATE_GAME') {
            const gameID = genRandom(8, 10)

            games[gameID] = {
                id: gameID,
                topic: req.game.topic,
                duration: req.game.duration,
                token: req.game.token,
                players: { all: req.game.players.all, joined: 1, list: [{ id: userID, name: req.user.name, color: req.user.color, os: lobby[userID].os, isFinished: false }] },
                answers: { [userID]: Array(req.game.duration).fill({ answer: '', isTrue: null }) }
            }

            lobby[userID].gameID = gameID
            rooms[gameID] = {}
            rooms[gameID][userID] = ws
            ws.send(JSON.stringify({ command: 'JOIN_GAME', game: games[gameID] }))
            sendRoom(gameID, { command: 'UPDT_GAME', game: games[gameID] })
            sendLobby({ command: 'UPDT_GAMES', games: getArray(games) })
        } else if (req.command === 'SEND_ANSR') {
            if (req.answer) {
                liveGames[req.id].answers[userID][req.index] = { answer: req.answer, isTrue: req.answer === liveGames[req.id].quiz[req.index].correct }
                sendRoom(req.id, { command: 'UPDT_ANSR', answers: liveGames[req.id].answers })

                if (liveGames[req.id].answers[userID].findIndex(a => a.answer === '') === -1) {
                    liveGames[req.id].players.list[liveGames[req.id].players.list.findIndex(p => p.id === userID)].isFinished = true
                    sendRoom(req.id, { command: 'UPDT_PLYRS', players: liveGames[req.id].players })
                }
            } else {
                liveGames[req.id].players.list[liveGames[req.id].players.list.findIndex(p => p.id === userID)].isFinished = true
                sendRoom(req.id, { command: 'UPDT_PLYRS', players: liveGames[req.id].players })
            }

            if (liveGames[req.id].players.list.findIndex(p => p.isFinished === false) === -1) {
                let stats = []

                liveGames[req.id].players.list.forEach((player) => {
                    lobby[player.id].gameID = ''

                    stats.push({
                        id: player.id,
                        name: player.name,
                        color: player.color,
                        correct: liveGames[req.id].answers[player.id].filter(a => a.isTrue).length,
                        wrong: liveGames[req.id].answers[player.id].filter(a => a.isTrue === false).length,
                    })
                })

                stats = stats.sort((a, b) => a.wrong - b.wrong).sort((a, b) => b.correct - a.correct)

                sendRoom(req.id, { command: 'FNSH_GAME', winner: stats[0] })

                delete rooms[req.id]
                delete liveGames[req.id]
            }
        }
    })

    ws.on('close', () => {
        console.log(`[${lobby[userID]?.name}]\x1b[1;31m Disconnected\x1b[0m 💀`)

        const liveGameID = lobby[userID].gameID

        if (liveGameID) {
            if (games[liveGameID]) {
                if (games[liveGameID].players.joined === 1) {
                    delete rooms[liveGameID]
                    delete games[liveGameID]
                } else {
                    games[liveGameID].players.list = games[liveGameID].players.list.filter(p => p.name !== lobby[userID].name)
                    games[liveGameID].players.joined--
                    delete rooms[liveGameID][userID]

                    sendRoom(liveGameID, { command: 'UPDT_GAME', game: games[liveGameID] })
                }

                sendLobby({ command: 'UPDT_GAMES', games })
            } else {
                if (liveGames[liveGameID].players.joined === 1) {
                    delete rooms[liveGameID]
                    delete liveGames[liveGameID]
                } else {
                    liveGames[liveGameID].players.list = liveGames[liveGameID].players.list.filter(p => p.name !== lobby[userID].name)
                    liveGames[liveGameID].players.joined--
                    delete rooms[liveGameID][userID]

                    sendRoom(liveGameID, { command: 'UPDT_GAME', game: liveGames[liveGameID] })
                }
            }

            lobby[userID].gameID = ''
        }

        delete lobby[userID]
    })

    ws.on('error', console.error)

})



// Routes

app.get('/api', (req, res) => res.json({ message: 'From api with love' }))

app.use('/', express.static(path.join(`${__dirname}/client/dist`)))
app.get('*', (req, res) => res.sendFile(path.join(`${__dirname}/client/dist`)))



// Server

server.listen(PORT, '0.0.0.0', () => init())