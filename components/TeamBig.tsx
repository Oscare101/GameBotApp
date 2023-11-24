import {
  IslandTeamBig,
  JupiterTeamBig,
  NOVATeamBig,
  OGTeamBig,
  QuazarsTeamBig,
  SolidTeamBig,
  TopGunTeamBig,
  VangardTeamBig,
} from '../constants/icons'

export default function TeamsBig(props: any) {
  const teams: any = {
    NOVA: <NOVATeamBig />,
    Quazars: <QuazarsTeamBig />,
    OG: <OGTeamBig />,
    Vangard: <VangardTeamBig />,
    Island: <IslandTeamBig />,
    Solid: <SolidTeamBig />,
    TopGun: <TopGunTeamBig />,
    Jupiter: <JupiterTeamBig />,
  }
  return teams[props.team]
}
