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

import { SATOSHIS, softLimit8Decimals, sanitizeDecimals } from './util'

var baseUrl = 'https://vex.xcp.host'

function defaultAxios(ob) {
  if (!ob) {
    ob = {}
  }

  ob.baseURL = baseUrl

  return axios.create(ob)
}

function getKeyPairFromSessionStorage() {
  let mnemonic = sessionStorage.getItem('currentMnemonic')
  let seedHex = bip39.mnemonicToSeedHex(mnemonic)
  let d = bigi.fromBuffer(bitcoin.crypto.sha256(Buffer.from(seedHex, 'hex')))
  return new bitcoin.ECPair(d, null, {network: bitcoin.networks.testnet})
}

function signTransaction(rawHex) {
  let tx = bitcoin.Transaction.fromHex(rawHex)
  let keyPair = getKeyPairFromSessionStorage()

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

  return built.toHex()
}

var singleton = null

export default class VexLib extends EventEmitter {
  static singleton(options) {
    if (options.baseUrl) {
      baseUrl = options.baseUrl
    }

    if (singleton === null) {
      singleton = new VexLib(options)
    }

    return singleton
  }

  constructor(options) {
    super()

    this.lang = options.lang || 'EN'
    this.exchangeAddress = options.exchangeAddress || ''

    this.axios = defaultAxios()

    this.lastVexSeq = 0
    this.cbList = {}

    this._start_socket_()
  }

  _start_socket_() {
    this.socket = io(baseUrl, {path: '/vexapi/socketio/'})
    this._is_connected_ = false
    this._call_list_ = []

    this.socket.on('connect', this._socket_connect_)
    this.socket.on('new block', this._socket_newblock_)
    this.socket.on('updates', this._socket_updates_)
    this.socket.on('close', this._socket_close_)
    this.socket.on('error', (err) => console.log('Socket error:', err))

    let vexApiHandler = (data) => {
      if (typeof(data.seq) !== 'undefined' && data.seq in this.cbList) {
        let cb = this.cbList[data.seq]

        if (data.error) {
          cb(data.error)
        } else {
          cb(null, data.data)
        }
      } else {
        console.log('Message not expected', data.seq)
      }
    }

    this.socket.on('vex', vexApiHandler)
    this.socket.on('vexblock', vexApiHandler)
    this.socket.on('db', vexApiHandler)
  }

  _socket_connect_ = () => {
    console.log('Socket connected')
    this._is_connected_ = true

    let consumeCallList = () => {
      let call = this._call_list_.shift()
      if (call) {
        call()
        setImmediate(consumeCallList)
      }
    }

    consumeCallList()
  }

  _socket_close_ = () => {
    console.log('Socket closed')
    this._is_connected_ = false
  }

  _socket_newblock_ = (hash) => {
    this.emit('new block', hash)
  }

  _socket_updates_ = (updates) => {
    this.emit('updates', updates)
  }

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
      console.log(`Postergating ${entry} call because socket is not connected`)
      this._call_list_.push(doCall)
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

  index(method, params, cb) {
    this._api_('index', method, params, cb)
  }

  signAndBroadcastTransaction(rawtx, cb) {
    let signed = signTransaction(rawtx)

    this.axios.post('/vexapi/sendtx', {
      rawtx: signed
    }).then((response) => {
      cb(null, response.data.result)
    }).catch(err => {
      cb(err)
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
        let balances = data.result.reduce((p, x) => {
          if (!(x.asset in p)) {
            p[x.asset] = x.quantity
          } else {
            p[x.asset] += x.quantity
          }
          return p
        }, {})

        for (let asset in balances) {
          balances[asset] /= 100000000
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

    this.vex('get_unspent_txouts', {
      address: currentAddress,
      unconfirmed: true
    }, (err, data) => {
      if (err) {
        cb(err)
      } else {
        cb(null, data.result.length > 0)
      }
    })
  }

  getOrderBook(give, get, isBid, cb) {
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

        let res = data.result.map(x => {
          return {
            give: (isBid?x.give_remaining:x.get_remaining) / SATOSHIS,
            get: (isBid?x.get_remaining:x.give_remaining) / SATOSHIS,
            price: isBid?(x.get_quantity / x.give_quantity):(x.give_quantity / x.get_quantity)
          }
        }).sort((a,b) => isBid?(a.price - b.price):(b.price - a.price))
          .reduce((arr, itm) => {
            sumGive += isBid?itm.give:itm.get
            sumGet += isBid?itm.get:itm.give

            itm.sumGive = sanitizeDecimals(sumGive)
            itm.sumGet = sanitizeDecimals(sumGet)

            let lastItem = arr[arr.length - 1]

            if (lastItem && lastItem.price == itm.price) {
              lastItem.give += itm.give
              lastItem.get += itm.get
            } else {
              arr.push(itm)
            }
            return arr
          }, [])
          .map(itm => {
            itm.give = sanitizeDecimals(itm.give)
            itm.get = sanitizeDecimals(itm.get)
            itm.sumGive = sanitizeDecimals(itm.sumGive)
            itm.sumGet = sanitizeDecimals(itm.sumGive)
            return itm
          })
        cb(null, {giveAsset: give, getAsset: get, book: res})
      }
    })
  }

