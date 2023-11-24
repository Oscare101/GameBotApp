const names = [
  'Oscare',
  'Header',
  'Modest',
  'Olaph',
  'Niko',
  'bait',
  'Xantares',
  'Collector',
  'Nelo',
  'Refresh',
  'Rossander',
  'Rain',
  'Focus',
  'Salivan',
  'Fury',
  'Kscerato',
  'Torin',
  'Tenor',
  'Wong',
  'Cicada',
  'Stoic',
  'Syrson',
  'LoseIt',
  'Tabsen',
  'Cloudy',
  'Boros',
  'Kipito',
  'Leon',
  'Kosus',
  'Maden',
  'Mandarin',
  'Raven',
  'Faker',
  'Soul',
  'Faris',
  'Melon',
  'Forest',
  'LoseIt',
  'Somewhere',
  'Tabar',
]

const ratings = [
  1.75, 1.52, 1.44, 1.43, 1.43, 1.39, 1.36, 1.36, 1.34, 1.33, 1.3, 1.28, 1.27,
  1.26, 1.25, 1.25, 1.24, 1.24, 1.24, 1.23, 1.23, 1.22, 1.22, 1.2, 1.2, 1.2,
  1.19, 1.18, 1.18, 1.18, 1.17, 1.17, 1.26, 1.25, 1.25, 1.24, 1.24, 1.24, 1.23,
  1.23,
]

const teams = [
  'NOVA',
  'Quazars',
  'NOVA',
  'OG',
  'NOVA',
  'NOVA',
  'Quazars',
  'Vangard',
  'OG',
  'NOVA',
  'OG',
  'Quazars',
  'OG',
  'Island',
  'Vangard',
  'Vangard',
  'OG',
  'Vangard',
  'Island',
  'Solid',
  'Vangard',
  'Island',
  'Jupiter',
  'Quazars',
  'Quazars',
  'Island',
  'TopGun',
  'Jupiter',
  'TopGun',
  'TopGun',
  'Solid',
  'Jupiter',
  'TopGun',
  'TopGun',
  'Solid',
  'Island',
  'Jupiter',
  'Solid',
  'Solid',
  'Jupiter',
]

const roles = [
  'Capitan',
  'Fragger',
  'Fragger',
  'Capitan',
  'Fragger',
  'Support',
  'Capitan',
  'Fragger',
  'Fragger',
  'Support',
  'Fragger',
  'Support',
  'Fragger',
  'Capitan',
  'Fragger',
  'Capitan',
  'Fragger',
  'Support',
  'Fragger',
  'Support',
  'Support',
  'Fragger',
  'Fragger',
  'Fragger',
  'Lurker',
  'Fragger',
  'Support',
  'Fragger',
  'Support',
  'Capitan',
  'Support',
  'Fragger',
  'Fragger',
  'Fragger',
  'Capitan',
  'Support',
  'Capitan',
  'Fragger',
  'Fragger',
  'Support',
]

const prices = [
  4000000, 4000000, 2000000, 2000000, 1500000, 1500000, 1500000, 1000000,
  1000000, 1000000, 1000000, 1000000, 700000, 315000, 500000, 600000, 500000,
  600000, 300000, 350000, 500000, 300000, 300000, 400000, 500000, 350000,
  300000, 300000, 400000, 400000, 300000, 300000, 315000, 312500, 312500,
  310000, 310000, 310000, 307500, 307500,
]

let arr: any = []

function Make() {
  for (let i = 0; i < 40; i++) {
    arr.push(
      `{name:${names[i]},rating:${ratings[i]},team:${teams[i]},experience:0,role:${roles[i]}}`
    )
  }
}

arr.join(',')
console.log(arr)
