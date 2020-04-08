type DataType = {
  日付: Date
  患者数: number
  軽症中等症: number
  重症: number
}

type GraphDataType = {
  label: Date
  transitions: number[]
  cumulatives: number[]
}

export default (data: DataType[]) => {
  const graphData: GraphDataType[] = []
  const today = new Date()
  let patSum = 0
  let mildSum = 0
  let seriousSum = 0
  let cangetdetaildata = false
  data
    .filter(d => new Date(d['日付']) < today)
    .forEach(d => {
      const date = new Date(d['日付'])
      const subTotal = d['患者数']
      const mild = d['軽症中等症']
      const serious = d['重症']
      if (!isNaN(subTotal)) {
        if (!cangetdetaildata && mild !== 0 && serious !== 0) {
          cangetdetaildata = true
          patSum += subTotal
          mildSum += mild
          seriousSum += serious
          graphData.push({
            label: date,
            transitions: [0, mild, serious],
            cumulatives: [0, mildSum, seriousSum]
          })
        } else if (!cangetdetaildata) {
          patSum += subTotal
          mildSum += mild
          seriousSum += serious
          graphData.push({
            label: date,
            transitions: [subTotal, mild, serious],
            cumulatives: [patSum, mildSum, seriousSum]
          })
        } else {
          patSum += subTotal
          mildSum += mild
          seriousSum += serious
          graphData.push({
            label: date,
            transitions: [0, mild, serious],
            cumulatives: [0, mildSum, seriousSum]
          })
        }
      }
    })
  return graphData
}
