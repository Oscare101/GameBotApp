import { Player } from '../constants/interfaces'
import rules from '../constants/rules'

export function GetTeamRating(team: any) {
  let teamMotivationValue = 1 + (team.motivation || 0 * 20) / 100
  let teamTacticValue = 1 + (team.tactic || 0 * 20) / 100
  let teamEconimicsValue = 1 + (team.economics || 0 * 20) / 100
  let teamRating =
    team.players.reduce((total: any, player: any) => total + player.rating, 0) /
    team.players.length
  return teamRating * teamMotivationValue * teamTacticValue * teamEconimicsValue
}

export function RandomTeamToAttak(team1: any, team2: any) {
  let t1 = GetTeamRating(team1)
  let t2 = GetTeamRating(team2)

  let random = Math.random() * (t1 + t2)
  if (random <= t1) {
    return [team1, team2]
  } else {
    return [team2, team1]
  }
}

export function GetLastActionsInRound(log: any) {
  let lastIndex: number = 0
  if (log.find((i: any) => i.status === 'win')) {
    log.forEach((i: any, index: number) => {
      if (i.status === 'win') {
        lastIndex = index
      }
    })
    return lastIndex === log.length - 1 ? [] : log.slice(lastIndex + 1)
  }
  return log
}

export function GetAlivePlayers(team: any, log: any) {
  const lastActions = GetLastActionsInRound(log)

  let arr: any = []
  team.players.forEach((player: any) => {
    arr.push(player)
  })

  return lastActions.length > 0
    ? arr.filter(
        (player: any) =>
          !lastActions.find((i: any) => i.death.nickName === player.nickName)
      )
    : arr
}

export function RandomPLayerToExecute(teams: any, log: any) {
  let attacker: any

  let playersKillArr: any = []
  let minPlayerRating: number = 0

  GetAlivePlayers(teams[0], log).forEach((player: any) => {
    if (minPlayerRating > player.rating || minPlayerRating === 0) {
      minPlayerRating = player.rating * 0.7
    }
  })

  GetAlivePlayers(teams[0], log).forEach((player: any) => {
    for (
      let i = 0;
      i < Math.ceil(player.rating * 100 - minPlayerRating * 100);
      i++
    ) {
      playersKillArr.push(player)
    }
  })
  attacker = playersKillArr[Math.floor(Math.random() * playersKillArr.length)]

  let dead: any

  let playersArr: any = []
  let maxPlayerRating: number = 0

  GetAlivePlayers(teams[1], log).forEach((player: any) => {
    if (maxPlayerRating < player.rating || maxPlayerRating === 0) {
      maxPlayerRating = player.rating * 1.5
    }
  })
  GetAlivePlayers(teams[1], log).forEach((player: any) => {
    for (
      let i = 0;
      i < Math.ceil(maxPlayerRating * 100 - player.rating * 100);
      i++
    ) {
      playersArr.push(player)
    }
  })
  dead = playersArr[Math.floor(Math.random() * playersArr.length)]

  return [attacker, dead]
}

export function GetDeadPlayerInRound(player: any, log: any) {
  let roundLogsArr: any = GetLastActionsInRound(log)
  return roundLogsArr.find((i: any) => i.death.nickName === player.nickName)
}

export function GetToolRandom() {
  let tools = ['pistol', 'bomb', 'fire', 'knife-military']
  let probability = [20, 5, 4, 1]
  let toolsProbability: any = []
  tools.forEach((tool: any, index: number) => {
    for (let i = 0; i < probability[index]; i++) {
      toolsProbability.push(tool)
    }
  })
  return toolsProbability[Math.floor(Math.random() * toolsProbability.length)]
}

export function GetScore(team: any, log: any) {
  let scores = [...log].filter((i: any) => i.status === 'win')
  return scores.filter((i: any) => i.win === team.name).length
}

export function GetMapsScore(team: any, mapPoints: any) {
  return mapPoints.filter((mapWinner: any) => mapWinner === team.name).length
}

