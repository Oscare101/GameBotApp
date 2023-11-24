export interface Player {
  nickName: string
  rating: number
  experience: number
  role: 'Free' | 'Capitan' | 'Fragger' | 'Support' | 'Lurker'
  team: string
  motivation: number
  tactic: number
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
      team?: string
      role?: string
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
