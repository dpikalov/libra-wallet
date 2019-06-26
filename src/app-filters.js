import Vue from 'vue';

//
Vue.filter('formatCurrency', function (value, currency = '€') {
  if (typeof value == 'number') {
    return value.toLocaleString() + ' ' + currency;
  }
  return 'n/a';
})

//
Vue.filter('formatCardPan', function (value) {
  if (!value) {
  	return '';
  }
  return ('' + value).replace(/(\d{4})/g, '$1 ');
})

//
Vue.filter('formatCardDate', function (value) {
  if (value == undefined) {
    return '';
  }
  if (value.length == 4) {
    return value.replace(/(\d{2})(\d{2})/, '$2/$1')
  }
  const iso8601 = (new Date(+value)).toISOString();
  const yy = iso8601.slice(2,4);
  const mm = iso8601.slice(5,7);
  return mm + '/' + yy;
})
