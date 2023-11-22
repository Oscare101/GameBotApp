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

export function InstantGame(
  team1: any,
  team2: any,
  bestOf: number,
  MRNumber: number,
  additionalNumber: number
) {
  team1.economics = 0.5
  team2.economics = 0.5
  let winnersArr: any = []

  let logs: any = []
  let rounds: number = MRNumber
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
        rounds += additionalNumber * 2
      }

      if (
        GetMapsScore(team1, winnersArr) === Math.floor(bestOf / 2 + 1) ||
        GetMapsScore(team2, winnersArr) === Math.floor(bestOf / 2 + 1)
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
