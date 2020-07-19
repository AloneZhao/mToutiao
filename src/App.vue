<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      cachePages: ['TabBar']
    }
  }
}
</script>

<style lang="scss">
</style>
