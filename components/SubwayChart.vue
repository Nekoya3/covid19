<template>
  <data-view
    :title="title"
    :date="date"
    :loaded="loaded"
    :source-from="sourceFrom"
    :source-link="sourceLink"
    :title-id="titleId"
  >
    <v-overlay absolute :value="!loaded" justify-center align-center>
      <scale-loader color="#1268d8" />
    </v-overlay>
    <v-layout column :class="{ loading: !loaded }">
      <v-row no-gutters>
        <v-col cols="12" sm="4">
          <v-select
            v-model="lineselected"
            class="pa-2"
            item-value="value"
            item-text="label"
            :items="lines"
            label="路線名"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" sm="4">
          <v-select
            v-model="dateselected"
            class="pa-2"
            item-value="value"
            item-text="label"
            :items="dates"
            label="表示期間"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" sm="4">
          <v-select
            v-model="directionselected"
            class="pa-2"
            item-value="value"
            item-text="label"
            :items="directions"
            label="方向"
            outlined
            dense
          />
        </v-col>
      </v-row>
      <apexcharts type="heatmap" :options="options" :series="heatmapData" />
      <v-footer v-if="supplement !== ''" class="TimeBarChart-Footer">
        <ul class="supplementTexts">
          <li class="supplementText">
            {{ $t('補足:') }}
          </li>
          <li class="supplementText2">
            {{ supplement }}
          </li>
        </ul>
      </v-footer>
    </v-layout>
  </data-view>
</template>

<style scoped lang="scss">
.TimeBarChart-Footer {
  background-color: $white !important;
  text-align: left;
  margin: 0;
  flex-direction: row-reverse;
  @include font-size(12);

  color: $gray-3 !important;
  text-decoration: none;
}
.supplementTexts {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  list-style-type: none;
}
.supplementText {
  width: 3em;
}
.supplementText2 {
  width: 100%;
}
.loading {
  visibility: hidden;
}
</style>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import DataView from '@/components/DataView.vue'

export default {
  components: {
    DataView,
    ScaleLoader
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    chartData: {
      type: Array,
      required: false,
      default: () => []
    },
    date: {
      type: String,
      required: true,
      default: ''
    },
    unit: {
      type: String,
      required: false,
      default: ''
    },
    sourceFrom: {
      type: String,
      required: false,
      default: ''
    },
    sourceLink: {
      type: String,
      required: false,
      default: ''
    },
    defaultDataKind: {
      type: String,
      required: false,
      default: 'transition'
    },
    supplement: {
      type: String,
      required: false,
      default: ''
    },
    showButton: {
      type: Boolean,
      required: false,
      default: true
    },
    loaded: {
      type: Boolean,
      required: true,
      default: false
    },
    titleId: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      lineselected: '',
      dateselected: '',
      directionselected: ''
    }
  },
  computed: {
    lines() {
      const alllines = []
      this.chartData.forEach(e => {
        alllines.push({
          label: e.labels.JPLineName,
          value: e.labels.ENLineName
        })
      })
      const line = alllines.filter(function(x, i, self) {
        return self.indexOf(x) === i
      })
      return line
    },
    dates() {
      const alldates = []
      this.chartData.forEach(e => {
        if (e.labels.ENLineName === this.lineselected) {
          alldates.push({
            label: e.labels.JPDate,
            value: e.labels.OriginalDate
          })
        }
      })
      const date = alldates.filter(function(x, i, self) {
        return self.indexOf(x) === i
      })
      return date
    },
    directions() {
      const alldirection = []
      this.chartData.forEach(e => {
        if (
          e.labels.ENLineName === this.lineselected &&
          e.labels.OriginalDate === this.dateselected
        ) {
          alldirection.push({
            label: e.labels.StationFrom + '→' + e.labels.StationTo,
            value: e.labels.OriginalDirection
          })
        }
      })
      const direction = alldirection.filter(function(x, i, self) {
        return self.indexOf(x) === i
      })
      return direction
    },
    heatmapData() {
      if (this.lineselected && this.dateselected && this.directionselected) {
        let data = []
        this.chartData.forEach(e => {
          if (
            e.labels.ENLineName === this.lineselected &&
            e.labels.OriginalDate === this.dateselected &&
            e.labels.OriginalDirection === this.directionselected
          ) {
            data = e.datas
          }
        })
        return data
      }
      return []
    },
    options() {
      if (this.lineselected && this.dateselected && this.directionselected) {
        let option = {}
        this.chartData.forEach(e => {
          if (
            e.labels.ENLineName === this.lineselected &&
            e.labels.OriginalDate === this.dateselected &&
            e.labels.OriginalDirection === this.directionselected
          ) {
            option = {
              xaxis: {
                labels: {
                  formatter(value) {
                    if (value < 4) {
                      return e.labels.Stations[value - 1]
                    }
                    return e.labels.Stations[value]
                  }
                },
                tooltip: {
                  enabled: true,
                  formatter(value) {
                    return (
                      e.labels.Stations[value - 1] +
                      '→' +
                      e.labels.Stations[value]
                    )
                  }
                }
              },
              yaxis: {
                tooltip: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              legend: {
                formatter() {
                  return ''
                }
              },
              plotOptions: {
                heatmap: {
                  colorScale: {
                    ranges: [
                      {
                        from: 0,
                        to: 0,
                        color: '#b2fcff',
                        name: '空いている'
                      },
                      {
                        from: 1,
                        to: 1,
                        color: '#0465d9',
                        name: ''
                      },
                      {
                        from: 2,
                        to: 2,
                        color: '#0b00ff',
                        name: 'やや混んでいる'
                      },
                      {
                        from: 3,
                        to: 3,
                        color: '#F6EB13',
                        name: ''
                      },
                      {
                        from: 4,
                        to: 4,
                        color: '#ED2024',
                        name: '混んでいる'
                      }
                    ]
                  }
                }
              }
            }
          }
        })
        return option
      }
      return {}
    }
  },
  watch: {
    chartData() {
      if (this.chartData !== []) {
        this.lineselected = this.chartData[0].labels.ENLineName
        this.dateselected = this.chartData[0].labels.OriginalDate
        this.directionselected = this.chartData[0].labels.OriginalDirection
      }
    }
  }
}
</script>
