import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import App from './App'
import jQuery from 'jquery'
import 'bootstrap/dist/js/bootstrap.bundle'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/less/style.less'

import '@/js/tagcanvas'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

const vm = window.vm = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

