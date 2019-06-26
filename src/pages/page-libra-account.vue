<template>
  <f7-page name="page-libra-account" ptr @ptr:refresh="refreshOnPull">

    <f7-navbar no-shadow color=white text-color="black">
      <f7-nav-left>
        <f7-link icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>
      <f7-nav-title> Outgoing transactions </f7-nav-title>
      <f7-nav-right>
        <f7-link icon-if-md="material:send" @click="transfer()"/>
      </f7-nav-right>

      <f7-searchbar
        class="searchbar"
        expandable
        search-container="[data-name='page-libra-account'] .searchbar-list"
        search-in=".item-title"
      />
    </f7-navbar>

   <f7-block class="text-align-center">
      <h1 v-fade-in>
        &nbsp;
        <span v-if="balance != undefined"> Total: {{ balance }} coins</span> 
        &nbsp;
      </h1>
      <span>
        &nbsp;
        <span v-if="txList.length != 0"> num of transactions: {{ txList.length }}</span>
        &nbsp;
      </span>
    </f7-block>

    <f7-list no-hairlines class="text-align-center">
      <f7-list-button @click="accountMint()">
        MINT COINS ...
      </f7-list-button>
    </f7-list>

    <f7-list no-hairlines class="searchbar-list">
      <f7-list-item
        v-for="(tx) in txList"
        :header="'Exp.' + txExpTime(tx) + ' Seq. number: ' + tx.rawTxn.sequenceNumber"
        :title="tx.rawTxn.payload.args.ADDRESS"
        :footer="'tx/contract:' + tx.rawTxn.payload.transaction"
        @click="showTx(tx)"
      >
        <span slot="after">
          {{ tx.rawTxn.payload.args.U64 / 1000000 }}
        </span>
      </f7-list-item>
    </f7-list>

    <!-- Popup: Card Actions -->
    <f7-actions ref="actionTxDetails" v-if="txDetails">
        <f7-actions-label>
          Transaction raw data
        </f7-actions-label>
        <tt style="word-wrap:break-word;">
          {{ JSON.stringify(this.txDetails, null, 1) }}
        </tt>
    </f7-actions>

  </f7-page>
</template>

<script>
  import {
    f7Page,
    f7Fab,
    f7Icon,
    f7Navbar, f7NavLeft, f7NavRight, f7NavTitle,
    f7Block, f7BlockTitle,
    f7Link,
    f7List, f7ListIndex, f7ListGroup, f7ListItem, f7ListButton,
    f7Searchbar,
    f7Actions, f7ActionsGroup, f7ActionsLabel, f7ActionsButton,
  } from 'framework7-vue';

  import libra from '@/libra/libra.js';

  export default {
    components: {
      f7Page,
      f7Fab,
      f7Icon,
      f7Navbar, f7NavLeft, f7NavRight, f7NavTitle,
      f7Block, f7BlockTitle,
      f7Link,
      f7List, f7ListIndex, f7ListGroup, f7ListItem, f7ListButton,
      f7Searchbar,
      f7Actions, f7ActionsGroup, f7ActionsLabel, f7ActionsButton,
    },

    data() {
      return {
        account  : null,
        accountId: null,
        balance  : undefined,
        txList   : [],
        txDetails: {}
      }
    },

    async mounted() {
      setTimeout(() => this.preloader( this.refresh(true) ), 100)
    },

    methods: {

      async refresh(useCache) {
        try {
          this.accountId = this.$f7route.params.accountId;

          this.balance = +await libra.queryBalance(this.accountId);
          //Vue.set(this, "balance", '' + this.balance)

          this.txList = await libra.queryTransactions(this.accountId);

        } catch (e) {
          this.txList = [];
          this.error(e);
        }
      },

      refreshOnPull(event, done) {
        this.refresh(false).then(done, done);
      },

      async accountMint() {
        try {
          const coins = await this.prompt('How many coins to mint?', '', 10)
          if (coins) {
            await this.preloader( libra.accountMint(this.accountId, coins) )
            await this.preloader( this.refresh(false) );
          }
        } catch (e) {
          this.error(e);
        }
      },

      async transfer () {
        try {
          const accountTo = '24';

          const coins = await this.prompt('Transfer coins to acc. #' + accountTo, '', 10)
          if (coins) {
            await this.preloader( libra.transfer(this.accountId, accountTo, coins) )
            await this.preloader( this.refresh(false) );
          }
        } catch (e) {
          this.error(e);
        }
      },

      showTx(tx) {
        this.txDetails = tx;
        this.$refs.actionTxDetails.open()
      },

      txExpTime(tx) {
        return new Date(parseInt(tx.rawTxn.expirationTime) * 1000).toISOString();
      },
    },

  };

</script>

<style scoped>
  
  .positive {
    color: green;
  }

</style>

