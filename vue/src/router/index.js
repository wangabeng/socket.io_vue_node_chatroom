import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/chat',
      component:resolve => require(['@/components/chat/chat'],resolve)
    }
  ]
})