<template>
  <f7-page name="page-accounts" ptr @ptr:refresh="refreshOnPull">

    <f7-navbar no-shadow color=white text-color="black">
      <!--f7-nav-left>
        <f7-link icon-f7="arrow_left" back></f7-link>
      </f7-nav-left-->
      <f7-nav-title> Interface to Libra CLI </f7-nav-title>
      <f7-nav-right>
        <f7-link icon-if-md="material:add" @click="accountCreate()"/>
      </f7-nav-right>
    </f7-navbar>

    <f7-block class="text-align-center">
      <h1 v-fade-in> 
        &nbsp;
        Libra accounts
        &nbsp;
      </h1>
      {{ endpoint }}
    </f7-block>

    <f7-list no-hairlines class="text-align-center">
      <f7-list-button @click="accountCreate()">
        NEW ACCOUNT
      </f7-list-button>
    </f7-list>

    
    <f7-list>
      <f7-list-item
        v-for="(item) in accountList"
        :key="item.index"
        :link="'/page-libra-account/' + item.index"
        :title="item.address"
        :after="'#' + item.index"
      >
        <f7-icon slot="inner-start" class="padding-right"
          color="blue"
          md="material:account_balance_wallet"
        />
      </f7-list-item>    
    </f7-list>

  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Fab,
    f7Icon,
    f7Block,
    f7Navbar, f7NavLeft, f7NavRight, f7NavTitle,
    f7Link,
    f7List, f7ListGroup, f7ListItem, f7ListButton,
  } from 'framework7-vue';

  import libra from '@/libra/libra.js';

  export default {
    components: {
      f7Page,
      f7Fab,
      f7Icon,
      f7Block,
      f7Navbar, f7NavLeft, f7NavRight, f7NavTitle,
      f7Link,
      f7List, f7ListGroup, f7ListItem, f7ListButton,
    },

    data() {
      return {
        endpoint:'',
        accountList: []
      }
    },

    async mounted() {
      this.endpoint = libra.endpoint(false);
      this.preloader( this.refresh(true) );
    },

    methods: {

      async accountCreate() {
        try {
          const account = await this.preloader( libra.accountCreate() );
          await this.preloader( this.refresh(false) );
          this.alert('Account created', account.accountAddress);
        } catch (e) {
          this.error(e);
        }
      },

      async refresh(useCache) {
        try {
          this.accountList = await this.preloader( libra.accountList() );
        } catch (e) {
          this.error(e);
        }
      },

      async refreshOnPull(event, done) {
        this.refresh(false).then(done, done);
      },
    },

  };

</script>
