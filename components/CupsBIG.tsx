import {
  AutumnCupBig,
  MajorCupBig,
  SpringCupBig,
  SummerCupBig,
  TheGrandSlamCupBig,
  WinterCupBig,
  WorldCupChampionshipBig,
  WorldCupQualificationBig,
} from '../constants/icons'

export default function CupsBig(props: any) {
  const cup1 = <WinterCupBig />
  const cup2 = <SpringCupBig />
  const cup3 = <WorldCupQualificationBig />
  const cup4 = <SummerCupBig />
  const cup5 = <AutumnCupBig />
  const cup6 = <WorldCupChampionshipBig />
  const cup7 = <MajorCupBig />
  const cup8 = <TheGrandSlamCupBig />
  const cups: any = [cup1, cup2, cup3, cup4, cup5, cup6, cup7, cup8]
  return cups[props.cup - 1]
}
