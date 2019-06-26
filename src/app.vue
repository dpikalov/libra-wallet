<template>
  <f7-app :params="f7Params" class="page color-theme-blue">
    <f7-statusbar></f7-statusbar>
    
    <f7-panel left cover>
      <f7-view url="/panel-left/" links-view=".view-main"></f7-view>
    </f7-panel>

    <f7-panel right reveal>
      <f7-view url="/panel-right/"></f7-view>
    </f7-panel>

    <f7-view url="/" :main="true" class="ios-edges"></f7-view>
  </f7-app>
</template>

<script>
  import { f7App, f7Panel, f7View, f7Popup, f7Statusbar } from 'framework7-vue';
  import routes from '@/app-routes';
  //import webpay from '@/utils.webpay.js';
  //import utils  from '@/utils.widgetapi.js';


  export default {
    components: {
      f7App,
      f7Panel,
      f7View,
      f7Popup,
      f7Statusbar,
    },

    data() {
      return {
        f7Params: {
          theme: 'md',
          routes,
          id: 'com.gieseckedevrient.wallet',
        },
      };
    },

    created() {
      // Subscribe to 'back-button' events
      this.setBackButtonHandler();

      // Subscribe to Web Payments (android only)
      //this.setWebPaymentRequestHandler();
    },

    methods: {
      setBackButtonHandler() {
        const self = this;

        $(window).on('lifecycle', function (event) {
          const router = self.$f7.views.main.router;

          if (event.detail.type != 'back-button') {
            return;
          }

          if (router.history.length > 2) {
            router.back();
          } else {
            utils.closeApplication();
          }
        });
      },

      // android only
      /*
      setWebPaymentRequestHandler() {
        const self = this;

        const handler = (payload) => {
          console.log('WebpayHandler', payload)

          const router = self.$f7.views.main.router;
          const params = { props: { payload } };

          if (payload.methodName == 'basic-card') {
            router.navigate('/page-webpay-basic/', params);
          } else {
            router.navigate('/page-webpay-transfer/', params);
          }
        }

        $(document).on('deviceready', () =>
          setTimeout(() => webpay.setPaymentRequestHandler(handler), 500)
        )
      },
      */
    }

  };

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
