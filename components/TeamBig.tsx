import {
  IslandTeamBig,
  JupiterTeamBig,
  NOVATeamBig,
  QuazarsTeamBig,
  SolidTeamBig,
  VangardTeamBig,
  EaglesTeamBig,
  KadaganTeamBig,
  YouthTeamBig,
  UniversityTeamBig,
  CanoeTeamBig,
  MoonTeamBig,
  DreamTeamBig,
  FiveTeamBig,
  SempraTeamBig,
  GuardiansTeamBig,
} from '../constants/icons'

export default function TeamBig(props: any) {
  const teams: any = {
    NOVA: <NOVATeamBig />,
    Quazars: <QuazarsTeamBig />,
    Eagles: <EaglesTeamBig />,
    Vangard: <VangardTeamBig />,
    Island: <IslandTeamBig />,
    Solid: <SolidTeamBig />,
    Kadagan: <KadaganTeamBig />,
    Jupiter: <JupiterTeamBig />,
    Youth: <YouthTeamBig />,
    Guardians: <GuardiansTeamBig />,
    University: <UniversityTeamBig />,
    Canoe: <CanoeTeamBig />,
    Dream: <DreamTeamBig />,
    Sempra: <SempraTeamBig />,
    Five: <FiveTeamBig />,
    Moon: <MoonTeamBig />,
  }
  return teams[props.team]
}
