<template>
  <span @click="handleClick">
    <svg-icon icon-class="fullscreen" class="icon"> </svg-icon>
  </span>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async handleClick () {
      // 判断是否在全屏中
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.icon {
  color: #fff;
  font-size: 20px;
  margin-right: 6px;
}
</style>
