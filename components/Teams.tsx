import {
  IslandTeam,
  JupiterTeam,
  NOVATeam,
  OGTeam,
  QuazarsTeam,
  SolidTeam,
  TopGunTeam,
  VangardTeam,
} from '../constants/icons'

export default function Teams(props: any) {
  const teams: any = {
    NOVA: <NOVATeam />,
    Quazars: <QuazarsTeam />,
    OG: <OGTeam />,
    Vangard: <VangardTeam />,
    Island: <IslandTeam />,
    Solid: <SolidTeam />,
    TopGun: <TopGunTeam />,
    Jupiter: <JupiterTeam />,
  }
  return teams[props.team]
}
