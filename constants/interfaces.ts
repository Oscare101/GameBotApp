export interface Player {
  name: string
  rating: number
  experience: number
  role: 'free' | 'capitan' | 'fragger' | 'support' | 'lurker'
  team: string
}

export interface Team {
  team: {
    name: string
    motivation?: number
    tactic?: number
    economics?: number
    players: {
      nickName: string
      rating: number
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
