import {
  AutumnCup,
  MajorCup,
  SpringCup,
  SummerCup,
  TheGrandSlamCup,
  WinterCup,
  WorldCupChampionship,
  WorldCupQualification,
} from '../constants/icons'

export default function Cups(props: any) {
  const cup1 = <WinterCup />
  const cup2 = <SpringCup />
  const cup3 = <WorldCupQualification />
  const cup4 = <SummerCup />
  const cup5 = <AutumnCup />
  const cup6 = <WorldCupChampionship />
  const cup7 = <MajorCup />
  const cup8 = <TheGrandSlamCup />
  const cups: any = [cup1, cup2, cup3, cup4, cup5, cup6, cup7, cup8]
  return cups[props.cup - 1]
}
