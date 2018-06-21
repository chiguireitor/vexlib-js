'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SATOSHIS = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
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


exports.limit8Decimals = limit8Decimals;
exports.sanitizeDecimals = sanitizeDecimals;
exports.softLimit8Decimals = softLimit8Decimals;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _hash = require('hash.js');

var _hash2 = _interopRequireDefault(_hash);

var _aesJs = require('aes-js');

var _aesJs2 = _interopRequireDefault(_aesJs);

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _bitcoinjsMessage = require('bitcoinjs-message');

var _bitcoinjsMessage2 = _interopRequireDefault(_bitcoinjsMessage);

var _bigi = require('bigi');

var _bigi2 = _interopRequireDefault(_bigi);

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var build = "12";

var SATOSHIS = exports.SATOSHIS = 100000000;

function limit8Decimals(v) {
  if (v.length > 8) {
    return v.slice(0, 8);
  } else if (v.length === 8) {
    return v;
  } else {
    return v + new Array(8 - v.length).fill(0).join('');
  }
}

function sanitizeDecimals(n) {
  var v = n + '';
  var num = v.split('.');

  if (num.length > 1) {
    return num[0] + '.' + limit8Decimals(num[1]);
  } else {
    return num[0] + '.00000000';
  }
}

function softLimit8Decimals(v) {
  if (!v) {
    return v;
  } else {
    v = '' + v;
    if (v.indexOf('.') < 0) {
      return v;
    } else {
      var _v = v.split('.'),
          _v = _slicedToArray(_v, 2),
          i = _v[0],
          d = _v[1];

      if (d.length > 8) {
        return i + '.' + d.slice(0, 8);
      } else if (v.length <= 8) {
        return i + '.' + d;
      }
    }
  }
}

var baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8085' : window.location.origin;

function defaultAxios(ob) {
  if (!ob) {
    ob = {};
  }

  console.log('Using baseurl:', baseUrl);
  ob.baseURL = baseUrl;

  return _axios2.default.create(ob);
}

function getKeyPairFromSessionStorage() {
  var mnemonic = sessionStorage.getItem('currentMnemonic');
  var seedHex = _bip2.default.mnemonicToSeedHex(mnemonic);
  var d = _bigi2.default.fromBuffer(_bitcoinjsLib2.default.crypto.sha256(Buffer.from(seedHex, 'hex')));
  return new _bitcoinjsLib2.default.ECPair(d, null, { network: _bitcoinjsLib2.default.networks.testnet });
}

var devices = {};

function signTransaction(rawHex, cb) {
  var tx = _bitcoinjsLib2.default.Transaction.fromHex(rawHex);
  var device = sessionStorage.getItem('device');
  console.log(device);

  if (device === 'userpass' || device === null) {
    var keyPair = getKeyPairFromSessionStorage();

    var builder = new _bitcoinjsLib2.default.TransactionBuilder(_bitcoinjsLib2.default.networks.testnet);

    tx.ins.forEach(function (vin) {
      builder.addInput(vin.hash.reverse().toString('hex'), vin.index);
    });

    tx.outs.forEach(function (vout) {
      builder.addOutput(vout.script, vout.value);
    });

    for (var i = 0; i < tx.ins.length; i++) {
      builder.sign(i, keyPair);
    }

    var built = builder.build();

    cb(built.toHex());
  } else if (device === 'trezor') {
    var Trezor = devices[device](0);

    Trezor.signTx(tx.ins, tx.outs, function (err, tx) {
      if (err) {
        console.log('Trezor ERR:');
        console.log(err);
        console.trace();
      } else {
        console.log('Serialized TX:', tx);

        cb(tx);
      }
    });
  }
}

var _singleton = null;

