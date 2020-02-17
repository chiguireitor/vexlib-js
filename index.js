/**
 * Copyright 2018 Sistemas Timitacon C.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * Original Author: johnvillar@contimita.com
 *
 **/
import "regenerator-runtime/runtime"
import axios from 'axios'
import bip39 from 'bip39'
import hash from 'hash.js'
import aesjs from 'aes-js'
import bitcoin from 'bitcoinjs-lib'
import bitcoinMessage from 'bitcoinjs-message'
import bigi from 'bigi'
import bs58 from 'bs58'
import EventEmitter from 'events'
import io from 'socket.io-client'
import checkIp from 'check-ip'
import BigNumber from 'bignumber.js'
import xcpjsv2 from 'xcpjsv2'
import Cookies from 'universal-cookie'

const build="${BUILD}"

function getStorage(type) {
  if (typeof(window) !== 'undefined' && type + 'Storage' in window) {
    return window[type + 'Storage']
  } else {
    return require('localstorage-memory')
  }
}

const localStorageProxy = getStorage('local')
const sessionStorageProxy = getStorage('session')

export const SATOSHIS = 100000000

const bip39SpanishFix = {
  "á": "á",
  "é": "é",
  "í": "í",
  "ó": "ó",
  "ú": "ú"
}

const divideLimited = (val, divisor) => {
  return Math.floor(val) / divisor
}

/*export function limit8Decimals(v) {
  if (v.length > 8) {
    return v.slice(0, 8)
  } else if (v.length === 8) {
    return v
  } else {
    return v + new Array(8 - v.length).fill(0).join('')
  }
}*/

export function limitNDecimals(v, n) {
  if (v.length > n) {
    return v.slice(0, n)
  } else if (v.length === n) {
    return v
  } else {
    return v + new Array(n - v.length).fill(0).join('')
  }
}

export function sanitizeNDecimals(n, divisor) {
  let decimals = divisor.toString().length - 1
  let v = n + ''
  let num = v.split('.')

  if (num.length > 1) {
    return num[0] + '.' + limitNDecimals(num[1], decimals)
  } else {
    return num[0] + '.' + Array(decimals).fill(0).join('')
  }
}


export function softLimit8Decimals(v) {
  if (!v){
    return v
  } else {
    v = '' + v
    if (v.indexOf('.') < 0) {
      return v
    } else {
      let [i, d] = v.split('.')
      if (d.length > 8) {
        return i + '.' + d.slice(0, 8)
      } else if (v.length <= 8) {
        return i + '.' + d
      }
    }
  }
}

//var window = window || { location: { hostname: '-' } }
function getDefaultBaseUrl() {
  if (typeof(window) !== 'undefined') {
    return ((window.location.hostname === 'localhost') || (checkIp(window.location.hostname).isRfc1918))?`http://${window.location.hostname}:8085`:window.location.origin
  } else {
    return ''
  }
}
var baseUrl = getDefaultBaseUrl()

function defaultAxios(ob) {
  if (!ob) {
    ob = {}
  }

  console.log('Using baseurl:', baseUrl)
  ob.baseURL = baseUrl

  return axios.create(ob)
}

const fixList = bip39.wordlists.spanish.filter(x => x !== x.normalize()).map(x => [x, x.normalize('NFD').replace(/[\u0300-\u036f]/g, "")])
function fixAccents(w) {
  if (w) {
    let words = w.split(" ")
    words = words.map(ow => {
      let idx = fixList.findIndex(p => p[1] === ow)

      if (idx >= 0) {
        return fixList[idx][0]
      } else {
        return ow
      }
    })

    return words.join(" ")
  } else {
    return w
  }
}

function getKeyPairFromSessionStorage() {
  let mnemonic = sessionStorageProxy.getItem('currentMnemonic')
  let seedHex = bip39.mnemonicToSeedHex(fixAccents(mnemonic))
  let d = bitcoin.crypto.sha256(Buffer.from(seedHex, 'hex'))
  return bitcoin.ECPair.fromPrivateKey(d, {network: bitcoin.networks.testnet})
}

var devices = {}

function buildAndSign(keyPair, tx, cb) {
  let builder = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)

  if (tx.__tx) {
    tx = tx.__tx
  }

  tx.ins.forEach(vin => {
    builder.addInput(vin.hash.reverse().toString('hex'), vin.index)
  })

  tx.outs.forEach(vout => {
    builder.addOutput(vout.script, vout.value)
  })

  for (let i=0; i < tx.ins.length; i++) {
    builder.sign(i, keyPair)
  }

  let built = builder.build()

  cb(built.toHex())
}

function signTransaction(rawHex, cb) {
  let tx = bitcoin.Transaction.fromHex(rawHex)
  let device = sessionStorageProxy.getItem('device')
  console.log(device)

  if ((device === 'userpass') || (device === null)) {
    let keyPair = getKeyPairFromSessionStorage()

    buildAndSign(keyPair, tx, cb)
  } else if (device === 'trezor') {
    let Trezor = devices[device](0)

    Trezor.signTx(tx.ins, tx.outs, (err, tx) => {
      if (err) {
        console.log('Trezor ERR:')
        console.log(err)
        console.trace()
        cb(null)
      } else {
        console.log('Serialized TX:', tx)

        cb(tx)
      }
    })
  }
}

var singleton = null

export default class VexLib extends EventEmitter {
  static singleton(options) {
    if (!options) {
      options = {}
    }

    if (options && options.baseUrl) {
      baseUrl = options.baseUrl
    }

    if (singleton === null) {
      singleton = new VexLib(options)
    }

    return singleton
  }

  registerDeviceProvider(name, proto) {
    devices[name] = proto
  }

  experimentList = []
  registerExperiment(name, description) {
    this.experimentList.push({name, description})

    return true
  }

  hasExperiments() {
    return this.experimentList.length > 0
  }

  experimentResult(ob) {
    setImmediate(async () => {
      try {
        let url = ((window.location.hostname === 'localhost') || (checkIp(window.location.hostname).isRfc1918))?`http://${window.location.hostname}:3095`:'https://metrics.contimita.com/'
        await axios.post(url, {
          data: ob
        })

        console.log('Ex: ' + ob.type + ' done')
      } catch(err) {
        console.log('Error while reporting metrics to experiment:', err)
      }
    })
  }

