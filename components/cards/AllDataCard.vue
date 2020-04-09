<template>
  <v-col cols="12" md="6" class="DataCard">
    <all-data-chart
      :title="$t('全データカード')"
      :chart-data="allDataGraph"
      :date="convertToDateFromData(allData.last_update)"
      :source-from="$t('北海道 オープンデータポータル')"
      source-link="https://www.harp.lg.jp/opendata/dataset/1369.html"
      :loaded="allData.loaded"
      title-id="alldata"
      :unit="$t('人')"
    />
  </v-col>
</template>

<script>
import formatAllDataGraph from '@/utils/formatAllDataGraph.ts'
import AllDataChart from '@/components/AllDataChart'
import convertToDateFromData from '@/utils/convertToDateFromData'

export default {
  name: 'AllDataCard',
  components: {
    AllDataChart
  },
  data() {
    return {
      allData: {
        loaded: false,
        last_update: ''
      },
      allDataGraph: [],
      convertToDateFromData
    }
  },
  created() {
    this.getAllDataGraphFromAPI()
  },
  methods: {
    async getAllDataGraphFromAPI() {
      await this.$axios
        .$get('/covid19_data.json')
        .then(response => {
          this.allDataGraph = formatAllDataGraph(response.data)
          this.allData.last_update = response.last_update
          this.allData.loaded = true
        })
        .catch(_ => {
          this.$emit('failed', '帰国者・接触者電話相談センター相談件数データ ')
        })
    }
  }
}
</script>
