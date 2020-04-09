type DataType = {
  年: string
  月: string
  日: string
  日検査数: string
  日陽性数: string
  日患者数: string
  日軽症中等症数: string
  日重症数: string
  日死亡数: string
  日治療終了数: string
}

type GraphDataType = {
  label: Date
  transitions: number[]
  cumulatives: number[]
}

export default (data: DataType[]) => {
  const graphData: GraphDataType[] = []
  const today = new Date()
  /*
  let inspectionSum = 0
  let positiveSum = 0 */
  let patientSum = 0
  let mildSum = 0
  let seriousSum = 0
  let deadSum = 0
  let dischargeSum = 0
  let cangetdetaildata = false
  data
    .filter(d => new Date(d['年'] + '-' + d['月'] + '-' + d['日']) < today)
    .forEach(d => {
      const date = new Date(d['年'] + '-' + d['月'] + '-' + d['日'])
      //      let inspection = isNaN(Number(d['日検査数'])) ? 0 : Number(d['日検査数'])
      //      let positive = isNaN(Number(d['日陽性数'])) ? 0 : Number(d['日陽性数'])
      const patient = isNaN(Number(d['日患者数'])) ? 0 : Number(d['日患者数'])
      const mild = isNaN(Number(d['日軽症中等症数']))
        ? 0
        : Number(d['日軽症中等症数'])
      const serious = isNaN(Number(d['日重症数'])) ? 0 : Number(d['日重症数'])
      const dead = isNaN(Number(d['日死亡数'])) ? 0 : Number(d['日死亡数'])
      const discharge = isNaN(Number(d['日治療終了数']))
        ? 0
        : Number(d['日治療終了数'])
      //   positive -= patient + dead + discharge
      //      inspection -= positive + patient + dead + discharge
      //   inspectionSum += inspection
      //   positiveSum += positive
      patientSum += patient
      mildSum += mild
      seriousSum += serious
      deadSum += dead
      dischargeSum += discharge

      if (!cangetdetaildata && mild !== 0 && serious !== 0) {
        cangetdetaildata = true
        graphData.push({
          label: date,
          transitions: [0, mild, serious, dead, discharge],
          cumulatives: [0, mildSum, seriousSum, deadSum, dischargeSum]
        })
      } else if (!cangetdetaildata) {
        graphData.push({
          label: date,
          transitions: [patient, mild, serious, dead, discharge],
          cumulatives: [patientSum, mildSum, seriousSum, deadSum, dischargeSum]
        })
      } else {
        graphData.push({
          label: date,
          transitions: [0, mild, serious, dead, discharge],
          cumulatives: [0, mildSum, seriousSum, deadSum, dischargeSum]
        })
      }
    })
  return graphData
}