  constructor(options) {
    super()

    this.lang = options.lang || 'EN'
    this.exchangeAddress = options.exchangeAddress || ''
    this.issuanceAddress = options.issuanceAddress || options.exchangeAddress || ''
    this.earningsAddress = options.earningsAddress || options.exchangeAddress || ''
    this.ptAddress = 'muE5oXmBDr32XKYmFEqJ7U7d7DuzCjCj8E'

    console.log('VexLib init', this.lang, this.exchangeAddress, build)
    this.experiments = localStorageProxy.getItem('experiments') === '1'
    this.axios = defaultAxios({
      headers: {
        test: this.experiments?'1':'0'
      }
    })

    this.lastVexSeq = 0
    this.cbList = {}
    this.fiatTokensDivisor = {
      VEFT: 100,
      VEST: 100,
      EURT: 100,
      USDT: 100,
    }

    if (this.experiments) {
      axios.defaults.headers.common['test'] = this.experiments?'1':'0'
    }

    this._is_connected_ = false
    this._is_authed_ = false
    this._call_list_ = []
    this._noauth_call_list_ = []

    this.sKeyPairFromMnemonic = VexLib.keyPairFromMnemonic

    this.axios.get('/config')
      .then((response) => {
        if (response.data.exchangeAddress) {
          console.log('Config loaded (base)', response.data)

          this.exchangeAddress = response.data.exchangeAddress
          this.issuanceAddress = response.data.issuanceAddress || response.data.exchangeAddress
          this.earningsAddress = response.data.earningsAddress || response.data.exchangeAddress
          this.proxyAgent = response.data.proxyAgent || ''
          this.maintenance = response.data.maintenance || ''
          this.unspendableAddress = 'mvCounterpartyXXXXXXXXXXXXXXW24Hef'

          this._start_socket_()
        } else {
          this.axios.get('/vexapi/config')
            .then((response) => {
              if (response.data.exchangeAddress) {
                console.log('Config loaded (vexapi)', response.data)

                this.exchangeAddress = response.data.exchangeAddress
                this.issuanceAddress = response.data.issuanceAddress || response.data.exchangeAddress
                this.earningsAddress = response.data.earningsAddress || response.data.exchangeAddress
                this.proxyAgent = response.data.proxyAgent || ''
                this.maintenance = response.data.maintenance || ''
                this.unspendableAddress = 'mvCounterpartyXXXXXXXXXXXXXXW24Hef'

                this._start_socket_()
              } else {
                console.log('Config couldnt be loaded, continuing anyways')
              }
            })
        }
      })
      .catch(() => {
        console.log('No config, starting up anyways')

        this._start_socket_()
      })

    xcpjsv2.setNetwork('testnet')
    xcpjsv2.setBroadcastService({broadcast: async (txHex) => {
      let result = await this.axios.post('/vexapi/sendtx', {
        rawtx: txHex
      })

      return result
    }})

    xcpjsv2.setUtxoService(xcpjsv2.services.indexdUtxos(baseUrl + '/index/'))
  }

  async addrTxs(addr) {
    return (await axios.get(`${baseUrl}/index/a/${addr}/txs`)).data
  }

  parseRawTransaction(rawhex) {
    return bitcoin.Transaction.fromHex(rawhex)
  }

  tokenDivisor(tkn) {
    if (tkn in this.fiatTokensDivisor) {
      return this.fiatTokensDivisor[tkn]
    } else {
      return SATOSHIS
    }
  }

  _start_socket_() {
    this.socket = io(baseUrl, {path: '/vexapi/socketio/'})

    this.socket.on('connect', this._socket_connect_)
    this.socket.on('new block', this._socket_newblock_)
    this.socket.on('new dbupdate', this._socket_newdbupdate_)
    this.socket.on('new notifs', this._socket_newnotifs_)
    this.socket.on('updates', this._socket_updates_)
    this.socket.on('close', this._socket_close_)
    this.socket.on('error', (err) => console.log('Socket error:', err))

    let vexApiHandler = (data) => {
      if (typeof(data.seq) !== 'undefined' && data.seq in this.cbList) {
        let cb = this.cbList[data.seq]

        if (cb) {
          if (data.error) {
            cb(data.error)
          } else if (data.err) {
            cb(data.err)
          } else {
            cb(null, data.data)
          }

          delete this.cbList[data.seq]
        }
      } else {
        console.log('Message not expected', data.seq)
      }
    }

    this.socket.on('vex', vexApiHandler)
    this.socket.on('vexblock', vexApiHandler)
    this.socket.on('db', vexApiHandler)
    this.socket.on('ldb', vexApiHandler)
    this.socket.on('banks', vexApiHandler)
    this.socket.on('indexer', vexApiHandler)
    this.socket.on('proxy', vexApiHandler)
    this.socket.on('orders', vexApiHandler)
    this.socket.on('mdb', vexApiHandler)
    this.socket.on('need2fa', (data) => this.emit('need2fa', data))
    this.socket.on('needauth', (data) => this.emit('needauth', data))
    this.socket.on('authok', () => { this.emit('authok'); this._authed_() })
  }

  consumeCallList = () => {
    let call = this._call_list_.shift()
    if (call) {
      call()
      setImmediate(this.consumeCallList)
    }
  }

  consumeNoauthCallList = () => {
    let call = this._noauth_call_list_.shift()
    if (call) {
      call()
      setImmediate(this.consumeNoauthCallList)
    }
  }

  _socket_connect_ = () => {
    console.log('Socket connected')
    this._is_connected_ = true
    this.consumeNoauthCallList()
  }

  _authed_ = () => {
    console.log('Socket authed')
    this._is_authed_ = true
    this.consumeCallList()
  }

  _socket_close_ = () => {
    console.log('Socket closed')
    this._is_connected_ = false
  }

  _socket_newblock_ = (hash) => {
    this.emit('new block', hash)
    //this.vex('')
  }

  _socket_newdbupdate_ = () => {
    this.emit('new dbupdate')
    //this.vex('')
  }

  _socket_newnotifs_ = (notifs) => {
    this.emit('new notifs', notifs)
  }

  _socket_updates_ = (updates) => {
    this.emit('updates', updates)
  }

  hasEmittedNeedauth = false
  _api_(entry, method, params, cb, noAuthNeeded) {
    this.cbList[this.lastVexSeq] = cb

    let doCall = ((seq) => () => {
      this.socket.emit(entry, {
        method,
        params,
        seq
      })
    })(this.lastVexSeq)

    this.lastVexSeq++

    if (this._is_authed_ || this._is_connected_ && noAuthNeeded) {
    //if (this._is_connected_) {
      doCall()
    } else {
      if (noAuthNeeded) {
        this._noauth_call_list_.push(doCall)
        console.log(`Postergating ${entry}.${method} call until connection`)
      } else {
        this._call_list_.push(doCall)
        console.log(`Postergating ${entry}.${method} call until authorization`)
      }

      if (!this.hasEmittedNeedauth) {
        this.hasEmittedNeedauth = true
        setTimeout(() => {
          this.emit('needauth')
        }, 500)
      }
    }
  }

  _promisify_ = func => (method, params) => new Promise((resolve, reject) => { this[func](method, params, (err, data) => { if (err) { resolve(err) } else { resolve(data) } }) })

  vex(method, params, cb, noAuthNeeded) {
    this._api_('vex', method, params, cb, noAuthNeeded)
  }

  vexblock(method, params, cb) {
    this._api_('vexblock', method, params, cb)
  }

  vexblockAsync = this._promisify_('vexblock')

  db(method, params, cb, noAuthNeeded) {
    this._api_('db', method, params, cb, noAuthNeeded)
  }

