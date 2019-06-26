import PageLibra           from '@/pages/page-libra.vue';
import PageLibraAccount    from '@/pages/page-libra-account.vue';
/*
import PageAccountsTx     from '@/pages/page-accounts-tx.vue';
import PageChat           from '@/pages/page-chat.vue';
import PageExpenses       from '@/pages/page-expenses.vue';
import PageHome           from '@/pages/page-home';
import PageLogin          from '@/pages/page-login.vue';
import PageTransfer       from '@/pages/page-transfer.vue';
import PageWebpayBasic    from '@/pages/page-webpay-basic.vue';
import PageWebpayTransfer from '@/pages/page-webpay-transfer.vue';
import PanelLeft          from '@/pages/panel-left.vue';
import PanelRight         from '@/pages/panel-right.vue';
*/
export default [
  {
    path: '/',
    component: PageLibra,
  },
  {
    path: '/page-libra-account/:accountId',
    component: PageLibraAccount,
  },
  /*{
    path: '/page-todo',
    component: PageTodo,
  },
  {
    path: '/page-accounts',
    component: PageAccounts,
  },
  {
    path: '/page-accounts/:txId',
    component: PageAccountsTx,
  },
  {
    path: '/page-home',
    component: PageHome,
  },
  {
    path: '/page-login',
    component: PageLogin,
  },
  {
    path: '/page-chat',
    component: PageChat,
  },
  {
    path: '/page-expenses',
    component: PageExpenses,
  },
  {
    path: '/page-transfer',
    component: PageTransfer,
  },
  {
    path: '/page-webpay-basic',
    component: PageWebpayBasic,
  },
  {
    path: '/page-webpay-transfer',
    component: PageWebpayTransfer,
  },
  {
    path: '/panel-left',
    component: PanelLeft,
  },
  {
    path: '/panel-right',
    component: PanelRight,
  },*/
]