export function GetEconomics(economics: any, win: boolean) {
  const economicsRanges = [0.2, 0.4, 0.6, 0.8, 1]
  const economicsWin = [0.4, 0.3, 0.25, 0.2, 0.15]
  const economicsLoss = [0.1, 0.15, 0.2, 0.3, 0.4]
  let teamEconimicsIndex: number = 0
  for (let index = 0; index < economicsRanges.length; index++) {
    if (economics <= economicsRanges[index]) {
      teamEconimicsIndex = index
      break
    }
  }
  let eco = win
    ? economics + economicsWin[teamEconimicsIndex] > 1
      ? 1
      : economics + economicsWin[teamEconimicsIndex]
    : economics - economicsLoss[teamEconimicsIndex] < 0
    ? 0
    : economics - economicsLoss[teamEconimicsIndex]

  return +eco.toFixed(2)
}

export function InstantGame(team1: any, team2: any) {
  team1.economics = 0.5
  team2.economics = 0.5
  let winnersArr: any = []

  let logs: any = []
  let rounds: number = rules.MRNumber
  while (true) {
    if (
      GetScore(team1, logs) + GetScore(team2, logs) === rounds * 2 ||
      GetScore(team1, logs) === rounds + 1 ||
      GetScore(team2, logs) === rounds + 1
    ) {
      if (GetScore(team1, logs) !== GetScore(team2, logs)) {
        if (GetScore(team1, logs) === rounds + 1) {
          winnersArr.push(team1.name)
        } else {
          winnersArr.push(team2.name)
        }
        logs = []
      } else {
        rounds += rules.additionalRounds * 2
      }

      if (
        GetMapsScore(team1, winnersArr) === Math.floor(rules.bestOf / 2 + 1) ||
        GetMapsScore(team2, winnersArr) === Math.floor(rules.bestOf / 2 + 1)
      ) {
        break
      }
    } else {
      if (
        GetAlivePlayers(team1, logs).length > 0 &&
        GetAlivePlayers(team2, logs).length > 0
      ) {
        const teamAttackQueue = RandomTeamToAttak(team1, team2)
        const playerExecute = RandomPLayerToExecute(teamAttackQueue, logs)

        logs.push({
          status: 'kill',
          kill: {
            nickName: playerExecute[0].nickName,
            team: teamAttackQueue[0].name,
          },
          death: {
            nickName: playerExecute[1].nickName,
            team: teamAttackQueue[1].name,
          },
          tool: GetToolRandom(),
          id: new Date().getTime().toString(),
        })
      } else {
        if (GetAlivePlayers(team1, logs).length === 0) {
          logs.push({
            status: 'win',
            win: team2.name,
            id: new Date().getTime().toString(),
          })
          team1.economics = GetEconomics(team1.economics, false)
          team2.economics = GetEconomics(team1.economics, true)
        } else {
          logs.push({
            status: 'win',
            win: team1.name,
            id: new Date().getTime().toString(),
          })
          team1.economics = GetEconomics(team1.economics, true)
          team2.economics = GetEconomics(team1.economics, false)
        }
      }
    }
  }
  return winnersArr
}

export function GetSortedPlayersByRating(players: Player[]) {
  let arr: any = []
  players.forEach((i: any) => {
    arr.push(i)
  })
  arr.sort((a: any, b: any) => b.rating - a.rating)
  return arr
}

export function GetSortedPlayersByTeams(players: Player[]) {
  let arr: any = []
  players.forEach((i: any) => {
    arr.push(i)
  })

  const groupedByTeam = arr.reduce((acc: any, player: any) => {
    const { team, rating } = player
    if (!acc[team]) {
      acc[team] = { players: [], totalRating: 0, count: 0 }
    }

    acc[team].players.push(player)
    acc[team].totalRating += rating
    acc[team].count += 1

    return acc
  }, {})

  const sortedTeams = Object.entries(groupedByTeam)
    .sort(([depA, dataA]: any, [depB, dataB]: any) => {
      const avgRatingA = dataA.totalRating / dataA.count
      const avgRatingB = dataB.totalRating / dataB.count
      return avgRatingA - avgRatingB
    })
    .map(([team, data]: any) => ({
      team,
      players: data.players.sort((a: any, b: any) => a.rating - b.rating),
    }))

  let sortedArr: any = []

  sortedTeams.reverse().forEach((i: any) => {
    i.players.reverse().forEach((p: any) => {
      sortedArr.push(p)
    })
  })

  return sortedArr
}

