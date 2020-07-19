<template>
  <div>
    问答{{ index }}
  </div>
</template>

<script>
export default {
  name: 'qa',
  data() {
    return {
      index: 1
    }
  },
  methods: {},
  mounted() {
    console.log('mounted')
  },
  activated() {
    console.log('出发！')
    this.index += 2
  }
}
</script>

<style lang="scss" scoped>
</style>