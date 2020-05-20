<template>
  <div class="steps">
    <div :class="[activeIndex===0?'active-circle':'','step-line-circle','circle1']" v-if="stepsList.length">
      <div class="bottom-content1">
        <div class="check-member">
          {{stepsList.length?stepsList[0][titleName]:''}}
        </div>
        <div class="desc" v-if="stepsList.length">
          <slot name="desc" v-bind:step="stepsList[0]"></slot>
        </div>
      </div>
    </div>
    <div v-if="stepsList.length>1" class="wrap">
      <div class="wrap-item" v-for="(step,index) in newStepsList" :key="index">
        <div :class="[index < activeIndex ?'step-active':'','step-line']">
          <div class="step-line-circle"></div>
        </div>
        <div class="bottom-content">
          <div class="check-member">
            {{step[titleName]}}
          </div>
          <div class="desc">
            <slot name="desc" v-bind:step="step"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tzSteps',
  props: {
    stepsList: {
      type: Array,
      default: () => []
    },
    titleName: {
      type: String,
      default: 'realname'
    },
    activeType: {
      type: String,
      default: 'type'
    },
    activeVal: {
      type: String,
      default: ''
    }
  },
  computed: {
    newStepsList () {
      return this.stepsList.filter((item, index) => index !== 0)
    },
    activeIndex () {
      const { activeType, stepsList } = this
      return stepsList.findIndex(currentValue => currentValue[activeType] === this.activeVal)
    }
  },
  data () {
    return {}
  }
}

</script>

<style scoped>
  .steps {
    display: flex;
    position: relative;
    border-radius: 50%;
    width: 800px;
    height:145px;
  }
  .wrap {
    display: flex;
    width: 800px;
  }
  .wrap-item{
    flex:1;
    position: relative;
    /* height:100px; */

  }
  .active-circle{
    border:2px solid #7CA870;
    background: #FFF;
  }
  .step-line {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 16px;
    background: #F9F9F9;
    padding: 3px;
    box-sizing: border-box;
  }
  .step-active{
    background: #7CA870;
  }
  .step-line-circle {
    width: 10px;
    height: 10px;
    background: #EBEEF5;
    border-radius: 50%;
  }

  .wrap-item:nth-child(1) .step-line {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .wrap-item:last-child .step-line {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .circle1 {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 10;
  }

  .check-member {
    color: #282828;
    font-size: 14px;
    font-weight: bold;
  }

  .bottom-content {
    width: 140px;
    text-align: left;
    position: absolute;
    top:24px;
    right:-98px;
    height:80px;
  }
  .bottom-content1 {
    width: 140px;
    text-align: left;
    margin-top:21px;
     height:80px;
  }

  .wrap-item:last-child .bottom-content:last-of-type {
    width: 140px;
    text-align: right;
    position: absolute;
    bottom:0px;
    right:0px;
  }

  .desc {
    font-size: 14px;
    color: #444444;
  }

</style>
