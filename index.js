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
import {BigNumber} from 'bignumber.js'

const build="${BUILD}"

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

var baseUrl = ((window.location.hostname === 'localhost') || (checkIp(window.location.hostname).isRfc1918))?`http://${window.location.hostname}:8085`:window.location.origin

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
  let mnemonic = sessionStorage.getItem('currentMnemonic')
  let seedHex = bip39.mnemonicToSeedHex(fixAccents(mnemonic))
  let d = bitcoin.crypto.sha256(Buffer.from(seedHex, 'hex'))
  return bitcoin.ECPair.fromPrivateKey(d, {network: bitcoin.networks.testnet})
}

var devices = {}

function buildAndSign(keyPair, tx, cb) {
  let builder = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)

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
  let device = sessionStorage.getItem('device')
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

  constructor(options) {
    super()

    this.lang = options.lang || 'EN'
    this.exchangeAddress = options.exchangeAddress || ''

    console.log('VexLib init', this.lang, this.exchangeAddress, build)

    this.axios = defaultAxios()

    this.lastVexSeq = 0
    this.cbList = {}
    this.fiatTokensDivisor = {
      VEFT: 100,
      VEST: 100
    }

    this._is_connected_ = false
    this._is_authed_ = false
    this._call_list_ = []

    this.sKeyPairFromMnemonic = VexLib.keyPairFromMnemonic

    this.axios.get('/config')
      .then((response) => {
        if (response.data.exchangeAddress) {
          console.log('Config loaded', response.data)

          this.exchangeAddress = response.data.exchangeAddress

          this._start_socket_()
        } else {
          this.axios.get('/vexapi/config')
            .then((response) => {
              if (response.data.exchangeAddress) {
                console.log('Config loaded', response.data)

                this.exchangeAddress = response.data.exchangeAddress

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
    this.socket.on('need2fa', (data) => this.emit('need2fa', data))
    this.socket.on('needauth', (data) => this.emit('needauth', data))
    this.socket.on('authok', () => { this.emit('authok'); this._authed_() })
  }

  consumeCallList = () => {
    console.log('Consuming call list')
    let call = this._call_list_.shift()
    if (call) {
      call()
      setImmediate(this.consumeCallList)
    }
  }

  _socket_connect_ = () => {
    console.log('Socket connected')
    this._is_connected_ = true

    if (this._is_connected_) {
      this.consumeCallList()
    }
  }

  _authed_ = () => {
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

  _socket_updates_ = (updates) => {
    this.emit('updates', updates)
  }

  hasEmittedNeedauth = false
  _api_(entry, method, params, cb) {
    this.cbList[this.lastVexSeq] = cb

    let doCall = ((seq) => () => {
      this.socket.emit(entry, {
        method,
        params,
        seq
      })
    })(this.lastVexSeq)

    this.lastVexSeq++

    if (this._is_connected_) {
      doCall()
    } else {
      console.trace(`Postergating ${entry} call because socket is not connected`)
      this._call_list_.push(doCall)
      if (!this.hasEmittedNeedauth) {
        this.hasEmittedNeedauth = true
        setTimeout(() => {
          this.emit('needauth')
        }, 500)
      }
    }
  }

  vex(method, params, cb) {
    this._api_('vex', method, params, cb)
  }

  vexblock(method, params, cb) {
    this._api_('vexblock', method, params, cb)
  }

  db(method, params, cb) {
    this._api_('db', method, params, cb)
  }

  ldb(method, params, cb) {
    this._api_('ldb', method, params, cb)
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
    let currentAddress = sessionStorage.getItem('currentAddress')

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
    let currentAddress = sessionStorage.getItem('currentAddress')

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

    this.vex('get_unspent_txouts', {
      address: currentAddress,
      unconfirmed: true
    }, (err, data) => {
      //console.log('Got from utxo', err, data)
      if (err) {
        cb(err)
      } else {
        console.log(data)
        cb(null, data.result && data.result.length > 0)
      }
    })
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

            let lastItem = arr[arr.length - 1]

            if (lastItem && (lastItem.price == itm.price)) {
              lastItem.sumGive = sumGive
              lastItem.sumGet = sumGet
              lastItem.give += itm.give
              lastItem.get += itm.get
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

      /*this.axios.post(`/vexapi/blocktimes`, {
        data: data.map(x => x.block)
      }).then((btimes) => {
        let mapping = {}
        btimes.data.forEach(x => {
          mapping[x.block_index] = x.time
        })
        cb(data.map( x => ({ time: mapping[x.block] * 1000, ...x}) ))
      }).catch((err) => {
        console.log(err)
        cb(data)
      })*/
  }

  async getBlockTimesAsync(data) {
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
    if (filters.filter(x => x.field === 'source' && x.value === sessionStorage.getItem('currentAddress')).length > 0) {
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
    }

    this.vex('get_orders', {
      filters,
      order_by: 'block_index',
      order_dir: 'DESC',
      limit: 100
    }, (err, data) => {
      if (err) {
        cb(err)
      } else {
        let orders = data.result.filter(itm => !itm.status.startsWith('invalid')).map(itm => {
          let type, price, giq, geq

          let giveIsFiat = itm.give_asset in this.fiatTokensDivisor
          let getIsFiat = itm.get_asset in this.fiatTokensDivisor

          let giveDivisor = giveIsFiat?this.fiatTokensDivisor[itm.give_asset]:SATOSHIS
          let getDivisor = getIsFiat?this.fiatTokensDivisor[itm.get_asset]:SATOSHIS

          let swapDivider = false

          if (itm.give_asset === give && itm.get_asset === get) {
            type = 'sell'

            if (itm.give_quantity === itm.give_remaining) {
              giq = itm.give_quantity
            } else {
              giq = itm.give_quantity - itm.give_remaining
            }

            if (itm.get_quantity === itm.get_remaining) {
              geq = itm.get_quantity
            } else {
              geq = itm.get_quantity - itm.get_remaining
            }

            let pgege = new BigNumber(geq).dividedBy(getDivisor)
            let pgigi = new BigNumber(giq).dividedBy(giveDivisor)

            price = pgege.dividedBy(pgigi).toNumber() //(geq / getDivisor) / (giq / giveDivisor)

            swapDivider = true
          } else if (itm.give_asset === get && itm.get_asset === give) {
            type = 'buy'
            if (itm.get_quantity === itm.get_remaining) {
              giq = itm.get_quantity
            } else {
              giq = itm.get_quantity - itm.get_remaining
            }

            if (itm.give_quantity === itm.give_remaining) {
              geq = itm.give_quantity
            } else {
              geq = itm.give_quantity - itm.give_remaining
            }

            let pgige = new BigNumber(giq).dividedBy(getDivisor)
            let pgegi = new BigNumber(geq).dividedBy(giveDivisor).dividedBy(pgige)

            price = pgegi.toNumber() //(geq / giveDivisor) / (giq / getDivisor) //(giq / giveDivisor) / (geq / getDivisor)
          } else {
            return undefined
          }

          return {
            type,
            status: itm.status,
            block: itm.block_index,
            price,
            qty: divideLimited(giq, swapDivider?giveDivisor:getDivisor),
            total: divideLimited(geq, swapDivider?getDivisor:giveDivisor),
            get: itm.get_quantity,
            give: itm.give_quantity,
            hash: itm.tx_hash
          }
        }).reduce((arr, itm) => {
          if (itm) {
            arr.push(itm)
          }

          return arr
        }, [])

        this.getBlockTimes(orders, (data) => {
          cb(null, data)
        })
      }
    })
  }

  getGlobalRecentOrders(give, get, cb) {
    this._recentOrders_(give, get, [], cb)
  }

  getMyRecentOrders(give, get, addr, cb) {
    if ((typeof(addr) === 'function') && !cb) {
      cb = addr
      addr = null
    }
    let currentAddress = addr || sessionStorage.getItem('currentAddress')

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
    let userData = localStorage.getItem(itemKey)

    let fail = (msg, data) => {
      cb(msg || 'no-user-found', data)
    }

    let success = ({address, mnemonic}) => {
      sessionStorage.setItem('currentAddress', address)
      sessionStorage.setItem('currentMnemonic', fixAccents(mnemonic))
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
      localStorage.setItem(itemKey, data)
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
              sessionStorage.setItem('currentMnemonic', fixAccents(mnemonic))
              // TODO: Obtener el usuario guardado en el servidor para tener el challenge y firmarlo
              this.createUser(email, password, uiLang, sigResult, (err, data) => {
                if (err && err === 'bad-signature' && tries > 0) {
                  tries--
                  setImmediate(tryReplace)
                } else {
                  cb(err, data)
                }
              })
            }
          }

          /*if (externalToken) {
            sessionStorage.setItem('device', externalToken.getName())
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
          if (tries > 0) {
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

  createUser(email, password, uiLang, signature, cb) {
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
          sessionStorage.setItem('device', externalToken.getName())
          localStorage.setItem(itemKey, externalToken.getName())
          cb(null, {address, device: externalToken.getName()})
        } else {
          sessionStorage.setItem('device', 'userpass')
          sessionStorage.setItem('currentAddress', address)
          sessionStorage.setItem('currentMnemonic', fixAccents(mnemonic))
          localStorage.setItem(itemKey, encryptedHex)
          let keyPair = VexLib.keyPairFromMnemonic(mnemonic)
          cb(null, {address, mnemonic, keyPair})
        }
      }

      this.axios.post(`/vexapi/user`, {
        userid: husr,
        email,
        cryptdata: encryptedHex,
        address, signature
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

      mnemonic = sessionStorage.getItem('currentMnemonic')
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

  createOrder(giveAsset, giveAmount, getAsset, getAmount, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
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

    this.axios.post('/vexapi/order', {
      "give_asset": giveAsset,
      "give_quantity": giveAmount,
      "get_asset": getAsset,
      "get_quantity": getAmount,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        signTransaction(response.data.result, (signed) => {
          this.axios.post('/vexapi/sendtx', {
            rawtx: signed
          }).then((response) => {
            success(response.data.result)
          })
        })
      } else {
        fail('error-creating-order-bad-response')
      }
    }).catch((err) => {
      fail(err)
    })
  }

  cancelOrder(txid, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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

    this.axios.post('/vexapi/cancelorder', {
      "offer_hash": txid,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        signTransaction(response.data.result, (signed) => {
          this.axios.post('/vexapi/sendtx', {
            rawtx: signed
          }).then((resp) => {
            if (resp.data.error) {
              fail(resp.data.error)
            } else {
              console.log('Success cancel', resp.data.result)
              success(resp.data.result)
            }
          })
        })
      } else {
        fail()
      }
    }).catch((err) => {
      fail(err)
    })
  }

  reportFiatDeposit(getToken, getAmount, depositId, bankName, files, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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

      cb('error-creating-report')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    this.axios.post('/vexapi/report', {
      "text": `${getToken}:${getAmount}:${depositId}:${bankName}`,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        signTransaction(response.data.result, (signed) => {
          return this.axios.post('/vexapi/sendtx', {
            rawtx: signed
          }).then((response) => {
            let txid = response.data.result

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
          })
        })
      } else {
        fail()
      }
    }).catch((err) => {
      fail(err)
    })
  }

  generateWithdrawal(token, amount, address, info, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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
      /*try {
        bs58.decode(addr)

        return true
      } catch (e) {
        // Could be a NEM address
        if ((address.indexOf('N') == 0 || address.indexOf('T') == 0 || address.indexOf('n') == 0 || address.indexOf('t') == 0)  && address.length == 46) {
          return true
        } else {
          return false
        }
      }*/
    }

    if (token in this.fiatTokensDivisor) {
      memo = `v2:f:${address}:${info}`
    } else {
      let tokNet = token.slice(0, -1)

      if (tokNet === 'PTR') {
        tokNet = 'NEM'
        address = address.split('-').join('')
      }

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

    /*if (info && (info.length > 0)) {
      memo = `${address}:${info}`
      isHex = false
    } else {
      try {
        memo = bs58.decode(address).toString('hex')
        isHex = true
      } catch (e) {
        cb('invalid-address')
        return
      }
    }

    if ((!isHex && memo.length > 31) || (isHex && memo.length > 62)) {
      cb('memo-too-big')
      return
    }*/

    let divisor = SATOSHIS
    if (token in this.fiatTokensDivisor) {
      divisor = this.fiatTokensDivisor[token]
    }
    amount = Math.round(parseFloat(amount) * divisor)

    this.axios.post('/vexapi/withdraw', {
      "asset": token,
      "quantity": amount,
      "memo": memo,
      "memo_is_hex": isHex,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        if (response.data.error) {
          fail(response.data.error)
        } else if (!response.data) {
          fail(response.error)
        } else {
          signTransaction(response.data.result, (signed) => {
            this.axios.post('/vexapi/sendtx', {
              rawtx: signed
            }).then((response) => {
              success(response.data.result)
            })
          })
        }
      } else {
        fail('error-building-tx')
      }
    }).catch((err) => {
      fail(err)
    })
  }

  generateTransfer(token, amount, destination, memo, twofa, cb) {
    if (!cb && twofa && typeof(twofa) === 'function') {
      cb = twofa
      twofa = null
    }
    let currentAddress = sessionStorage.getItem('currentAddress')

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

    this.vex('create_send', csOb, (err, data) => {
      if (err) {
        console.log('err', err)
        fail(err)
      } else if (data.error) {
        console.log('err', data.error)
        fail(data.error)
      } else {
        signTransaction(data.result, (signed) => {
          this.axios.post('/vexapi/sendtx', {
            rawtx: signed
          }).then((response) => {
            success(response.data.result)
          }).catch((err) => {
            fail(err)
          })
        })
      }
    })

    /*this.axios.post('/vexapi/withdraw', {
      "asset": token,
      "quantity": amount,
      "memo": memo,
      "memo_is_hex": isHex,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        if (response.data.error) {
          fail(response.data.error)
        } else if (!response.data) {
          fail(response.error)
        } else {
          signTransaction(response.data.result, (signed) => {
            this.axios.post('/vexapi/sendtx', {
              rawtx: signed
            }).then((response) => {
              success(response.data.result)
            })
          })
        }
      } else {
        fail('error-building-tx')
      }
    }).catch((err) => {
      fail(err)
    })*/
  }

  generateCodeWithdrawal(token, amount, code, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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

    let memo = `admin:${code}`

    if (memo.length > 31) {
      cb('memo-too-big')
      return
    }

    if (token in this.fiatTokensDivisor) {
      divisor = this.fiatTokensDivisor[token]
    }
    amount = Math.round(parseFloat(amount) * divisor)

    this.axios.post('/vexapi/withdraw', {
      "asset": token,
      "quantity": amount,
      "memo": memo,
      "memo_is_hex": false,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        if (response.data.error) {
          fail(response.data.error)
        } else {
          signTransaction(response.data.result, (signed) => {
            return this.axios.post('/vexapi/sendtx', {
              rawtx: signed
            })
          })
        }
      } else {
        fail('error-building-tx')
      }
    }).then((response) => {
      success(response.data.result)
    }).catch((err) => {
      fail(err)
    })
  }

  generatePaymentBill(token, quantity, concept, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = (err) => {
      if (err.response && (err.response.status === 401)) {
        this.emit('need-login')
      }

      cb('error-creating-report')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    this.axios.post('/vexapi/report', {
      "text": `${token}:${quantity}:${concept}`,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        signTransaction(response.data.result, (signed) => {
          return this.axios.post('/vexapi/sendtx', {
            rawtx: signed
          })
        })
      } else {
        fail()
      }
    }).then((response) => {
      success(response.data.result)
    }).catch((err) => {
      fail(err)
    })
  }

  getFiatDepositReports(cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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

    let currentAddress = addr || sessionStorage.getItem('currentAddress')

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

    let currentAddress = addr || sessionStorage.getItem('currentAddress')

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
    let currentAddress = sessionStorage.getItem('currentAddress')

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

    this.vex('create_broadcast', {
      source: currentAddress,
      text: `GENADDR:${token}`,
      fee_fraction: 0,
      fee: 10000,
      timestamp: Math.floor(Date.now()/1000),
      value: 0
    }, (err, data) => {
      if (err) {
        fail(err)
      } else {
        signTransaction(data.result, (signedTransaction) => {
          this.axios.post('/vexapi/sendtx', {
            rawtx: signedTransaction
          }).then((response) => {
            success(response.data.result)
          }).catch(err => {
            fail(err)
          })
        })
      }
    })
  }

  getTokenDepositAddress(token, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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
          value: this.exchangeAddress
        }
      ],
      order_by: 'tx_index',
      order_dir: 'DESC'
    }, (err, data) => {
      if (err) {
        fail(err)
      } else {
        success(data)
      }
    })
  }

  getChallenge(cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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
      sessionStorage.setItem('currentAddress', currentAddress)
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

                  if (!this._is_authed_) {
                    this.emit('needauth')
                  }

                  this.userEnabled((err, isEnabled) => {
                    if (err) {
                      cb(err)
                    } else {
                      if (isEnabled) {
                        this.socket.emit('auth', { address: currentAddress, token: response.data.accessToken, twofa: twofacode })
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
            sessionStorage.setItem('device', externalToken.getName())
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
      sign(sessionStorage.getItem('currentAddress'))
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
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('needs-html-login-first')

      return
    }

    this.axios.get(`/vexapi/logout`)
      .then(() => {
        this.axios = defaultAxios()
        sessionStorage.removeItem('currentAddress')
        sessionStorage.removeItem('currentMnemonic')
        cb(null, true)
      })
      .catch((err) => {
        this.axios = defaultAxios()
        sessionStorage.removeItem('currentAddress')
        sessionStorage.removeItem('currentMnemonic')
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
      ]
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
    let device = sessionStorage.getItem('device')

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
}
