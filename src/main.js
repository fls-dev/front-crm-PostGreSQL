import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from "@/store";
import VueToasted from 'vue-toasted';
import axios from "axios";
import VueMeta from 'vue-meta';
import VueCookies from 'vue-cookies'
import {keyCookie} from "@/vue.config";
import VCalendar from 'v-calendar';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.config.productionTip = false
Vue.use(VCalendar);

Vue.use(VueToasted, {
  duration: 3000,
  position:  'top-center',
  theme: 'outline',
  className: 'tost'
})
Vue.use(VueMeta,{
    title: 'KODIM',
})
Vue.use(VuejsDialog,{
    html: true,
    loader: false,
    reverse: false,
    okText: 'Continue',
    cancelText: 'Close',
    animation: 'fade', // Available: "zoom", "bounce", "fade"
    type: 'basic', // coming soon: 'soft', 'hard'
    verification: 'continue',
    verificationHelp: 'Type "[+:verification]" below to confirm',
    clicksCount: 3,
    backdropClose: true,
    customClass: ''
});
// Vue.component('calendar', Calendar)
Vue.use(VueCookies,{  expires: 'session', domain: window.location.hostname});
axios.interceptors.response.use(
    function(response) { return response;},
    function(error) {
      if (error.response) {
          if(error.response.status === 403){
              $cookies.remove(keyCookie)
              router.push('/')
          }
          return error
      }
    });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
