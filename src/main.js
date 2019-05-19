import "./styles/main.pcss";
if (process.env.NODE_ENV === "development") {
  require("file-loader!./index.pug");
}

import Vue from 'vue'
import App from './App.vue'
import {store} from './store/index'; // подключим стор
import SimpleVueValidation from 'simple-vue-validator';

Vue.use(SimpleVueValidation);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
