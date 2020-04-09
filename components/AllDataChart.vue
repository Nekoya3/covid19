<template>
  <data-view
    :title="title"
    :date="date"
    :loaded="loaded"
    :source-from="sourceFrom"
    :source-link="sourceLink"
    :title-id="titleId"
  >
    <template v-if="showButton === true" v-slot:button>
      <data-selector v-model="dataKind" />
    </template>
    <v-overlay absolute :value="!loaded" justify-center align-center>
      <scale-loader color="#1268d8" />
    </v-overlay>
    <v-layout column :class="{ loading: !loaded }">
      <bar :chart-data="displayData" :options="displayOption" :height="240" />
      <date-select-slider
        :chart-data="chartData"
        :value="[0, sliderMax]"
        :slider-max="sliderMax"
        @sliderInput="sliderUpdate"
      />
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
    <template v-slot:infoPanel>
      <data-view-current-patients-info-panel
        :l-text="displayInfo.lText"
        :s-text1="displayInfo.sText1"
        :s-text2="displayInfo.sText2"
        :unit="displayInfo.unit"
      />
    </template>
  </data-view>
</template>

<style lang="scss">
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
import DataSelector from '@/components/DataSelector.vue'
import DataViewCurrentPatientsInfoPanel from '@/components/DataViewCurrentPatientsInfoPanel.vue'
import DateSelectSlider from '@/components/DateSelectSlider.vue'

export default {
  name: 'CurrentPatientsChart',
  components: {
    ScaleLoader,
    DataView,
    DataSelector,
    DataViewCurrentPatientsInfoPanel,
    DateSelectSlider
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
      dataKind: this.defaultDataKind,
      graphRange: [0, 1]
    }
  },
  computed: {
    sliderMax() {
      if (!this.chartData || this.chartData.length === 0) {
        return 1
      }
      return this.chartData.length - 1
    },
    displayCumulativeRatio() {
      const lastDay = this.chartData.slice(-1)[0].cumulatives
      const lastDayBefore = this.chartData.slice(-2)[0].cumulatives
      return this.formatDayBeforeRatio(lastDay - lastDayBefore).toLocaleString()
    },
    displayTransitionRatio() {
      const lastDay = this.chartData.slice(-1)[0].transitions
      const lastDayBefore = this.chartData.slice(-2)[0].transitions
      return this.formatDayBeforeRatio(lastDay - lastDayBefore).toLocaleString()
    },
    displayInfo() {
      if (!this.chartData || this.chartData.length === 0) {
        return {
          lText: '',
          sText1: '',
          sText2: '',
          unit: ''
        }
      }
      if (this.dataKind === 'transition') {
        const transition = this.chartData.slice(-1)[0].transitions
        const transitionsvalue = transition[0] + transition[1] + transition[2]
        return {
          lText: `${transitionsvalue.toLocaleString()}`,
          sText1: this.$t('{date}の合計', {
            date: this.$moment(this.chartData.slice(-1)[0].label).format(
              'MM/DD'
            )
          }),
          sText2: this.$t('内訳: 軽症・中等症 {mild}人, 重症 {serious}人', {
            mild: transition[1],
            serious: transition[2]
          }),
          unit: this.unit
        }
      }
      const cumulative = this.chartData[this.chartData.length - 1].cumulatives
      const cumulativesvalue = cumulative[0] + cumulative[1] + cumulative[2]
      return {
        lText: cumulativesvalue.toLocaleString(),
        sText1: this.$t('{date}の全体累計', {
          date: this.$moment(this.chartData.slice(-1)[0].label).format('MM/DD')
        }),
        sText2: this.$t('内訳: 軽症・中等症 {mild}人, 重症 {serious}人', {
          mild: cumulative[1],
          serious: cumulative[2]
        }),
        unit: this.unit
      }
    },
    displayData() {
      if (!this.chartData || this.chartData.length === 0) {
        return {}
      }
      if (this.dataKind === 'transition') {
        return {
          labels: this.chartData.map(d => {
            return d.label
          }),
          datasets: [
            {
              label: '患者数',
              data: this.chartData.map(d => {
                return d.transitions[0]
              }),
              backgroundColor: '#0017f0',
              borderWidth: 0
            },
            {
              label: '軽症者',
              data: this.chartData.map(d => {
                return d.transitions[1]
              }),
              backgroundColor: '#f5af00',
              borderWidth: 0
            },
            {
              label: '重症者',
              data: this.chartData.map(d => {
                return d.transitions[2]
              }),
              backgroundColor: '#f50005',
              borderWidth: 0
            },
            {
              label: '死亡数',
              data: this.chartData.map(d => {
                return d.transitions[3]
              }),
              backgroundColor: '#000000',
              borderWidth: 0
            },
            {
              label: '治療終了者',
              data: this.chartData.map(d => {
                return d.transitions[4]
              }),
              backgroundColor: '#2df500',
              borderWidth: 0
            }
          ]
        }
      }
      return {
        labels: this.chartData.map(d => {
          return d.label
        }),
        datasets: [
          {
            label: '患者数',
            data: this.chartData.map(d => {
              return d.cumulatives[0]
            }),
            backgroundColor: '#0017f0',
            borderWidth: 0
          },
          {
            label: '軽症者',
            data: this.chartData.map(d => {
              return d.cumulatives[1]
            }),
            backgroundColor: '#f5af00',
            borderWidth: 0
          },
          {
            label: '重症者',
            data: this.chartData.map(d => {
              return d.cumulatives[2]
            }),
            backgroundColor: '#f50005',
            borderWidth: 0
          },
          {
            label: '死亡者',
            data: this.chartData.map(d => {
              return d.cumulatives[3]
            }),
            backgroundColor: '#000000',
            borderWidth: 0
          },
          {
            label: '治療終了者',
            data: this.chartData.map(d => {
              return d.cumulatives[4]
            }),
            backgroundColor: '#2df500',
            borderWidth: 0
          }
        ]
      }
    },
    displayOption() {
      const unit = this.unit
      if (!this.chartData || this.chartData.length === 0) {
        return {}
      }
      return {
        animation: false,
        tooltips: {
          displayColors: false,
          callbacks: {
            label(tooltipItem) {
              const labelText = `${parseInt(
                tooltipItem.value
              ).toLocaleString()} ${unit}`
              return labelText
            }
          }
        },
        responsive: true,
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              offset: true,
              time: {
                tooltipFormat: 'MM/DD',
                unit: 'day',
                unitStepSize: 1,
                displayFormats: {
                  day: 'M/D'
                },
                round: 'day'
              },
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                max: this.chartData[this.graphRange[1]].label,
                min: this.chartData[this.graphRange[0]].label,
                fontSize: 10,
                maxTicksLimit: 20,
                fontColor: '#808080'
              }
            }
          ],
          yAxes: [
            {
              location: 'bottom',
              stacked: true,
              gridLines: {
                display: true,
                color: '#E5E5E5'
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080'
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    sliderUpdate(sliderValue) {
      this.graphRange = sliderValue
    },
    sum(arr) {
      return arr.reduce(function(prev, current) {
        return prev + current
      })
    },
    formatDayBeforeRatio(dayBeforeRatio) {
      switch (Math.sign(dayBeforeRatio)) {
        case 1:
          return `+${dayBeforeRatio}`
        case -1:
          return `${dayBeforeRatio}`
        default:
          return `${dayBeforeRatio}`
      }
    }
  }
}
</script>
