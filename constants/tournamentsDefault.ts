import { Tournament } from './interfaces'

const tournamentsDefault: Tournament[] = [
  {
    season: 1,
    name: 'Winter Stage',
    prizes: [80000, 40000, 15000, 15000],
    winner: {
      team: {
        name: 'NOVA',
        players: [
          {
            experience: 0,
            motivation: 0,
            nickName: 'Oscare',
            rating: 1.78,
            role: 'Capitan',
            tactic: 0,
            team: 'NOVA',
          },
          {
            experience: 0,
            motivation: 0,
            nickName: 'Modest',
            rating: 1.45,
            role: 'Fragger',
            tactic: 0,
            team: 'NOVA',
          },
          {
            experience: 0,
            motivation: 0,
            nickName: 'Niko',
            rating: 1.42,
            role: 'Fragger',
            tactic: 0,
            team: 'NOVA',
          },
          {
            experience: 0,
            motivation: 0,
            nickName: 'bait',
            rating: 1.4,
            role: 'Support',
            tactic: 0,
            team: 'NOVA',
          },
          {
            experience: 0,
            motivation: 0,
            nickName: 'Refresh',
            rating: 1.32,
            role: 'Support',
            tactic: 0,
            team: 'NOVA',
          },
        ],
      },
    },

    cup: 1,
    description:
      'An annual winter tournament that opens the gaming season. It is one of the four seasonal tournaments.',
  },
  {
    season: 1,
    name: 'Spring Stage',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    description:
      'The second seasonal tournament, which is part of the four in the series.',
    cup: 2,
  },
  {
    season: 1,
    name: 'World Qualifications',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    cup: 3,
    description:
      'Qualifying tournament for the World Cup. The winner will get a place in the playoffs for the World Championship',
  },
  {
    season: 1,
    name: 'Summer Stage',
    prizes: [80000, 40000, 15000, 15000],
    winner: '',
    description:
      'The third seasonal tournament, which is part of the four in the series.',
    cup: 4,
  },

  {
    season: 1,
    name: 'Autumn Stage',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    description:
      'The last tournament of the season, which is part of the four in the series.',
    cup: 5,
  },

  {
    season: 1,
    name: 'World Championship',
    prizes: [250000, 110000, 40000, 40000, 15000, 15000, 15000, 15000],
    winner: '',
    cup: 6,
    description:
      'One of the most important tournaments of the season, the world champion will be decided according to the version of the World Championship',
  },
  {
    season: 1,
    name: 'Major',
    prizes: [500000, 200000, 100000, 100000, 25000, 25000, 25000, 25000],
    winner: '',
    cup: 7,
    description:
      'The last tournament of the season, the most expensive and the most important for each team. Majors are always the most difficult to win, but also the biggest reward',
  },
]

export default tournamentsDefault