var VexLib = function (_EventEmitter) {
  _inherits(VexLib, _EventEmitter);

  _createClass(VexLib, [{
    key: 'registerDeviceProvider',
    value: function registerDeviceProvider(name, proto) {
      devices[name] = proto;
    }
  }], [{
    key: 'singleton',
    value: function singleton(options) {
      if (!options) {
        options = {};
      }

      if (options && options.baseUrl) {
        baseUrl = options.baseUrl;
      }

      if (_singleton === null) {
        _singleton = new VexLib(options);
      }

      return _singleton;
    }
  }]);

  function VexLib(options) {
    _classCallCheck(this, VexLib);

    var _this = _possibleConstructorReturn(this, (VexLib.__proto__ || Object.getPrototypeOf(VexLib)).call(this));

    _this._socket_connect_ = function () {
      console.log('Socket connected');
      _this._is_connected_ = true;

      var consumeCallList = function consumeCallList() {
        var call = _this._call_list_.shift();
        if (call) {
          call();
          setImmediate(consumeCallList);
        }
      };

      consumeCallList();
    };

    _this._socket_close_ = function () {
      console.log('Socket closed');
      _this._is_connected_ = false;
    };

    _this._socket_newblock_ = function (hash) {
      _this.emit('new block', hash);
      //this.vex('')
    };

    _this._socket_updates_ = function (updates) {
      _this.emit('updates', updates);
    };

    _this.lang = options.lang || 'EN';
    _this.exchangeAddress = options.exchangeAddress || '';

    console.log('VexLib init', _this.lang, _this.exchangeAddress, build);

    _this.axios = defaultAxios();

    _this.lastVexSeq = 0;
    _this.cbList = {};

    _this._start_socket_();
    return _this;
  }

  _createClass(VexLib, [{
    key: '_start_socket_',
    value: function _start_socket_() {
      var _this2 = this;

      this.socket = (0, _socket2.default)(baseUrl, { path: '/vexapi/socketio/' });
      this._is_connected_ = false;
      this._call_list_ = [];

      this.socket.on('connect', this._socket_connect_);
      this.socket.on('new block', this._socket_newblock_);
      this.socket.on('updates', this._socket_updates_);
      this.socket.on('close', this._socket_close_);
      this.socket.on('error', function (err) {
        return console.log('Socket error:', err);
      });

      var vexApiHandler = function vexApiHandler(data) {
        if (typeof data.seq !== 'undefined' && data.seq in _this2.cbList) {
          var cb = _this2.cbList[data.seq];

          if (cb) {
            if (data.error) {
              cb(data.error);
            } else {
              cb(null, data.data);
            }
          }
        } else {
          console.log('Message not expected', data.seq);
        }
      };

      this.socket.on('vex', vexApiHandler);
      this.socket.on('vexblock', vexApiHandler);
      this.socket.on('db', vexApiHandler);
      this.socket.on('ldb', vexApiHandler);
    }
  }, {
    key: '_api_',
    value: function _api_(entry, method, params, cb) {
      var _this3 = this;

      this.cbList[this.lastVexSeq] = cb;

      var doCall = function (seq) {
        return function () {
          _this3.socket.emit(entry, {
            method: method,
            params: params,
            seq: seq
          });
        };
      }(this.lastVexSeq);

      this.lastVexSeq++;

      if (this._is_connected_) {
        doCall();
      } else {
        console.log('Postergating ' + entry + ' call because socket is not connected');
        this._call_list_.push(doCall);
      }
    }
  }, {
    key: 'vex',
    value: function vex(method, params, cb) {
      this._api_('vex', method, params, cb);
    }
  }, {
    key: 'vexblock',
    value: function vexblock(method, params, cb) {
      this._api_('vexblock', method, params, cb);
    }
  }, {
    key: 'db',
    value: function db(method, params, cb) {
      this._api_('db', method, params, cb);
    }
  }, {
    key: 'ldb',
    value: function ldb(method, params, cb) {
      this._api_('ldb', method, params, cb);
    }
  }, {
    key: 'index',
    value: function index(method, params, cb) {
      this._api_('index', method, params, cb);
    }
  }, {
    key: 'signAndBroadcastTransaction',
    value: function signAndBroadcastTransaction(rawtx, cb) {
      var _this4 = this;

      signTransaction(rawtx, function (signed) {
        _this4.axios.post('/vexapi/sendtx', {
          rawtx: signed
        }).then(function (response) {
          cb(null, response.data.result);
        }).catch(function (err) {
          cb(err);
        });
      });
    }
  }, {
    key: 'getBalances',
    value: function getBalances(cb) {
      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      this.vex('get_balances', {
        filters: [{
          field: 'address',
          op: '==',
          value: currentAddress
        }]
      }, function (err, data) {
        if (err) {
          cb(err);
        } else {
          var balances = data.result.reduce(function (p, x) {
            if (!(x.asset in p)) {
              p[x.asset] = x.quantity;
            } else {
              p[x.asset] += x.quantity;
            }
            return p;
          }, {});

          for (var asset in balances) {
            balances[asset] /= 100000000;
          }
          cb(null, balances);
        }
      });
    }
  }, {
    key: 'userEnabled',
    value: function userEnabled(cb) {
      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      this.vex('get_unspent_txouts', {
        address: currentAddress,
        unconfirmed: true
      }, function (err, data) {
        if (err) {
          cb(err);
        } else {
          cb(null, data.result.length > 0);
        }
      });
    }
  }, {
    key: 'getOrderBook',
    value: function getOrderBook(give, get, isBid, cb) {
      this.vex('get_orders', {
        filters: [{
          field: 'give_asset',
          op: '==',
          value: give
        }, {
          field: 'get_asset',
          op: '==',
          value: get
        }, {
          field: 'give_remaining',
          op: '>',
          value: 0
        }, {
          field: 'status',
          op: '==',
          value: 'open'
        }]
      }, function (err, data) {
        if (err) {
          cb(err);
        } else {
          var sumGive = 0;
          var sumGet = 0;

          var res = data.result.map(function (x) {
            return {
              rawGive: isBid ? x.give_remaining : x.get_remaining,
              rawGet: isBid ? x.get_remaining : x.give_remaining,
              give: (isBid ? x.give_remaining : x.get_remaining) / SATOSHIS,
              get: (isBid ? x.get_remaining : x.give_remaining) / SATOSHIS,
              price: isBid ? x.get_quantity / x.give_quantity : x.give_quantity / x.get_quantity
            };
          }).sort(function (a, b) {
            return isBid ? a.price - b.price : b.price - a.price;
          }).reduce(function (arr, itm) {
            sumGive += isBid ? itm.give : itm.get;
            sumGet += isBid ? itm.get : itm.give;

            itm.sumGive = sanitizeDecimals(sumGive);
            itm.sumGet = sanitizeDecimals(sumGet);

            var lastItem = arr[arr.length - 1];

            if (lastItem && lastItem.price == itm.price) {
              lastItem.give += itm.give;
              lastItem.get += itm.get;
            } else {
              arr.push(itm);
            }
            return arr;
          }, []).map(function (itm) {
            itm.give = sanitizeDecimals(itm.give);
            itm.get = sanitizeDecimals(itm.get);
            itm.sumGive = sanitizeDecimals(itm.sumGive);
            itm.sumGet = sanitizeDecimals(itm.sumGive);
            return itm;
          });
          cb(null, { giveAsset: give, getAsset: get, book: res });
        }
      });
    }
  }, {
    key: '_recentOrders_',
    value: function _recentOrders_(give, get, filters, cb) {
      this.vex('get_orders', {
        filters: filters,
        order_by: 'block_index',
        order_dir: 'DESC'
      }, function (err, data) {
        if (err) {
          cb(err);
        } else {
          var orders = data.result.map(function (itm) {
            var type = void 0,
                price = void 0,
                giq = void 0,
                geq = void 0;
            if (itm.give_asset === give && itm.get_asset === get) {
              type = 'buy';
              price = itm.get_quantity / itm.give_quantity;
              giq = itm.give_quantity;
              geq = itm.get_quantity;
            } else if (itm.give_asset === get && itm.get_asset === give) {
              type = 'sell';
              price = itm.give_quantity / itm.get_quantity;
              giq = itm.get_quantity;
              geq = itm.give_quantity;
            } else {
              return undefined;
            }

            return {
              type: type,
              status: itm.status,
              block: itm.block_index,
              price: price,
              qty: giq / SATOSHIS,
              total: geq / SATOSHIS,
              hash: itm.tx_hash
            };
          }).reduce(function (arr, itm) {
            if (itm) {
              arr.push(itm);
            }

            return arr;
          }, []);

          cb(null, orders);
        }
      });
    }
  }, {
    key: 'getGlobalRecentOrders',
    value: function getGlobalRecentOrders(give, get, cb) {
      this._recentOrders_(give, get, [], cb);
    }
  }, {
    key: 'getMyRecentOrders',
    value: function getMyRecentOrders(give, get, cb) {
      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      this._recentOrders_(give, get, [{
        field: 'source',
        op: '==',
        value: currentAddress
      }], cb);
    }
  }, {
    key: 'getTradeHistory',
    value: function getTradeHistory(give, get, cb) {
      this.vexblock('get_trade_history', {
        asset1: give,
        asset2: get
      }, function (err, data) {
        if (err) {
          cb(err);
        } else if (data.result) {
          var pricePoints = data.result.map(function (x) {
            return {
              price: x.unit_price,
              date: x.block_time,
              vol: x.base_quantity_normalized
            };
          });
          cb(null, pricePoints);
        } else {
          cb(null, []);
        }
      });
    }
  }, {
    key: 'getUser',
    value: function getUser(email, password, cb) {
      var itemKey = '_user_data_' + email + '_';
      var userData = localStorage.getItem(itemKey);

      var fail = function fail(msg) {
        cb(msg || 'no-user-found');
      };

      var success = function success(_ref) {
        var address = _ref.address,
            mnemonic = _ref.mnemonic;

        sessionStorage.setItem('currentAddress', address);
        sessionStorage.setItem('currentMnemonic', mnemonic);
        cb(null, { address: address, mnemonic: mnemonic });
      };

      var decrypt = function decrypt(data, dcb) {
        var key = _hash2.default.sha256().update(password).digest();
        var aesCtr = new _aesJs2.default.ModeOfOperation.ctr(key, new _aesJs2.default.Counter(5));
        var encryptedBytes = Buffer.from(data, 'hex');
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        var decryptedText = _aesJs2.default.utils.utf8.fromBytes(decryptedBytes);

        try {
          var ob = JSON.parse(decryptedText);

          dcb(null, ob);
        } catch (e) {
          dcb(e);
        }
      };

      var store = function store(data) {
        localStorage.setItem(itemKey, data);
      };

      if (userData === null) {
        var husr = _hash2.default.sha256().update(email).digest('hex');
        this.axios.get('/vexapi/user/' + husr).then(function (response) {
          if (response.status === 200) {
            decrypt(response.data, function (err, data) {
              if (err) {
                fail('bad-data-or-bad-password');
              } else {
                store(response.data);
                success(data);
              }
            });
          } else {
            fail('error-request-status');
          }
        }).catch(function () {
          fail('error-request');
        });
      } else {
        decrypt(userData, function (err, data) {
          if (err) {
            fail('bad-data-or-bad-password');
          } else {
            success(data);
          }
        });
      }
    }
  }, {
    key: 'sendRegisterPkg',
    value: function sendRegisterPkg(userAddress, pkg, cb) {
      var _this5 = this;

      var fail = function fail(err) {
        cb(err || 'bad-user-data');
      };

      var success = function success() {
        cb(null, 'ok');
      };

      this.axios.get('/vexapi/sesskey/' + userAddress).then(function (response) {
        if (response.status === 200) {
          var key = Buffer.from(response.data.key, 'hex');
          var aesCtr = new _aesJs2.default.ModeOfOperation.ctr(key, new _aesJs2.default.Counter(5));
          var msg = JSON.stringify(pkg);
          var textBytes = _aesJs2.default.utils.utf8.toBytes(msg);
          var encryptedBytes = aesCtr.encrypt(textBytes);
          var intermediaryHex = _aesJs2.default.utils.hex.fromBytes(encryptedBytes);
          console.log('Encrypted intermediary size:', intermediaryHex.length / 2);
          var encryptedHex = Buffer.from(intermediaryHex, 'hex').toString('base64');
          console.log('Encrypted base64:', encryptedHex);

          //console.log(encryptedHex, '---BYTES--->', encryptedHex.length)
          delete pkg['files'];
          console.log('Intermediary package', pkg);
          _this5.axios.post('/vexapi/userdocs/' + userAddress, {
            data: encryptedHex,
            extraData: pkg
          }).then(function (data) {
            success();
          }).catch(function (err) {
            fail(err);
          });
        } else {
          fail();
        }
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'createUser',
    value: function createUser(email, password, uiLang, cb) {
      var _this6 = this;

      var externalToken = null;

      if ((typeof password === 'undefined' ? 'undefined' : _typeof(password)) === "object") {
        externalToken = password;
        password = null;
      }

      var itemKey = '_user_data_' + email + '_';

      if (!cb) {
        cb = uiLang;
        uiLang = this.lang;
      }

      var fail = function fail(err) {
        cb(err || 'bad-user-data');
      };

      var completeRegister = function completeRegister(encryptedHex, address, mnemonic) {
        var husr = _hash2.default.sha256().update(email).digest('hex');

        var success = function success() {
          if (externalToken) {
            sessionStorage.setItem('device', externalToken.getName());
            localStorage.setItem(itemKey, externalToken.getName());
            cb(null, { address: address, device: externalToken.getName() });
          } else {
            sessionStorage.setItem('device', 'userpass');
            sessionStorage.setItem('currentAddress', address);
            sessionStorage.setItem('currentMnemonic', mnemonic);
            localStorage.setItem(itemKey, encryptedHex);
            var keyPair = VexLib.keyPairFromMnemonic(mnemonic);
            cb(null, { address: address, mnemonic: mnemonic, keyPair: keyPair });
          }
        };

        _this6.axios.post('/vexapi/user', {
          userid: husr,
          email: email,
          cryptdata: encryptedHex,
          address: address
        }).then(function (response) {
          if (response.status === 200) {
            success();
          } else {
            fail();
          }
        }).catch(function (err) {
          fail(err);
        });
      };

      if (externalToken) {
        externalToken.getAddress(function (address) {
          if (!address) {
            fail('cant-comm-token');
          } else {
            var pkg = { address: address, token: externalToken.getName() };
            var msg = JSON.stringify(pkg);
            completeRegister(null, address);
          }
        });
      } else {
        var mnemonic = _bip2.default.generateMnemonic(null, null, _bip2.default.wordlists[uiLang]);
        var keyPair = VexLib.keyPairFromMnemonic(mnemonic);
        var address = keyPair.getAddress();

        var pkg = { address: address, mnemonic: mnemonic, lang: uiLang };
        var msg = JSON.stringify(pkg);

        var key = _hash2.default.sha256().update(password).digest();
        var aesCtr = new _aesJs2.default.ModeOfOperation.ctr(key, new _aesJs2.default.Counter(5));
        var textBytes = _aesJs2.default.utils.utf8.toBytes(msg);
        var encryptedBytes = aesCtr.encrypt(textBytes);
        var encryptedHex = _aesJs2.default.utils.hex.fromBytes(encryptedBytes);

        completeRegister(encryptedHex, address, mnemonic);
      }
    }
  }, {
    key: 'createOrder',
    value: function createOrder(giveAsset, giveAmount, getAsset, getAmount, cb) {
      var _this7 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this7.emit('need-login');
        }

        cb(err || 'error-creating-order');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      this.axios.post('/vexapi/order', {
        "give_asset": giveAsset,
        "give_quantity": giveAmount,
        "get_asset": getAsset,
        "get_quantity": getAmount,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          console.log(response.data);
          signTransaction(response.data.result, function (signed) {
            _this7.axios.post('/vexapi/sendtx', {
              rawtx: signed
            }).then(function (response) {
              success(response.data.result);
            });
          });
        } else {
          fail('error-creating-order-bad-response');
        }
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'cancelOrder',
    value: function cancelOrder(txid, cb) {
      var _this8 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {

        if (err.response && err.response.status === 401) {
          _this8.emit('need-login');
        }

        cb('error-creating-cancel');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      this.axios.post('/vexapi/cancelorder', {
        "offer_hash": txid,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          signTransaction(response.data.result, function (signed) {
            return _this8.axios.post('/vexapi/sendtx', {
              rawtx: signed
            });
          });
        } else {
          fail();
        }
      }).then(function (response) {
        success(response.data.result);
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'reportFiatDeposit',
    value: function reportFiatDeposit(getToken, getAmount, depositId, cb) {
      var _this9 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {

        if (err.response && err.response.status === 401) {
          _this9.emit('need-login');
        }

        console.log(err);

        cb('error-creating-report');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      this.axios.post('/vexapi/report', {
        "text": getToken + ':' + getAmount + ':' + depositId,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          signTransaction(response.data.result, function (signed) {
            return _this9.axios.post('/vexapi/sendtx', {
              rawtx: signed
            }).then(function (response) {
              success(response.data.result);
            });
          });
        } else {
          fail();
        }
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'generateWithdrawal',
    value: function generateWithdrawal(token, amount, address, info, cb) {
      var _this10 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this10.emit('need-login');
        }

        cb(err || 'error-generating-withdrawal');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      var memo = void 0;
      var isHex = void 0;

      if (info && info.length > 0) {
        memo = address + ':' + info;
        isHex = false;
      } else {
        try {
          memo = _bs2.default.decode(address).toString('hex');
          isHex = true;
        } catch (e) {
          cb('invalid-address');
          return;
        }
      }

      if (!isHex && memo.length > 31 || isHex && memo.length > 62) {
        cb('memo-too-big');
        return;
      }

      amount = Math.round(parseFloat(amount) * SATOSHIS);

      this.axios.post('/vexapi/withdraw', {
        "asset": token,
        "quantity": amount,
        "memo": memo,
        "memo_is_hex": isHex,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          if (response.data.error) {
            fail(response.data.error);
          } else {
            signTransaction(response.data.result, function (signed) {
              return _this10.axios.post('/vexapi/sendtx', {
                rawtx: signed
              });
            });
          }
        } else {
          fail('error-building-tx');
        }
      }).then(function (response) {
        success(response.data.result);
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'generateCodeWithdrawal',
    value: function generateCodeWithdrawal(token, amount, code, cb) {
      var _this11 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this11.emit('need-login');
        }

        cb(err || 'error-generating-withdrawal');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      var memo = 'admin:' + code;

      if (memo.length > 31) {
        cb('memo-too-big');
        return;
      }

      amount = Math.round(parseFloat(amount) * SATOSHIS);

      this.axios.post('/vexapi/withdraw', {
        "asset": token,
        "quantity": amount,
        "memo": memo,
        "memo_is_hex": false,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          if (response.data.error) {
            fail(response.data.error);
          } else {
            signTransaction(response.data.result, function (signed) {
              return _this11.axios.post('/vexapi/sendtx', {
                rawtx: signed
              });
            });
          }
        } else {
          fail('error-building-tx');
        }
      }).then(function (response) {
        success(response.data.result);
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'generatePaymentBill',
    value: function generatePaymentBill(token, quantity, concept, cb) {
      var _this12 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this12.emit('need-login');
        }

        cb('error-creating-report');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      this.axios.post('/vexapi/report', {
        "text": token + ':' + quantity + ':' + concept,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          signTransaction(response.data.result, function (signed) {
            return _this12.axios.post('/vexapi/sendtx', {
              rawtx: signed
            });
          });
        } else {
          fail();
        }
      }).then(function (response) {
        success(response.data.result);
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'getFiatDepositReports',
    value: function getFiatDepositReports(cb) {
      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail() {
        cb('error-getting-deposit-reports');
      };

      var success = function success(deposits) {
        cb(null, deposits);
      };

      this.axios.get('/vexapi/reports/' + currentAddress).then(function (response) {
        success(response.data.result.map(function (x) {
          try {
            var _x = x.text.split(':'),
                _x = _slicedToArray(_x, 3),
                fiat = _x[0],
                amount = _x[1],
                depositid = _x[2];

            return {
              fiat: fiat, amount: amount, depositid: depositid
            };
          } catch (e) {
            return { error: 'malformed-deposit' };
          }
        }));
      }).catch(function () {
        fail();
      });
    }
  }, {
    key: 'getWithdraws',
    value: function getWithdraws(cb) {
      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail() {
        cb('error-getting-withdrawals');
      };

      var success = function success(transactions) {
        cb(null, transactions);
      };

      this.axios.get('/vexapi/withdraws/' + currentAddress).then(function (response) {
        if (response.status === 200) {
          success(response.data);
        } else {
          fail();
        }
      }).catch(function () {
        fail();
      });
    }
  }, {
    key: 'getDeposits',
    value: function getDeposits(cb) {
      var _this13 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this13.emit('need-login');
        }

        cb(err || 'error-getting-deposits');
      };

      var success = function success(transactions) {
        cb(null, transactions);
      };

      this.axios.get('/vexapi/deposits/' + currentAddress).then(function (response) {
        if (response.status === 200) {
          success(response.data);
        } else {
          fail();
        }
      }).catch(function (err) {
        fail(err);
      });
    }
  }, {
    key: 'generateTokenDepositAddress',
    value: function generateTokenDepositAddress(token, cb) {
      var _this14 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this14.emit('need-login');
        }

        cb(err || 'error-getting-deposits');
      };

      var success = function success(status) {
        cb(null, status);
      };

      this.vex('create_broadcast', {
        source: currentAddress,
        text: 'GENADDR:' + token,
        fee_fraction: 0,
        fee: 10000,
        timestamp: Math.floor(Date.now() / 1000),
        value: 0
      }, function (err, data) {
        if (err) {
          fail(err);
        } else {
          signTransaction(data.result, function (signedTransaction) {
            _this14.axios.post('/vexapi/sendtx', {
              rawtx: signedTransaction
            }).then(function (response) {
              success(response.data.result);
            }).catch(function (err) {
              fail(err);
            });
          });
        }
      });
    }
  }, {
    key: 'getTokenDepositAddress',
    value: function getTokenDepositAddress(token, cb) {
      var _this15 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this15.emit('need-login');
        }

        cb(err || 'error-getting-deposits');
      };

      var success = function success(data) {
        cb(null, data);
      };

      this.vex('get_broadcasts', {
        filters: [{
          field: 'text',
          op: 'LIKE',
          value: 'A:' + currentAddress + ':' + token + ':%'
        }, {
          field: 'source',
          op: '==',
          value: this.exchangeAddress
        }],
        order_by: 'tx_index',
        order_dir: 'DESC'
      }, function (err, data) {
        if (err) {
          fail(err);
        } else {
          success(data);
        }
      });
    }
  }, {
    key: 'getChallenge',
    value: function getChallenge(cb) {
      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('needs-html-login-first');

        return;
      }

      var fail = function fail(msg) {
        cb(msg || 'error-getting-challenge');
      };

      var success = function success(challenge) {
        cb(null, challenge);
      };

      this.axios.get('/vexapi/challenge/' + currentAddress).then(function (response) {
        if (response.status === 200) {
          success(response.data.challenge);
        } else {
          fail('bad-status-get-challenge');
        }
      }).catch(function (err) {
        console.log(err);
        fail();
      });
    }
  }, {
    key: 'localLogin',
    value: function localLogin(externalToken, cb) {
      var _this16 = this;

      if (typeof cb === 'undefined') {
        cb = externalToken;
        externalToken = null;
      }

      var sign = function sign(currentAddress) {
        sessionStorage.setItem('currentAddress', currentAddress);
        _this16.getChallenge(function (err, challenge) {
          if (err) {
            cb(err);
          } else {
            var postChallenge = function postChallenge(sigResult) {
              if (!sigResult) {
                console.log(sigResult);
                cb('couldnt-sign');
              } else {
                _this16.axios.post('/vexapi/challenge/' + currentAddress, { signature: sigResult }).then(function (response) {
                  if (response.data.success) {
                    _this16.axios = defaultAxios({ headers: {
                        'addr': currentAddress,
                        'token': response.data.accessToken
                      } });

                    _this16.userEnabled(function (err, isEnabled) {
                      if (err) {
                        cb(err);
                      } else {
                        if (isEnabled) {
                          cb(null, response.data);
                        } else {
                          cb('user-not-enabled');
                        }
                      }
                    });
                  } else {
                    cb('challenge-error');
                  }
                }).catch(function (err) {
                  cb(err);
                });
              }
            };

            if (externalToken) {
              sessionStorage.setItem('device', externalToken.getName());
              externalToken.signMessage(challenge, postChallenge);
            } else {
              var keyPair = getKeyPairFromSessionStorage();
              var signature = _bitcoinjsMessage2.default.sign(challenge, keyPair.d.toBuffer(32), keyPair.compressed);

              var sigResult = signature.toString('base64');

              postChallenge(sigResult);
            }
          }
        });
      };

      if (!externalToken) {
        sign(sessionStorage.getItem('currentAddress'));
      } else {
        externalToken.getAddress(sign);
      }
    }
  }, {
    key: 'remoteLogin',
    value: function remoteLogin(email, password, externalToken, cb) {
      var _this17 = this;

      if (typeof cb === "undefined") {
        cb = externalToken;
        externalToken = null;
      }

      if (externalToken) {
        this.localLogin(externalToken, cb);
      } else {
        this.getUser(email, password, function (err, userData) {
          if (err) {
            cb(err);
          } else {
            _this17.localLogin(null, cb);
          }
        });
      }
    }
  }, {
    key: 'remoteLogout',
    value: function remoteLogout(cb) {
      var _this18 = this;

      var currentAddress = sessionStorage.getItem('currentAddress');

      if (!currentAddress) {
        cb('needs-html-login-first');

        return;
      }

      this.axios.get('/vexapi/logout').then(function () {
        _this18.axios = defaultAxios();
        sessionStorage.removeItem('currentAddress');
        sessionStorage.removeItem('currentMnemonic');
        cb(null, true);
      }).catch(function (err) {
        _this18.axios = defaultAxios();
        sessionStorage.removeItem('currentAddress');
        sessionStorage.removeItem('currentMnemonic');
        cb(err);
      });
    }
  }, {
    key: 'getTokens',
    value: function getTokens(cb) {
      this.vex('get_asset_names', {}, function (err, data) {
        if (err) {
          cb(err);
        } else {
          cb(null, data.result);
        }
      });
    }
  }], [{
    key: 'keyPairFromMnemonic',
    value: function keyPairFromMnemonic(mnemonic) {
      var seedHex = _bip2.default.mnemonicToSeedHex(mnemonic);

      var d = _bigi2.default.fromBuffer(_bitcoinjsLib2.default.crypto.sha256(Buffer.from(seedHex, 'hex')));
      return new _bitcoinjsLib2.default.ECPair(d, null, { network: _bitcoinjsLib2.default.networks.testnet });
    }
  }]);

  return VexLib;
}(_events2.default);

exports.default = VexLib;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.limit8Decimals = limit8Decimals;
exports.sanitizeDecimals = sanitizeDecimals;
exports.softLimit8Decimals = softLimit8Decimals;
var SATOSHIS = exports.SATOSHIS = 100000000;

function limit8Decimals(v) {
  if (v.length > 8) {
    return v.slice(0, 8);
  } else if (v.length === 8) {
    return v;
  } else {
    return v + new Array(8 - v.length).fill(0).join('');
  }
}

function sanitizeDecimals(n) {
  var v = n + '';
  var num = v.split('.');

  if (num.length > 1) {
    return num[0] + '.' + limit8Decimals(num[1]);
  } else {
    return num[0] + '.00000000';
  }
}

function softLimit8Decimals(v) {
  if (!v) {
    return v;
  } else {
    v = '' + v;
    if (v.indexOf('.') < 0) {
      return v;
    } else {
      var _v = v.split('.'),
          _v = _slicedToArray(_v, 2),
          i = _v[0],
          d = _v[1];

      if (d.length > 8) {
        return i + '.' + d.slice(0, 8);
      } else if (v.length <= 8) {
        return i + '.' + d;
      }
    }
  }
}