  dbAsync(method, params) {
    return new Promise((resolve, reject) => {
      this._api_('db', method, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  ldb(method, params, cb) {
    this._api_('ldb', method, params, cb)
  }

  mdb(method, params, cb) {
    this._api_('mdb', method, params, cb)
  }

  mdbAsync(method, params) {
    return new Promise((resolve, reject) => {
      this._api_('mdb', method, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  index(method, params, cb) {
    this._api_('index', method, params, cb)
  }

  banks(method, params, cb) {
    this._api_('banks', method, params, cb)
  }

  indexer(method, params, cb) {
    this._api_('indexer', method, params, cb)
  }

  proxy(method, params, cb) {
    this._api_('proxy', method, params, cb)
  }

  orders(method, params, cb) {
    this._api_('orders', method, params, cb)
  }

  signAndBroadcastTransaction(rawtx, cb) {
    signTransaction(rawtx, (signed) => {
      this.axios.post('/vexapi/sendtx', {
        rawtx: signed
      }).then((response) => {
        cb(null, response.data.result)
      }).catch(err => {
        cb(err)
      })
    })
  }

  getBalances(cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    this.vex('get_balances', {
      filters: [
        {
          field: 'address',
          op: '==',
          value: currentAddress
        }
      ]
    }, (err, data) => {
      if (err) {
        cb(err)
      } else {
        //console.log(data.result)
        let balances = data.result.reduce((p, x) => {
          if (!(x.asset in p)) {
            p[x.asset] = new BigNumber(x.quantity)
          } else {
            p[x.asset] = p[x.asset].plus(new BigNumber(x.quantity))
          }
          return p
        }, {})

        for (let asset in balances) {
          let divisor = SATOSHIS
          if (asset in this.fiatTokensDivisor) {
            divisor = this.fiatTokensDivisor[asset]
          }
          balances[asset] = balances[asset].dividedBy(divisor).toNumber()
        }
        cb(null, balances)
      }
    })
  }

  userEnabled(cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    /*this.index('', {url: `/a/${currentAddress}/utxos`}, (err, data) => {
      console.log('Got from utxo', err, data)
      if (err) {
        cb(err)
      } else {
        cb(null, data.length > 0)
      }
    })*/

    cb(null, true)
    // Deprecated the UTXOs thing
    /*this.vex('get_unspent_txouts', {
      address: currentAddress,
      unconfirmed: true
    }, (err, data) => {
      //console.log('Got from utxo', err, data)
      if (err) {
        cb(err)
      } else {
        cb(null, data.result && data.result.length > 0)
      }
    }, true)*/
  }

  hasUtxos(cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    this.vex('get_unspent_txouts', {
      address: currentAddress,
      unconfirmed: true
    }, (err, data) => {
      //console.log('Got from utxo', err, data)
      if (err) {
        cb(err)
      } else {
        cb(null, data.result && data.result.length > 0)
      }
    }, true)
  }

  proxy_getOrderBook(give, get, isBid, cb) {
    let pair = (give + '/' + get)
    this.proxy(this.proxyPairs[pair] + 'order_book', {
      give, get, isBid
    }, (err, data) => {
      if (err) {
        console.log('PGOB err', err)
        cb(err)
      } else {
        let book = isBid?data.bids:data.asks

        cb(null, {giveAsset: give, getAsset: get, book: book.map(x => {
            let funds = parseFloat(x.price) * parseFloat(x.volume)
            let remaining_give = funds * parseFloat(x.remaining_volume) / parseFloat(x.volume)
            return {
              rawGive: funds * SATOSHIS,
              rawGet: parseFloat(x.volume) * SATOSHIS,
              give: remaining_give,
              get: x.remaining_volume,
              price: x.price
            }
          })
        })
      }
    })
  }

  getOrderBook(give, get, isBid, cb) {
    this.orders('orderBook', { give, get }, (err, data) => {
      if (err) {
        console.log('orderBookErr', err)
        cb(err)
      } else {
        cb(null, data)
      }
    })
  }

  getOrderBook_old(give, get, isBid, cb) {
    let proxyGive = give.slice(0, -1)
    let proxyGet = get.slice(0, -1)
    if (!isBid) {
      [ proxyGive, proxyGet ] = [ proxyGet, proxyGive ]
    }

    let pair = proxyGive + '/' + proxyGet
    if (this.proxyPairs && pair in this.proxyPairs) {
      this.proxy_getOrderBook(proxyGive, proxyGet, isBid, cb)
      return
    }

    this.vex('get_orders', {
      filters: [
        {
          field: 'give_asset',
          op: '==',
          value: give
        },
        {
          field: 'get_asset',
          op: '==',
          value: get
        },
        {
          field: 'give_remaining',
          op: '>',
          value: 0
        },
        {
          field: 'status',
          op: '==',
          value: 'open'
        }
      ]
    }, (err, data) => {
      if (err) {
        cb(err)
      } else {
        let sumGive = 0
        let sumGet = 0

        let giveIsFiat = give in this.fiatTokensDivisor
        let getIsFiat = get in this.fiatTokensDivisor

        let giveDivisor = giveIsFiat?this.fiatTokensDivisor[give]:SATOSHIS
        let getDivisor = getIsFiat?this.fiatTokensDivisor[get]:SATOSHIS

        const properComparePrice = (a, b) => {
          if (giveIsFiat || getIsFiat) {
            let ba = new BigNumber(a)
            let bb = new BigNumber(b)

            return ba.toFixed(2) === bb.toFixed(2)
          } else {
            return a === b
          }
        }

        //console.log(isBid, giveIsFiat, getIsFiat, giveDivisor, getDivisor, give, get)

        let res = data.result.map(x => {
          return {
            rawGive: (isBid?x.give_remaining:x.get_remaining),
            rawGet: (isBid?x.get_remaining:x.give_remaining),
            give: isBid?divideLimited(x.give_remaining, giveDivisor):divideLimited(x.get_remaining, getDivisor),
            get: isBid?divideLimited(x.get_remaining, getDivisor):divideLimited(x.give_remaining, giveDivisor),
            //price: isBid?(x.get_quantity / x.give_quantity * getDivisor / giveDivisor):(x.give_quantity / x.get_quantity * getDivisor / giveDivisor)
            price: isBid?((x.get_quantity / getDivisor) / (x.give_quantity / giveDivisor)):(x.give_quantity / x.get_quantity * getDivisor / giveDivisor)
            //price: isBid?(x.get_quantity / x.give_quantity):(x.give_quantity / x.get_quantity)
          }
        }).sort((a,b) => isBid?(a.price - b.price):(b.price - a.price))
          .reduce((arr, itm) => {
            sumGive += itm.give//isBid?itm.give:itm.get
            sumGet += itm.get//isBid?itm.get:itm.give

            itm.sumGive = sumGive
            itm.sumGet = sumGet

            if (arr.length > 0) {
              let lastItem = arr[arr.length - 1]

              if (lastItem && properComparePrice(lastItem.price, itm.price)) {
                lastItem.sumGive = sumGive
                lastItem.sumGet = sumGet

                lastItem.give += itm.give
                lastItem.get += itm.get

                arr[arr.length - 1] = lastItem
              } else {
                arr.push(itm)
              }
            } else {
              arr.push(itm)
            }
            return arr
          }, [])
          .map(itm => {
            itm.give = sanitizeNDecimals(itm.give, isBid?giveDivisor:getDivisor)
            itm.get = sanitizeNDecimals(itm.get, isBid?getDivisor:giveDivisor)
            itm.sumGive = sanitizeNDecimals(itm.sumGive, isBid?giveDivisor:getDivisor)
            itm.sumGet = sanitizeNDecimals(itm.sumGet, isBid?getDivisor:giveDivisor)
            return itm
          })
        cb(null, {giveAsset: give, getAsset: get, book: res})
      }
    })
  }

  getBlockTimes(data, cb) {
    this.getBlockTimesAsync(data)
      .then(result => {
        cb(result)
      })
      .catch(err => {
        cb(data)
      })
  }

  cachedBtimes = {}

  async getBlockTimesAsync(data) {
    let getbtime = async (height) => new Promise((resolve, reject) => {
      if (height in this.cachedBtimes) {
        this.cachedBtimes[height].lastUsed = Date.now()
        // Purge LRU
        for (let h in this.cachedBtimes) {
          if (Date.now() - this.cachedBtimes[h].lastUsed > 3600000) {
            delete this.cachedBtimes[h]
          }
        }
        resolve(this.cachedBtimes[height].data)
      } else {
        this.indexer('blocktime', { height }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            this.cachedBtimes[height] = {
              lastUsed: Date.now(),
              data
            }
            resolve(data)
          }
        })
      }
    })

    for (let i=0; i < data.length; i++) {
      let bt = await getbtime(data[i].block)
      data[i].time = bt.time
    }

    return data
  }

  async getBlockTimesAsync_old(data) {
    let mapping = {}

    try {
      let bindices = data.map(x => x.block)
      let getBtime = (block) => {
        return new Promise((resolve, reject) => {
          this.indexer('blocktime', { height: block }, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        })
      }

      let btimes = await Promise.all(bindices.map(getBtime))

      btimes.forEach(x => {
        mapping[x.height] = Math.round(x.time/1000)
      })
    } catch(e) {
      console.log('getBlockTimes exception', e)
      throw e
    }

    return data.map( x => ({ time: mapping[x.block] * 1000, ...x}) )
  }

  _recentOrders_proxyPair_(give, get, filters, cb) {
    let endpoint = 'get_orders'
    if (filters.filter(x => x.field === 'source' && x.value === sessionStorageProxy.getItem('currentAddress')).length > 0) {
      endpoint = 'get_my_orders'
    }

    this.proxy(this.proxyPairs[give + '/' + get] + endpoint, {
      give, get, filters
    }, (err, data) => {
      if (err) {
        console.log('ROPP error', err)
        cb(err)
      } else {
        console.log('ROPP', data)
        cb(null, data.map(x => ({
          type: 'buy',
          status: 'filled',
          block: 'tc',
          price: x.price,
          qty: x.funds,
          total: x.volume,
          hash: x.id,
          get: x.volume,
          give: x.funds,
          time: new Date(x.created_at)
        })))
      }
    })
  }

  _recentOrders_(give, get, filters, cb) {
    let proxyGive = give.slice(0, -1)
    let proxyGet = get.slice(0, -1)
    if (this.proxyPairs && ((proxyGive + '/' + proxyGet) in this.proxyPairs)) {
      this._recentOrders_proxyPair_(proxyGive, proxyGet, filters, cb)
      return
    }

    let bidFilters = filters.map(x => x)
    let askFilters = filters.map(x => x)

    bidFilters.push({ "field": "give_asset", "op": "=", "value": give })
    bidFilters.push({ "field": "get_asset", "op": "=", "value": get })
    askFilters.push({ "field": "give_asset", "op": "=", "value": get })
    askFilters.push({ "field": "get_asset", "op": "=", "value": give })

    this.vex('get_orders', {
      filters: bidFilters,
      order_by: 'block_index',
      order_dir: 'DESC',
      limit: 100
    }, (err, bidData) => {
      if (err) {
        cb(err)
      } else {
        let bids = bidData.result.map(x => {
          x.type = 'bid'
          return x
        })

        this.vex('get_orders', {
          filters: askFilters,
          order_by: 'block_index',
          order_dir: 'DESC',
          limit: 100
        }, (err, askData) => {
          if (err) {
            cb(err)
          } else {
            let asks = askData.result.map(x => {
              x.type = 'ask'
              return x
            })
            let totals = bids.concat(asks)
            totals = totals.sort((a, b) => b.block_index - a.block_index)

            processResults(totals)
          }
        })
      }
    })

    let processResults = (data) => {
      let orders = data.filter(itm => !itm.status.startsWith('invalid')).map(itm => {
        if (itm.give_asset === get) {
          let gia = itm.give_asset
          let giq = itm.give_quantity
          let gir = itm.give_remaining

          itm.give_asset = itm.get_asset
          itm.give_quantity = itm.get_quantity
          itm.give_remaining = itm.get_remaining

          itm.get_asset = gia
          itm.get_quantity = giq
          itm.get_remaining = gir
        }

        let giveDivisor = (itm.give_asset in this.fiatTokensDivisor)?this.fiatTokensDivisor[itm.give_asset]:SATOSHIS
        let getDivisor = (itm.get_asset in this.fiatTokensDivisor)?this.fiatTokensDivisor[itm.get_asset]:SATOSHIS
        let type = {'bid': 'buy', 'ask': 'sell'}[itm.type] //(itm.give_asset === get && itm.get_asset === give)?'buy':'sell'

        let giveq = (new BigNumber(itm.give_quantity)).minus(itm.give_remaining).dividedBy(giveDivisor)
        let getq = (new BigNumber(itm.get_quantity)).minus(itm.get_remaining).dividedBy(getDivisor)
        let price

        if (giveq.isZero() || getq.isZero()) {
          let zgeq = (new BigNumber(itm.get_quantity)).dividedBy(getDivisor)
          let zgiq = (new BigNumber(itm.give_quantity)).dividedBy(giveDivisor)
          price = zgeq.dividedBy(zgiq)
        } else {
          price = getq.dividedBy(giveq)
          debug = getq.toString() + ' ' + giveq.toString()
        }

        return {
          type,
          time: false,
          status: itm.status,
          block: itm.block_index,
          price: price.toNumber(),
          qty: getq.toNumber(), //giveq.toNumber(),
          total: giveq.toNumber(), //getq.toNumber(),
          get: itm.get_quantity,
          give: itm.give_quantity,
          hash: itm.tx_hash,
          get_remaining: itm.get_remaining,
          give_remaining: itm.give_remaining,
          pair: itm.give_asset + '/' + itm.get_asset
        }

      }).filter(x => !!x)

      cb(null, orders)

      this.getBlockTimes(orders, (data) => {

        cb(null, data)
      })
    }
  }

  _recentOrderMatches_(give, get, filters, cb) {
    let bidFilters = filters.map(x => x)
    let askFilters = filters.map(x => x)

    bidFilters.push({ "field": "forward_asset", "op": "=", "value": give })
    bidFilters.push({ "field": "backward_asset", "op": "=", "value": get })
    askFilters.push({ "field": "forward_asset", "op": "=", "value": get })
    askFilters.push({ "field": "backward_asset", "op": "=", "value": give })

    this.vex('get_order_matches', {
      filters: bidFilters,
      order_by: 'block_index',
      order_dir: 'DESC',
      limit: 25
    }, (err, bidData) => {
      if (err) {
        cb(err)
      } else {
        let bids = bidData.result.map(x => {
          x.type = 'bid'
          return x
        })

        this.vex('get_order_matches', {
          filters: askFilters,
          order_by: 'block_index',
          order_dir: 'DESC',
          limit: 25
        }, (err, askData) => {
          if (err) {
            cb(err)
          } else {
            let asks = askData.result.map(x => {
              x.type = 'ask'
              return x
            })
            let totals = bids.concat(asks)
            totals = totals.sort((a, b) => b.tx1_block_index - a.tx1_block_index)

            processResults(totals)
          }
        })
      }
    })

    let processResults = (data) => {
      let orders = data.filter(itm => !itm.status.startsWith('invalid')).map(itm => {
        if (itm.forward_asset === get) {
          itm.give_asset = itm.backward_asset
          itm.give_quantity = itm.backward_quantity
          itm.give_remaining = itm.backward_remaining

          itm.get_asset = itm.forward_asset
          itm.get_quantity = itm.forward_quantity
          itm.get_remaining = itm.forward_remaining
        } else {
          itm.give_asset = itm.forward_asset
          itm.give_quantity = itm.forward_quantity
          itm.give_remaining = itm.forward_remaining

          itm.get_asset = itm.backward_asset
          itm.get_quantity = itm.backward_quantity
          itm.get_remaining = itm.backward_remaining
        }

        let giveDivisor = (itm.give_asset in this.fiatTokensDivisor)?this.fiatTokensDivisor[itm.give_asset]:SATOSHIS
        let getDivisor = (itm.get_asset in this.fiatTokensDivisor)?this.fiatTokensDivisor[itm.get_asset]:SATOSHIS
        let type = {'bid': 'buy', 'ask': 'sell'}[itm.type] //(itm.give_asset === get && itm.get_asset === give)?'buy':'sell'

        let giveq = (new BigNumber(itm.give_quantity)).dividedBy(giveDivisor)
        let getq = (new BigNumber(itm.get_quantity)).dividedBy(getDivisor)
        let price = getq.dividedBy(giveq)

        /*if (giveq.isZero() || getq.isZero()) {
          let zgeq = (new BigNumber(itm.get_quantity)).dividedBy(getDivisor)
          let zgiq = (new BigNumber(itm.give_quantity)).dividedBy(giveDivisor)
          price = zgeq.dividedBy(zgiq)
        } else {
          price = getq.dividedBy(giveq)
        }*/

        return {
          type,
          time: false,
          status: 'valid',
          block: itm.tx1_block_index,
          price: price.toNumber(),
          qty: getq.toNumber(), //giveq.toNumber(),
          total: giveq.toNumber(), //getq.toNumber(),
          get: itm.get_quantity,
          give: itm.give_quantity,
          hash: itm.tx1_hash,
          /*get_remaining: itm.get_remaining,
          give_remaining: itm.give_remaining,
          pair: itm.give_asset + '/' + itm.get_asset*/
        }

      }).filter(x => !!x)

      cb(null, orders)

      this.getBlockTimes(orders, (data) => {

        cb(null, data)
      })
    }
  }

  getGlobalRecentOrders(give, get, cb) {
    this._recentOrderMatches_(give, get, [], cb)
  }

  getMyRecentOrders(give, get, addr, cb) {
    if ((typeof(addr) === 'function') && !cb) {
      cb = addr
      addr = null
    }
    let currentAddress = addr || sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    this._recentOrders_(give, get, [
        {
          field: 'source',
          op: '==',
          value: currentAddress
        }
      ], cb)
  }

  getTradeHistory(give, get, cb) {
    this.vexblock('get_trade_history', {
      asset1: give,
      asset2: get,
    }, (err, data) => {
      if (err) {
        cb(err)
      } else if (data.result) {
        let pricePoints = data.result.map(x => {
          return {
            price: x.unit_price,
            date: x.block_time,
            vol: x.base_quantity_normalized
          }
        })
        cb(null, pricePoints)
      } else {
        cb(null, [])
      }
    })
  }

  testDecryptData(data, password) {
    let key = hash.sha256().update(password).digest()
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    let encryptedBytes = Buffer.from(data, 'hex')
    let decryptedBytes = aesCtr.decrypt(encryptedBytes)
    let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

    try {
      let ob = JSON.parse(decryptedText)

      return ob
    } catch(e) {
      return false
    }
  }

  getUser(email, password, cb) {
    let itemKey = `_user_data_${email}_`
    let userData = localStorageProxy.getItem(itemKey)

    let fail = (msg, data) => {
      cb(msg || 'no-user-found', data)
    }

    let success = ({address, mnemonic}) => {
      sessionStorageProxy.setItem('currentAddress', address)
      sessionStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic))
      cb(null, {address, mnemonic})
    }

    let decrypt = (data, dcb) => {
      let key = hash.sha256().update(password).digest()
      let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
      let encryptedBytes = Buffer.from(data, 'hex')
      let decryptedBytes = aesCtr.decrypt(encryptedBytes)
      let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

      try {
        let ob = JSON.parse(decryptedText)

        dcb(null, ob)
      } catch(e) {
        console.log('Bad local password')
        dcb(e)
      }
    }

    let store = (data) => {
      localStorageProxy.setItem(itemKey, data)
    }

    let tryLogin = () => {
      if (userData === null) {
        let husr = hash.sha256().update(email).digest('hex')
        this.axios.get(`/vexapi/user/${husr}`)
          .then((response) => {
            if (response.status === 200) {
              decrypt(response.data.cryptdata, (err, data) => {
                if (err) {
                  console.log('Login challenge', response.data.challenge)
                  fail('bad-data-or-bad-password')
                } else {
                  store(response.data.cryptdata)
                  success(data)
                }
              })
            } else {
              fail('error-request-status')
            }
          })
          .catch(() => {
            fail('error-request')
          })
      } else {
        decrypt(userData, (err, data) => {
          if (err) {
            //fail('bad-data-or-bad-password')
            userData = null
            tryLogin()
          } else {
            success(data)
          }
        })
      }
    }

    tryLogin()
  }

  static keyPairFromMnemonic(mnemonic) {
    let seedHex = bip39.mnemonicToSeedHex(fixAccents(mnemonic))

    let d = bitcoin.crypto.sha256(Buffer.from(seedHex, 'hex'))
    return bitcoin.ECPair.fromPrivateKey(d, {network: bitcoin.networks.testnet})
  }

  sendRegisterPkg(userAddress, pkg, cb) {
    let fail = (err) => {
      cb(err || 'bad-user-data')
    }

    let success = () => {
      cb(null, 'ok')
    }

    this.axios.get(`/vexapi/sesskey/${userAddress}`).then((response) => {
      if (response.status === 200) {
        let key = Buffer.from(response.data.key, 'hex')
        let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
        let msg = JSON.stringify(pkg)
        let textBytes = aesjs.utils.utf8.toBytes(msg)
        let encryptedBytes = aesCtr.encrypt(textBytes)
        let intermediaryHex = aesjs.utils.hex.fromBytes(encryptedBytes)
        let encryptedHex = Buffer.from(intermediaryHex, 'hex').toString('base64')

        //console.log(encryptedHex, '---BYTES--->', encryptedHex.length)
        delete pkg['files']
        this.axios.post(`/vexapi/userdocs/${userAddress}`, {
          data: encryptedHex,
          extraData: pkg
        }).then((data) => {
          success()
        }).catch((err) => {
          fail(err)
        })
      } else {
        fail()
      }
    }).catch((err) => {
      fail(err)
    })
  }

  replaceLocalUser(email, password, mnemonic, uiLang, cb) {
    let husr = hash.sha256().update(email).digest('hex')
    let tries = 2

    let tryReplace = () => {
      this.axios.get(`/vexapi/user/${husr}`)
        .then((response) => {
          let postChallenge = (sigResult) => {
            if (!sigResult) {
              console.log('cant sign', sigResult)
              cb('couldnt-sign')
            } else {
              sessionStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic))
              // TODO: Obtener el usuario guardado en el servidor para tener el challenge y firmarlo
              this.createUser(email, password, uiLang, sigResult, (err, data) => {
                if (err && err === 'bad-signature' && tries > 0) {
                  tries--
                  setImmediate(tryReplace)
                } else {
                  cb(err, data)
                }
              }, 'restore-seed')
            }
          }

          /*if (externalToken) {
            sessionStorageProxy.setItem('device', externalToken.getName())
            externalToken.signMessage(challenge, postChallenge)
          } else {*/
            let keyPair = getKeyPairFromSessionStorage()
            console.log('Challenge to sig:', response.data.challenge)
            let signature = bitcoinMessage.sign(response.data.challenge, keyPair.privateKey, keyPair.compressed)

            let sigResult = signature.toString('base64')

            postChallenge(sigResult)
          //}
        })
        .catch(err => {
          if (err.response.status === 404) {
            localStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic))
            this.createUser(email, password, uiLang, null, (err, data) => {
              if (err) {
                cb(err)
              } else {
                tryReplace()
              }
            }, 'restore-seed')
          } else if (tries > 0) {
            tries--
            setImmediate(tryReplace)
          } else {
            cb(err)
          }
        })
      }

    tryReplace()
  }

  signMessage(msg, cb) {
    let keyPair = getKeyPairFromSessionStorage()
    let signature = bitcoinMessage.sign(msg, keyPair.privateKey, keyPair.compressed)

    cb(null, signature.toString('base64'))
  }

  createUser(email, password, uiLang, signature, cb, reason) {
    let externalToken = null

    if (typeof(password) === "object") {
      externalToken = password
      password = null
    }

    if (typeof(cb) === "undefined") {
      cb = signature
      signature = null
    }

    let itemKey = `_user_data_${email}_`

    if (!cb) {
      cb = uiLang
      uiLang = this.lang
    }

    let fail = (err) => {
      cb(err || 'bad-user-data')
    }

    let completeRegister = (encryptedHex, address, mnemonic) => {
      let husr = hash.sha256().update(email).digest('hex')

      let success = () => {
        if (externalToken) {
          sessionStorageProxy.setItem('device', externalToken.getName())
          localStorageProxy.setItem(itemKey, externalToken.getName())
          cb(null, {address, device: externalToken.getName()})
        } else {
          sessionStorageProxy.setItem('device', 'userpass')
          sessionStorageProxy.setItem('currentAddress', address)
          sessionStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic))
          localStorageProxy.setItem(itemKey, encryptedHex)
          let keyPair = VexLib.keyPairFromMnemonic(mnemonic)
          cb(null, {address, mnemonic, keyPair})
        }
      }

      this.axios.post(`/vexapi/user`, {
        userid: husr,
        email,
        cryptdata: encryptedHex,
        address, signature,
        reason
      }).then((response) => {
        if (response.status === 200) {
          if (response.data.error) {
            fail(response.data.error)
          } else {
            success()
          }
        } else {
          fail()
        }
      }).catch((err) => {
        fail(err)
      })
    }

