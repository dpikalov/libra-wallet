//require('framework7/css/framework7.min.css')
require('framework7/css/framework7.md.min.css')
//require('framework7/css/framework7.ios.min.css')
require('./assets/app.css')

import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import VueLodash     from 'vue-lodash';
import Framework7    from 'framework7/framework7.esm.bundle';
import Framework7Vue from 'framework7-vue';
import App           from '@/app.vue';
import AppDirectives from '@/app-directives.js';
import AppFilters    from '@/app-filters.js';
import AppMixin      from '@/app-mixin.js';

//Vue.config.productionTip = false

Vue.use(AsyncComputed);
Vue.use(VueLodash);
Vue.mixin(AppMixin);

Framework7.use(Framework7Vue);

// make global
window.$ = Framework7.$;

window.app = new Vue({
  render: h => h(App),
}).$mount('#app')

window.$(document).on('deviceready', () => {
  window.console.log('deviceready')
});


// Trigger 'deviceready' if cordova has not been loaded (for testing on desktop)
!window.cordova && window.$(document).trigger('deviceready');
