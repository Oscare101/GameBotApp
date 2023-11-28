import { Tournament } from './interfaces'

const tournamentsDefault: Tournament[] = [
  {
    season: 1,
    name: 'Winter Stage',
    prizes: [80000, 40000, 15000, 15000],
    winner: '',
    points: [100, 50, 25, 25, 10, 10, 10, 10],
    cup: 1,
    grid: [],
    description:
      'An annual winter tournament that opens the gaming season. It is one of the four seasonal tournaments.',
  },
  {
    season: 1,
    name: 'Spring Stage',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    points: [100, 50, 25, 25, 10, 10, 10, 10],
    description:
      'The second seasonal tournament, which is part of the four in the series.',
    cup: 2,
    grid: [],
  },
  {
    season: 1,
    name: 'World Qualifications',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    points: [150, 75, 40, 40, 15, 15, 15, 15],
    cup: 3,
    grid: [],
    description:
      'Qualifying tournament for the World Cup. The winner will get a place in the playoffs for the World Championship',
  },
  {
    season: 1,
    name: 'Summer Stage',
    prizes: [80000, 40000, 15000, 15000],
    winner: '',
    points: [100, 50, 25, 25, 10, 10, 10, 10],
    description:
      'The third seasonal tournament, which is part of the four in the series.',
    cup: 4,
    grid: [],
  },

  {
    season: 1,
    name: 'Autumn Stage',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    points: [100, 50, 25, 25, 10, 10, 10, 10],
    description:
      'The last tournament of the season, which is part of the four in the series.',
    cup: 5,
    grid: [],
  },

  {
    season: 1,
    name: 'World Championship',
    prizes: [250000, 110000, 40000, 40000, 15000, 15000, 15000, 15000],
    winner: '',
    points: [150, 75, 40, 40, 15, 15, 15, 15],
    cup: 6,
    grid: [],
    description:
      'One of the most important tournaments of the season, the world champion will be decided according to the version of the World Championship',
  },
  {
    season: 1,
    name: 'Major',
    prizes: [500000, 200000, 100000, 100000, 25000, 25000, 25000, 25000],
    winner: '',
    points: [200, 100, 50, 50, 20, 20, 20, 20],
    cup: 7,
    grid: [],
    description:
      'The last tournament of the season, the most expensive and the most important for each team. Majors are always the most difficult to win, but also the biggest reward',
  },
]

export default tournamentsDefault