export function GetSortedPlayersByNickNames(players: Player[]) {
  let arr: any = []
  players.forEach((i: any) => {
    arr.push(i)
  })
  arr.sort((a: any, b: any) => a.nickName.localeCompare(b.nickName))
  return arr
}

export function GetSortedPlayersByRoles(players: Player[]) {
  let arr: any = []
  players.forEach((i: any) => {
    arr.push(i)
  })
  arr.sort((a: any, b: any) => a.role.localeCompare(b.role))
  return arr
}

export function GetTeams(players: Player[]) {
  let arr: any = []
  players.forEach((player: any) => {
    if (!arr.includes(player.team)) {
      arr.push(player.team)
    }
  })
  return arr
}

export function GetTeamsInPlaces(tournament: any, players: Player[]) {
  let teamsArr: any = []
  if (tournament.grid) {
    for (let i = tournament.grid.length - 1; i >= 0; i--) {
      tournament.grid[i].forEach((pair: any) => {
        if (!teamsArr.includes(pair.winner)) {
          teamsArr.push(pair.winner)
        }
      })
    }
    GetTeams(players).forEach((team: any) => {
      if (!teamsArr.includes(team)) {
        teamsArr.push(team)
      }
    })
  }

  return teamsArr
}

export function GetGrandSlamWinners(tournaments: any, players: Player[]) {
  let grandSlamSeasons: any[] = []

  tournaments
    .filter((t: any) => t.winner)
    .forEach((t: any) => {
      if (grandSlamSeasons.find((g: any) => g.season === t.season)) {
        grandSlamSeasons = grandSlamSeasons.map((g: any, index: number) => {
          if (g.season === t.season) {
            return {
              ...g,
              winners: [...grandSlamSeasons[index].winners, t.winner.team.name],
            }
          } else {
            return g
          }
        })
      } else {
        grandSlamSeasons.push({
          season: t.season,
          winners: [t.winner.team.name],
        })
      }
    })
  const grandSlamWinners: any = []

  grandSlamSeasons.forEach((g: any) => {
    GetTeams(players).forEach((team: string) => {
      if (
        g.winners.filter((w: string) => w === team).length >= rules.grandSlamBar
      ) {
        grandSlamWinners.push({ season: g.season, grandSlamWinner: team })
      }
    })
  })
  return grandSlamWinners
}

export function GetTeamPoints(
  tournaments: any,
  players: Player[],
  team: string
) {
  let amountWon: number = 0
  if (tournaments) {
    tournaments.forEach((t: any) => {
      if (t.winner) {
        const teamIndexInPlace = GetTeamsInPlaces(t, players).findIndex(
          (i: any) => i === team
        )
        amountWon += t.points[teamIndexInPlace] || 0
      }
    })
  }

  return amountWon
}

export function GetTeamPointsLast7Tournaments(
  tournaments: any,
  players: Player[],
  team: string
) {
  let amountWon: number = 0
  if (tournaments) {
    const last7Tournaments =
      tournaments.filter((t: any) => t.winner).length > 7
        ? tournaments
            .filter((t: any) => t.winner)
            .slice(tournaments.filter((t: any) => t.winner).length - 7)
        : tournaments.filter((t: any) => t.winner)

    last7Tournaments.forEach((t: any) => {
      if (t.winner) {
        const teamIndexInPlace = GetTeamsInPlaces(t, players).findIndex(
          (i: any) => i === team
        )
        amountWon += t.points[teamIndexInPlace] || 0
      }
    })
  }

  return amountWon
}

