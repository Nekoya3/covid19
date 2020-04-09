<template>
  <div class="DataView-DataInfo">
    <span class="DataView-DataInfo-summary">
      {{ lText }}
      <small class="DataView-DataInfo-summary-unit">{{ unit }}</small>
      <br />
      <small class="DataView-DataInfo-date">{{ sText1 }}</small>
      <br />
      <small class="DataView-DataInfo-date">{{ sText2 }}</small>
    </span>
  </div>
</template>

<style lang="scss">
.DataView {
  &-DataInfo {
    @include largerThan($large) {
      text-align: right;
      width: 50%;
      padding-top: 10px;
      &-summary {
        display: inline-block;
        font-family: Hiragino Sans, sans-serif;
        font-style: normal;
        font-size: 30px;
        line-height: 30px;
        &-unit {
          font-size: 0.6em;
        }
      }
      &-date {
        white-space: normal;
        display: inline-block;
        font-size: 12px;
        line-height: 12px;
        color: $gray-3;
      }
    }

    padding-bottom: 3px;
    &-summary {
      display: inline-block;
      font-family: Hiragino Sans, sans-serif;
      font-style: normal;
      font-size: 30px;
      line-height: 15px;
      &-unit {
        font-size: 0.6em;
      }
    }
    &-date {
      white-space: normal;
      display: inline-block;
      font-size: 12px;
      line-height: 10px;
      color: $gray-3;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    lText: {
      type: String,
      required: true
    },
    sText1: {
      type: String,
      required: true
    },
    sText2: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }
})
</script>
