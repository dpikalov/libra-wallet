import axios  from 'axios';


const endpoint = (useProxy = true) => {
  //return 'https://cors-anywhere.herokuapp.com' + '/'
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  return (useProxy ? proxy : '') + 'http://172.105.68.208:8080'
}

//
var cache = {}

const delay = async (ms) => new Promise(done =>
  setTimeout(done, ms)
)

const accountCreate = async () => {
  const resp = await axios.get(endpoint() + '/account/create')
  return resp.data;
  /*return {
    'account': '#3',
    'accountAddress': '234234234234234234234234',
  }*/
}

// List of accounts or an account for the given Id
const accountList = async () => {
  const resp = await axios.get(endpoint() + '/account/list')
  return resp.data.accounts;
  /*
  return [
    {
      'index': '0',
      'address'       : '0923784023840928340982340923',
      'sequenceNumber': '0',
      'status'        : 'Persisted',
    },
    {
      'index': '1',
      'address'       : '5675675675675678340982340923',
      'sequencNumber' : '1',
      'status'        : 'Local',
    },
  ]
  */
}

//
const accountMint = async (accountId, numCoins) => {
  const resp = await axios.get(endpoint() + '/account/' + accountId + '/mint?amount=' + numCoins)
  return resp.data;
  //return {}
}

const transfer = async (accountFrom, accountTo, numCoins) => {
  const resp = await axios.get(endpoint() + '/account/' + accountFrom + '/transfer?to=' + accountTo + '&amount=' + numCoins)
  //const resp = await axios.get(endpoint() + '/transfer/accountFrom/accountTo/numCoins')
  //return resp;
  return resp.data.error ? Promise.reject('Error on CLI side') : resp.data;
}

//
const queryBalance = async (accountId = '0') => {
  const resp = await axios.get(endpoint() + '/account/' + accountId + '/balance')
  return resp.data.balance;
  //return 99;
}

/*
const querySequence = async (accountId = '0') => {
  //const resp = await axios.get(endpoint() + '/query/sequence?accountId=accountId')
  //return resp.data['Sequence number is'];
  //
  return 22;
}
*/

// There is no CLI method for that - this API is custom
const queryTransactions = async (accountId, secNumber) => {
  const resp = await axios.get(endpoint() + '/account/' + accountId + '/transactions')
  return resp.data.transactions;

  /*
  return [{
    sender : '5365737573573573765754575367567',
    sequence_number: '11',
    payload: {
      transaction: 'peer_to_peer_transaction',
      args: [
        { ADDRESS: '342534534253232454353445362' },
        { U64    : 100000000 },
      ]
    },
    max_gas_amount : 1000,
    gas_unit_price : 0,
    expiration_time: +new Date(),
  }]
  */
}

/**/
export default {
  endpoint,          // ok
  accountCreate,     // ok
  accountList,       // ok
  accountMint,       // ok
  transfer,
  queryBalance,      // ok
  //querySequence,
  queryTransactions, // ok
}

