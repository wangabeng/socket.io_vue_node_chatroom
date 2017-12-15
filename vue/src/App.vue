<template>
  <div id="app">
    <router-link to='/chat' tag='div' class='chat-button'>
      <span>与客服交谈</span>
    </router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import 'common/stylus/index.styl'
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  width: 100%
  height: 100%
  position: absolute
  left: 0
  top: 0
  .chat-button
    width: 120px
    height: 30px
    line-height: 30px
    background: gray
</style>
