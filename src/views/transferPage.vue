<template>
  <keep-alive :include="cacheData">
    <router-view></router-view>
  </keep-alive>
</template>
<script>
import { mapState } from 'vuex'
import keepAlive from '../mixins/keepAlive'

export default {
  mixins: [keepAlive],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      cacheData: state => state.global.keepAlive
    })
  }
}
</script>
