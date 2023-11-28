export interface Player {
  nickName: string
  rating: number
  experience: number
  role: 'Free' | 'Capitan' | 'Fragger' | 'Support' | 'Lurker'
  team: string
  motivation: number
  tactic: number
}

export interface Tournament {
  season: number
  name: string
  prizes?: any[]
  winner?: Team | string
  cup: number
  description: string
  grid?: any
  points?: any[]
}

export interface Team {
  team: {
    name: string
    motivation?: number
    tactic?: number
    economics?: number
    experience?: number
    players: {
      nickName: string
      rating: number
      experience?: any
      motivation?: number
      team?: string
      role?: string
      tactic?: number
    }[]
  }
}

export interface Log {
  status: string
  kill?: { team: string; nickName: string }
  death?: { team: string; nickName: string }
  tool?: string
  win?: string
  id?: string
}

export interface GameInfo {
  team: string
  expences: number
}