  _recentOrders_(give, get, filters, cb) {
    this.vex('get_orders', {
      filters,
      order_by: 'block_index',
      order_dir: 'DESC'
    }, (err, data) => {
      if (err) {
        cb(err)
      } else {
        let orders = data.result.map(itm => {
          let type, price, giq, geq
          if (itm.give_asset === give && itm.get_asset === get) {
            type = 'buy'
            price = itm.get_quantity / itm.give_quantity
            giq = itm.give_quantity
            geq = itm.get_quantity
          } else if (itm.give_asset === get && itm.get_asset === give) {
            type = 'sell'
            price = itm.give_quantity / itm.get_quantity
            giq = itm.get_quantity
            geq = itm.give_quantity
          } else {
            return undefined
          }

          return {
            type,
            status: itm.status,
            block: itm.block_index,
            price,
            qty: giq / SATOSHIS,
            total: geq / SATOSHIS,
            hash: itm.tx_hash
          }
        }).reduce((arr, itm) => {
          if (itm) {
            arr.push(itm)
          }

          return arr
        }, [])

        cb(null, orders)
      }
    })
  }

  getGlobalRecentOrders(give, get, cb) {
    this._recentOrders_(give, get, [], cb)
  }

  getMyRecentOrders(give, get, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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

  getUser(email, password, cb) {
    let itemKey = `_user_data_${email}_`
    let userData = localStorage.getItem(itemKey)

    let fail = (msg) => {
      cb(msg || 'no-user-found')
    }

    let success = ({address, mnemonic}) => {
      sessionStorage.setItem('currentAddress', address)
      sessionStorage.setItem('currentMnemonic', mnemonic)
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
        dcb(e)
      }
    }

    let store = (data) => {
      localStorage.setItem(itemKey, data)
    }

    if (userData === null) {
      let husr = hash.sha256().update(email).digest('hex')
      this.axios.get(`/vexapi/user/${husr}`)
        .then((response) => {
          if (response.status === 200) {
            decrypt(response.data, (err, data) => {
              if (err) {
                fail('bad-data-or-bad-password')
              } else {
                store(response.data)
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
          fail('bad-data-or-bad-password')
        } else {
          success(data)
        }
      })
    }
  }

  static keyPairFromMnemonic(mnemonic) {
    let seedHex = bip39.mnemonicToSeedHex(mnemonic)

    let d = bigi.fromBuffer(bitcoin.crypto.sha256(Buffer.from(seedHex, 'hex')))
    return new bitcoin.ECPair(d, null, {network: bitcoin.networks.testnet})
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
        let encryptedHex = Buffer.from(aesjs.utils.hex.fromBytes(encryptedBytes), 'hex').toString('base64')

        //console.log(encryptedHex, '---BYTES--->', encryptedHex.length)
        this.axios.post(`/vexapi/userdocs/${userAddress}`, {
          data: encryptedHex
        }).then((data) => {
          success()
        }).catch((err) => {
          fail(err)
        })
      } else {
        fail()
      }
    }).catch(() => {
      fail()
    })
  }

