import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { handleRequests } from "@/utils/functions/helpers.js";
import router from "./router";

Vue.prototype.$http = handleRequests;

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
