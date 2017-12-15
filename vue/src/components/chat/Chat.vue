<template>
  <div class="chat">
    欢迎您{{userName}} and {{userName2}}
    <div ref='getsession' @click='getSession'>点击获取session值</div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data () {
    return {
      userName: ''
    }
  },
  created () {
    this.$root.$http.get('http://localhost:3000/getsession').then((response) => {
      // console.log(response.data);
      this.userName = response.data;
    }).catch((err) => { // 错误处理
      console.log(err);
    });
  },
  methods: {
    getSession () {
      this.$root.$http.get('http://localhost:3000/login').then((response) => {
        console.log('获取到的session值是:', response.data);
        this.userName = response.data;
      }).catch((err) => { // 错误处理
        console.log(err);
      });
    }
  },
  computed: {
    userName2 () {
      this.$root.$http.get('http://localhost:3000/').then((response) => {
        // console.log(response.data);
        return response.data;
      }).catch((err) => { // 错误处理
        console.log(err);
      });
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable.styl'
.chat
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: $color-background;
</style>
