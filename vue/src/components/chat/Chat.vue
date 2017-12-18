<template>
  <div class="chat">
    <div class="chat-wrapper">
      <div class="user-list">
        <div class='search'>
          <div class='title'>成员列表</div>
          <i class='search-icon'></i>
        </div>
        
        <ul>
          <li v-for='value in userList'>
            {{value.sessionName}}
          </li>
        </ul>
      </div>
      <div class="dialog">
        <div class="dialog-content">
          <span>欢迎您{{userName}}</span>
          <div class='msg'>
            <div v-for='val in dialogShow'>
              {{val.sayer}} saying: {{val.content}}{{val.id}}
            </div>
          </div> 
        </div>
        <div class="send-msg">
          <input type='text' ref='msg'>
          <input type='button' value='send' ref='send' @click='sendEmit'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data () {
    return {
      userName: '',
      dialog: [],
      userList: {},
      id: ''
    }
  },
  sockets:{
    connect: function(){
      console.log('socket connected');
      // this.id=this.$socket.id;
      console.log('id', this.$socket);
    },
    answer: function (val) {
      // 监听服务器回复 把回复内容push到dialog数组中
      // console.log(val.sayer);
      // this.userName 应该替换成由服务器发送来的session值
      this.dialog.push(val);
      // dialog的第一条数据是自动发送的空内容 目的是为了把session和id关联起来 所以展示在内容区断的dialog把第一条数据去除掉
      // this.dialog = this.dialog.splice(1);
    },
    createUserAnswer: function () {
      // 获取所有的用户列表
      this.$root.$http.get('http://localhost:3000/getUserList').then((response) => {
        // console.log(response.data);
        this.userList = response.data.userList;
      }).catch((err) => { // 错误处理
        console.log(err);
      });
    },
    userLeave : function () {
      // 获取所有的用户列表
      this.$root.$http.get('http://localhost:3000/getUserList').then((response) => {
        // console.log(response.data);
        console.log('userLeave');
        this.userList = response.data.userList;
      }).catch((err) => { // 错误处理
        console.log(err);
      });
    }
  },
  computed: {
    dialogShow () {
      var newArr = this.dialog.slice(1);
      return newArr;
    }
  },
  created () {
  // 创建的时候获取session的username值
    this.$root.$http.get('http://localhost:3000/api').then((response) => {
      // console.log(response.data);
      this.userName = response.data;

      // 告诉服务器创建了一个新的用户
      this.$socket.emit('createUser', 'createUser');

      // this.$socket.nsp = '/abeng';

      // 设置id值
      this.id=this.$socket.id;
      console.log(this.id);

      // 发送消息给服务器
      this.sendEmit();

    }).catch((err) => { // 错误处理
      console.log(err);
    });
  },
  methods: {
    // 发送消息给服务器
    sendEmit () {
      // 把输入框的内容发送给服务器
      // 获取输入框的内容
      var content = this.$refs.msg.value;
      this.$socket.emit('question', {
        'sayer': this.userName,
        'content': content,
        'id': this.id
      });
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable.styl'
.chat
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  background-color: $color-background
  font-size: 12px

  .chat-wrapper
    width: 90%
    height: 90%
    border: 1px solid red
    margin: 10px auto auto auto
    border-radius: 5px
    overflow: hidden

    .user-list
      width: 20%
      min-width: 30px
      height: 100%
      background-color: $color-background-dark
      border-radius: 5px 0 0 5px
      float: left

      .title
        width: 80%

    .dialog
      width: 80%
      height: 100% 
      float: left
      position: relative
      
      .dialog-content
        height: 95%
        overflow-y: scroll
        margin-bottom: -40px
        box-sizing: border-box
        padding-bottom: 140px
      .send-msg
        height: 5%
        padding-top: 40px

</style>