  createUser(email, password, uiLang, cb) {
    let itemKey = `_user_data_${email}_`

    if (!cb) {
      cb = uiLang
      uiLang = this.lang
    }

    let mnemonic = bip39.generateMnemonic(null, null, bip39.wordlists[uiLang])
    let keyPair = VexLib.keyPairFromMnemonic(mnemonic)
    let address = keyPair.getAddress()

    let pkg = {address, mnemonic, lang: uiLang}
    let msg = JSON.stringify(pkg)

    let key = hash.sha256().update(password).digest()
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    let textBytes = aesjs.utils.utf8.toBytes(msg)
    let encryptedBytes = aesCtr.encrypt(textBytes)
    let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

    let husr = hash.sha256().update(email).digest('hex')

    let fail = (err) => {
      cb(err || 'bad-user-data')
    }

    let success = () => {
      sessionStorage.setItem('currentAddress', address)
      sessionStorage.setItem('currentMnemonic', mnemonic)
      localStorage.setItem(itemKey, encryptedHex)
      cb(null, {address, mnemonic, keyPair})
    }

    this.axios.post(`/vexapi/user`, {
      userid: husr,
      email,
      cryptdata: encryptedHex,
      address
    }).then((response) => {
      if (response.status === 200) {
        success()
      } else {
        fail()
      }
    }).catch(() => {
      fail()
    })
  }

  createOrder(giveAsset, giveAmount, getAsset, getAmount, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = (msg) => {
      cb(msg || 'error-creating-order')
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
        console.log(response.data)
        let signed = signTransaction(response.data.result)

        return this.axios.post('/vexapi/sendtx', {
          rawtx: signed
        })
      } else {
        fail('error-creating-order-bad-response')
      }
    }).then((response) => {
      success(response.data.result)
    }).catch((err) => {
      console.log(err)
      fail('error-creating-order-check-logs')
    })
  }

  cancelOrder(txid, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = () => {
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
        let signed = signTransaction(response.data.result)

        return this.axios.post('/vexapi/sendtx', {
          rawtx: signed
        })
      } else {
        fail()
      }
    }).then((response) => {
      success(response.data.result)
    }).catch(() => {
      fail()
    })
  }

  reportFiatDeposit(getToken, getAmount, depositId, cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')
      return
    }

    let fail = () => {
      cb('error-creating-report')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    this.axios.post('/vexapi/report', {
      "text": `${getToken}:${getAmount}:${depositId}`,
      "source": currentAddress
    }).then((response) => {
      if (response.status === 200) {
        let signed = signTransaction(response.data.result)

        return this.axios.post('/vexapi/sendtx', {
          rawtx: signed
        })
      } else {
        fail()
      }
    }).then((response) => {
      success(response.data.result)
    }).catch(() => {
      fail()
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
      cb(err || 'error-generating-withdrawal')
    }

    let success = (txid) => {
      cb(null, txid)
    }

    let memo
    let isHex

    if (info && (info.length > 0)) {
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
    }

    amount = Math.round(parseFloat(amount) * SATOSHIS)

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
        } else {
          let signed = signTransaction(response.data.result)

          return this.axios.post('/vexapi/sendtx', {
            rawtx: signed
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


  getWithdraws(cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

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

  getDeposits(cb) {
    let currentAddress = sessionStorage.getItem('currentAddress')

    if (!currentAddress) {
      cb('login-first')
      this.emit('need-login')

      return
    }

    let fail = (err) => {
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

  remoteLogin(email, password, cb) {
    this.getUser(email, password, (err, userData) => {
      if (err) {
        cb(err)
      } else {
        let currentAddress = sessionStorage.getItem('currentAddress')

        this.getChallenge((err, challenge) => {
          if (err) {
            cb(err)
          } else {
            let keyPair = getKeyPairFromSessionStorage()
            let signature = bitcoinMessage.sign(challenge, keyPair.d.toBuffer(32), keyPair.compressed)

            let sigResult = signature.toString('base64')

            this.axios.post(`/vexapi/challenge/${currentAddress}`, {signature: sigResult}).then((response) => {
              if (response.data.success) {
                this.axios = defaultAxios({headers: {
                  'addr': currentAddress,
                  'token': response.data.accessToken
                }})

                this.userEnabled((err, isEnabled) => {
                  if (err) {
                    cb(err)
                  } else {
                    if (isEnabled) {
                      cb(null, response.data)
                    } else {
                      cb('user-not-enabled')
                    }
                  }
                })
              } else {
                cb('challenge-error')
              }

            }).catch(err => {
              cb(err)
            })
          }
        })
      }
    })
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
}
