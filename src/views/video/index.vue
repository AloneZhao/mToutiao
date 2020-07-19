<template>
  <div>
    视频页面{{ index }}
  </div>
</template>

<script>
export default {
  name: 't-video',
  data() {
    return {
      index: 1
    }
  },
  methods: {},
  activated() {
    console.log('出发11')
    this.index++
  }
}
</script>

<style lang="scss" scoped>
</style>