export function GetTeamWinRate(tournaments: any, team: string) {
  let gamesWon: number = 0
  let gamesTookPart: number = 0
  tournaments.forEach((t: any) => {
    t.grid.forEach((g: any) => {
      g.forEach((pair: any) => {
        if ((pair.team1 === team || pair.team2 === team) && pair.winner) {
          gamesTookPart++
          if (pair.winner === team) {
            gamesWon++
          }
        }
      })
    })
  })

  return +((gamesWon / gamesTookPart) * 100).toFixed()
}

export function GetTeamPrizes(
  tournaments: any,
  players: Player[],
  team: string
) {
  const grandSlams = GetGrandSlamWinners(tournaments, players).filter(
    (g: any) => g.grandSlamWinner === team
  ).length

  let amountWon: number = 0
  tournaments.forEach((t: any) => {
    if (t.winner) {
      const teamIndexInPlace = GetTeamsInPlaces(t, players).findIndex(
        (i: any) => i === team
      )
      amountWon += t.prizes[teamIndexInPlace] || 0
    }
  })
  return amountWon + grandSlams * rules.grandSlamPrize
}

export function GetTournamentsBySeason(tournaments: any) {
  const tArr: any = []
  tournaments.map((t: any) => {
    if (!tArr.length) {
      tArr.push(t)
    } else {
      if (t.season !== tArr[0].season) {
        tArr.unshift(t)
      } else {
        tArr.splice(t.cup - 1, 0, t)
      }
    }
  })
  return tArr
}

export function RatingChange(rating: number) {
  const change: number = Math.random() > 0.5 ? 0.01 : -0.01
  const result: number = +(rating + change).toFixed(2)
  return result
}

export function MotivationChange(
  player: Player,
  team1: any,
  team2: any,
  winnersArr: any
) {
  const weakTeam =
    GetTeamRating(team1) > GetTeamRating(team2) ? team2.name : team1.name
  const winner =
    GetMapsScore(team1, winnersArr) > GetMapsScore(team2, winnersArr)
      ? team1.name
      : team2.name
  const random: number = Math.random() > 0.5 ? 0.01 : -0.01

  if (weakTeam === winner && player.team === weakTeam) {
    if (player.motivation + 0.1 <= 1) {
      return player.motivation + 0.1
    } else {
      return player.motivation
    }
  } else {
    if (player.motivation + random >= 0 && player.motivation + random <= 1) {
      return player.motivation + random
    } else {
      return player.motivation
    }
  }
}

export function TacticChange(
  player: Player,
  team1: any,
  team2: any,
  winnersArr: any
) {
  const randomWinner: number = Math.random() > 0.33 ? 0.01 : -0.01
  const randomLoser: number = Math.random() > 0.66 ? 0.01 : -0.01

  const winner =
    GetMapsScore(team1, winnersArr) > GetMapsScore(team2, winnersArr)
      ? team1.name
      : team2.name

  if (player.team === winner) {
    if (player.tactic + randomWinner <= 1) {
      return player.tactic + randomWinner
    } else {
      return player.tactic
    }
  } else {
    if (player.tactic + randomWinner >= 0) {
      return player.tactic + randomLoser
    } else {
      return player.tactic
    }
  }
}

export function ExperienceChange(experience: number) {
  const random: boolean = Math.random() > 0.5
  const change: number = Math.random() > 0.5 ? 0.01 : -0.01

  if (random) {
    if (experience + change <= 1 && experience + change >= 0) {
      return experience + change
    } else {
      return experience
    }
  } else {
    return experience
  }
}

export function ShuffleTeams(teamsArr: any) {
  const shuffledArray = [...teamsArr]
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}

export function GetStageName(pairs: number) {
  const stage: any = ['Final', 'Semi-Final', 'Quarter-Final', 'Qualification']
  return stage[Math.log2(pairs)]
}
