import {
  IslandTeam,
  JupiterTeam,
  NOVATeam,
  QuazarsTeam,
  SolidTeam,
  VangardTeam,
  EaglesTeam,
  KadaganTeam,
  YouthTeam,
  UniversityTeam,
  CanoeTeam,
  MoonTeam,
  DreamTeam,
  FiveTeam,
  SempraTeam,
  GuardiansTeam,
} from '../constants/icons'

export default function Teams(props: any) {
  const teams: any = {
    NOVA: <NOVATeam />,
    Quazars: <QuazarsTeam />,
    Eagles: <EaglesTeam />,
    Vangard: <VangardTeam />,
    Island: <IslandTeam />,
    Solid: <SolidTeam />,
    Kadagan: <KadaganTeam />,
    Jupiter: <JupiterTeam />,
    Youth: <YouthTeam />,
    Guardians: <GuardiansTeam />,
    University: <UniversityTeam />,
    Canoe: <CanoeTeam />,
    Dream: <DreamTeam />,
    Sempra: <SempraTeam />,
    Five: <FiveTeam />,
    Moon: <MoonTeam />,
  }
  return teams[props.team]
}