    if (externalToken) {
      externalToken.getAddress((address) => {
        if (!address) {
          fail('cant-comm-token')
        } else {
          let pkg = {address, token: externalToken.getName()}
          let msg = JSON.stringify(pkg)
          completeRegister(null, address)
        }
      })
    } else {
      let mnemonic

      mnemonic = sessionStorageProxy.getItem('currentMnemonic')
      if (!mnemonic) {
        mnemonic = bip39.generateMnemonic(null, null, bip39.wordlists[uiLang])
      }

      let keyPair = VexLib.keyPairFromMnemonic(mnemonic)
      let {address} = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet }) //keyPair.getAddress()

      let pkg = {address, mnemonic, lang: uiLang}
      let msg = JSON.stringify(pkg)

      let key = hash.sha256().update(password).digest()
      let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
      let textBytes = aesjs.utils.utf8.toBytes(msg)
      let encryptedBytes = aesCtr.encrypt(textBytes)
      let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

      completeRegister(encryptedHex, address, mnemonic)
    }
  }

  proxy_createOrder(currentAddress, giveAsset, giveAmount, getAsset, getAmount, cb) {
    if (!this.proxyAgent) {
      console.log('Error: Proxy agent not configured on server')
      cb(new Error('Proxy agent not configured on server'))
      return
    }

    this.vex('create_send', {
      source: currentAddress,
      destination: this.proxyAgent,
      asset: giveAsset,
      quantity: giveAmount,
      memo: `PRX:OP:${getAsset}:${getAmount}`
    }, (err, data) => {
      if (err) {
        console.log('Error on Proxy create order', err)
        cb(err)
      } else if (data.error) {
        console.log('Soft Error on Proxy create order', data.error)
        cb(data.error)
      } else {
        cb(null, data.result)
      }
    })
  }

  createOrder(giveAsset, giveAmount, getAsset, getAmount, cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let proxyGive = giveAsset.slice(0, -1)
    let proxyGet = getAsset.slice(0, -1)

    let pair = proxyGive + '/' + proxyGet
    let invertedPair = proxyGet + '/' + proxyGive
    if (this.proxyPairs && (pair in this.proxyPairs || invertedPair in this.proxyPairs)) {
      this.proxy_createOrder(currentAddress, giveAsset, giveAmount, getAsset, getAmount, cb)
      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb(err || 'error-creating-order')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    let doCall = async () => {
      let res = await xcpjsv2.order(currentAddress, giveAsset, giveAmount, getAsset, getAmount)
      success(res)
    }

    doCall()
  }

  cancelOrder(txid, cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = (err) => {

      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb('error-creating-cancel')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    let doCall = async () => {
      let res = await xcpjsv2.cancel(currentAddress, txid)
    }

    doCall()
  }

  reportFiatDeposit(getToken, getAmount, depositId, bankName, files, cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = (err) => {

      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      console.log(err)

      cb('error-creating-report: ' + err)
    }

    let success = (txid) => {
      cb(null, txid)
    }

    let uploadData = (txid) => {
      this.axios.get(`/vexapi/sesskey/${currentAddress}`).then((response) => {
        if (response.status === 200) {
          let key = Buffer.from(response.data.key, 'hex')
          let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
          let msg = JSON.stringify(files)
          let textBytes = aesjs.utils.utf8.toBytes(msg)
          let encryptedBytes = aesCtr.encrypt(textBytes)
          let intermediaryHex = aesjs.utils.hex.fromBytes(encryptedBytes)
          let encryptedHex = Buffer.from(intermediaryHex, 'hex').toString('base64')

          //console.log(encryptedHex, '---BYTES--->', encryptedHex.length)
          this.axios.post(`/vexapi/deprep/${currentAddress}`, {
            data: encryptedHex,
            txid
          }).then((data) => {
            success(txid)
          }).catch((err) => {
            fail(err)
          })
        } else {
          fail()
        }
      }).catch((err) => {
        fail(err)
      })
    }

    let doCall = async () => {
      let res = await xcpjsv2.broadcast(currentAddress, Math.floor(Date.now()/1000), 0, null, `${getToken}:${getAmount}:${depositId}:${bankName}`)
      uploadData(res.data.result)
    }

    doCall()
  }

  generateWithdrawal(token, amount, address, info, cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb(err || 'error-generating-withdrawal')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    let memo
    let isHex = false

    let validate = (addr, net) => {
      if (net === 'NEM') {
        return (address.indexOf('N') == 0 || address.indexOf('n') == 0)  && address.length == 40
      } else {
        try {
          let decaddr = bs58.decode(addr)
          console.log('Decoded addr', decaddr)

          return true
        } catch (e) {
          return false
        }
      }
    }

    if (token in this.fiatTokensDivisor) {
      memo = `v2:f:${address}:${info}`
    } else {
      let tokNet = token.slice(0, -1)

      if (validate(address, tokNet)) {
        if (!info) {
          info = ''
        }
        memo = `v2:c:${address}:${info}`
      } else {
        cb('invalid-address')
        return
      }
    }

    let divisor = SATOSHIS
    if (token in this.fiatTokensDivisor) {
      divisor = this.fiatTokensDivisor[token]
    }
    amount = Math.round(parseFloat(amount) * divisor)

    let doCall = async () => {
      let res = await xcpjsv2.send(currentAddress, this.unspendableAddress, token, amount, memo, isHex)
      success(res)
    }

    doCall()
  }

  generateTransfer(token, amount, destination, memo, twofa, cb) {
    if (!cb && twofa && typeof(twofa) === 'function') {
      cb = twofa
      twofa = null
    }
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb(err || 'error-generating-transfer')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    let validate = (addr, net) => {
      try {
        let decaddr = bs58.decode(addr)
        console.log('Decoded addr', decaddr)

        return true
      } catch (e) {
        return false
      }
    }

    let divisor = SATOSHIS
    if (token in this.fiatTokensDivisor) {
      divisor = this.fiatTokensDivisor[token]
    }
    amount = Math.round(parseFloat(amount) * divisor)

    let csOb = {
      source: currentAddress,
      destination, asset: token, quantity: amount, memo
    }

    if (twofa) {
      csOb.twofa = twofa
    }

    let doCall = async () => {
      let res = await xcpjsv2.send(csOb.source, csOb.destination, csOb.asset, csOb.quantity, csOb.memo)
      success(res.data.result)
    }

    doCall()
  }

  getFiatDepositReports(cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = () => {
      cb('error-getting-deposit-reports')
    }

    let success = (deposits) => {
      cb(null, deposits)
    }

    this.axios.get(`/vexapi/reports/${currentAddress}`)
      .then((response) => {
        success(response.data.result.map(x => {
          try {
            let [fiat, amount, depositid] = x.text.split(':')

            return {
              fiat, amount, depositid
            }
          } catch(e) {
            return { error: 'malformed-deposit' }
          }
        }))
      })
      .catch(() => {
        fail()
      })
  }


  getWithdraws(addr, cb) {
    if (!cb && typeof(addr) === 'function') {
      cb = addr
      addr = null
    }

    let currentAddress = addr || sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')

      return
    }

    let fail = () => {
      cb('error-getting-withdrawals')
    }

    let success = (transactions) => {
      cb(null, transactions)
    }

    this.axios.get(`/vexapi/withdraws/${currentAddress}`).then((response) => {
      if (response.status === 200) {
        success(response.data)
      } else {
        fail()
      }
    }).catch(() => {
      fail()
    })
  }

  getDeposits(addr, cb) {
    if (!cb && typeof(addr) === 'function') {
      cb = addr
      addr = null
    }

    let currentAddress = addr || sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')

      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb(err || 'error-getting-deposits')
    }

    let success = (transactions) => {
      cb(null, transactions)
    }

    this.axios.get(`/vexapi/deposits/${currentAddress}`).then((response) => {
      if (response.status === 200) {
        success(response.data)
      } else {
        fail()
      }
    }).catch((err) => {
      fail(err)
    })
  }

  generateTokenDepositAddress(token, cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')

      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb(err || 'error-getting-deposits')
    }

    let success = (status) => {
      cb(null, status)
    }

    let doCall = async () => {
      let res = await xcpjsv2.broadcast(currentAddress, Math.floor(Date.now()/1000), 0, null, `GENADDR:${token}`)
      success(res)
    }

    doCall()
  }

  getTokenDepositAddress(token, cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')

      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb(err || 'error-getting-deposits')
    }

    let success = (data) => {
      cb(null, data)
    }

    this.vex('get_broadcasts', {
      filters: [
        {
          field: 'text',
          op: 'LIKE',
          value: `A:${currentAddress}:${token}:%`
        },
        {
          field: 'source',
          op: '==',
          value: this.issuanceAddress
        }
      ],
      order_by: 'tx_index',
      order_dir: 'DESC',
      status: 'valid'
    }, (err, data) => {
      if (err) {
        fail(err)
      } else {
        success(data)
      }
    })
  }

  getChallenge(cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('needs-html-login-first')

      return
    }

    let fail = (msg) => {
      cb(msg || 'error-getting-challenge')
    }

    let success = (challenge) => {
      cb(null, challenge)
    }

    console.log('Current address:', currentAddress)
    this.axios.get(`/vexapi/challenge/${currentAddress}`).then((response) => {
      if (response.status === 200) {
        success(response.data.challenge)
      } else {
        fail('bad-status-get-challenge')
      }
    }).catch((err) => {
      console.log(err)
      fail()
    })
  }

  localLogin(ops, cb) {
    let externalToken = null
    let twofacode = null

    if (typeof(cb) === 'undefined') {
      cb = ops
      ops = null
    }

    if (ops &&  typeof(ops) === 'string') {
      externalToken = ops
    } else if (ops && typeof(ops) === 'object') {
      externalToken = ops['externalToken'] || null
      twofacode = ops['twofacode'] || null
    }

    let sign = (currentAddress) => {
      sessionStorageProxy.setItem('currentAddress', currentAddress)
      this.getChallenge((err, challenge) => {
        if (err) {
          console.log('Error getting challenge')
          cb(err)
        } else {
          let postChallenge = (sigResult) => {
            if (!sigResult) {
              console.log('cant sign', sigResult)
              cb('couldnt-sign')
            } else {
              console.log('signature ready, posting')
              this.axios.post(`/vexapi/challenge/${currentAddress}`, {signature: sigResult}).then((response) => {
                console.log('Got response from sig', response)
                if (response.data.success) {
                  this.axios = defaultAxios({headers: {
                    'addr': currentAddress,
                    'token': response.data.accessToken
                  }})

                  /*if (!this._is_authed_) {
                    this.emit('needauth')
                  }*/

                  this.userEnabled((err, isEnabled) => {
                    if (err) {
                      cb(err)
                    } else {
                      if (isEnabled) {
                        this._authed_()
                        this.socket.emit('auth', { address: currentAddress, token: response.data.accessToken, twofa: twofacode })

                        let device = sessionStorageProxy.getItem('device')

                        if ((device === 'userpass') || (device === null)) {
                          xcpjsv2.services.transactionSigner.registerSigner(currentAddress, async tx => {
                            let keyPair = getKeyPairFromSessionStorage()
                            let signedHex = await new Promise((resolve) => buildAndSign(keyPair, tx, resolve))

                            return signedHex
                          })
                        } else if (device === 'trezor') {
                          xcpjsv2.services.transactionSigner.registerSigner(currentAddress, async tx => {
                            let Trezor = devices[device](0)

                            let signedHex = await new Promise((resolve, reject) => {
                              console.log('Signer TRZR', tx)
                                Trezor.signTx(tx.__tx.ins, tx.__tx.outs, (err, tx) => {
                                if (err) {
                                  console.log('Trezor ERR:')
                                  console.log(err)
                                  console.trace()
                                  reject(null)
                                } else {
                                  console.log('Serialized TX:', tx)

                                  resolve(tx)
                                }
                              })
                            })

                            return signedHex
                          })
                        }

                        cb(null, response.data)
                      } else {
                        cb('user-not-enabled')
                      }
                    }
                  })
                } else {
                  console.log('challenge error', response.data)
                  cb('challenge-error')
                }
              }).catch(err => {
                console.log('challenge exception', err)
                cb(err)
              })
            }
          }

          if (externalToken) {
            sessionStorageProxy.setItem('device', externalToken.getName())
            externalToken.signMessage(challenge, postChallenge)
          } else {
            let keyPair = getKeyPairFromSessionStorage()
            let signature = bitcoinMessage.sign(challenge, keyPair.privateKey, keyPair.compressed)

            let sigResult = signature.toString('base64')

            postChallenge(sigResult)
          }
        }
      })
    }

    if (!externalToken) {
      sign(sessionStorageProxy.getItem('currentAddress'))
    } else {
      externalToken.getAddress(sign)
    }
  }

  remoteLogin(email, password, externalToken, cb) {
    let ob = {}
    if (typeof(cb) === "undefined") {
      cb = externalToken
      externalToken = null
    } else {
      ob.externalToken = externalToken
    }

    if (email.indexOf("\n") > 0) {
      let spl = email.split("\n")
      email = spl[0]
      ob.twofacode = spl[1]
    }

    if (externalToken) {
      this.localLogin({externalToken}, cb)
    } else {
      this.getUser(email, password, (err, userData) => {
        if (err) {
          if (err === 'bad-data-or-bad-password') {
            console.log('Attempting local only login')
            this.localLogin(ob, cb)
          } else {
            console.log('Unrecoverable error while trying to login', email)
            cb(err)
          }
        } else {
          console.log('Attempting local only login')
          this.localLogin(ob, cb)
        }
      })
    }
  }

  remoteLogout(cb) {
    let currentAddress = sessionStorageProxy.getItem('currentAddress')

    if (!currentAddress) {
      cb('needs-html-login-first')

      return
    }

    this.axios.get(`/vexapi/logout`)
      .then(() => {
        this.axios = defaultAxios()
        sessionStorageProxy.removeItem('currentAddress')
        sessionStorageProxy.removeItem('currentMnemonic')
        xcpjsv2.services.transactionSigner.unregisterSigner(currentAddress)
        cb(null, true)
      })
      .catch((err) => {
        this.axios = defaultAxios()
        sessionStorageProxy.removeItem('currentAddress')
        sessionStorageProxy.removeItem('currentMnemonic')
        cb(err)
      })
  }

  getTokens(cb) {
    this.vex('get_asset_names', {}, (err, data) => {
      if (err) {
        cb(err)
      } else {
        cb(null, data.result.filter(x => !((x[0] === 'A') || (x[x.length-1] !== 'T')) ))
      }
    })
  }

  getFees(give, get, cb) {
    let value

    if (give === '*') {
      value = 'options fee:%:%'
    } else {
      value = `options fee:%:%:${give}:${get}`.toLowerCase()
    }

    this.vex('get_broadcasts', {
      filters: [
        {
          field: 'text',
          op: 'LIKE',
          value
        },
        {
          field: 'source',
          op: '==',
          value: this.exchangeAddress
        }
      ],
      status: 'valid'
    }, (err, data) => {
      if (err) {
        cb(err)
      } else {
        if (data.result.length > 0) {
          let text = data.result.pop().text
          let structure = /options fee:(0\.\d+):(0\.\d+):?([a-zA-Z]{4,12})?:?([a-zA-Z]{4,12})?/.exec(text)

          if (structure.length !== 5) {
            cb('no-fee')
          } else {
            cb(null, {
              feeMaker: structure[1],
              feeTaker: structure[2]
            })
          }
        } else {
          cb('no-fee')
        }
      }
    })
  }

  setFee(giveAsset, getAsset, feeMaker, feeTaker, cb) {
    this.db('set_fee', {
      giveAsset, getAsset,
      feeMaker, feeTaker
    }, (err, data) => {
      if (err) {
        console.log('SETFEE', err)
        cb(err)
      } else {
        cb(null, data)
      }
    })
  }

  getWIF() {
    let device = sessionStorageProxy.getItem('device')

    if ((device === 'userpass') || (device === null)) {
      let keyPair = getKeyPairFromSessionStorage()
      if (keyPair) {
        return keyPair.toWIF()
      } else {
        return null
      }
    } else {
      return null
    }
  }

  createSendFromWif(wif, quantity, destination, asset, cb) {
    let keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet)

    let finish = (rawHex) => {
      let tx = bitcoin.Transaction.fromHex(rawHex)

      buildAndSign(keyPair, tx, (signed) => {
        this.axios.post('/vexapi/ext_sendtx', {
          rawtx: signed
        }).then((response) => {
          cb(null, response.data.result)
        }).catch(err => {
          cb(err)
        })
      })
    }

    this.vex('create_send', {
      source: keyPair.getPublicKeyBuffer().toString('hex'),
      destination, asset, quantity
    }, (err, data) => {
      if (err) {
        console.log('err', err)
        cb(err)
      } else if (data.error) {
        console.log('err', data.error)
        cb(data.error)
      } else {
        console.log('data', data.result)
        //cb(null, data.result)
        finish(data.result)
      }
    })
  }

  addressFromMnemonic(mnemonic) {
    let keyPair = VexLib.keyPairFromMnemonic(mnemonic)
    let {address} = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet })

    return address
  }

  setExperiments(n) {
    localStorageProxy.setItem('experiments', n)
    this.experiments = n === '1'

    axios.defaults.headers.common['test'] = this.experiments?'1':'0'
  }

  getCurrentStorage() {
    return {
      local: localStorageProxy,
      session: sessionStorageProxy
    }
  }
}
