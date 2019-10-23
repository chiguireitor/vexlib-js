'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SATOSHIS = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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


exports.limitNDecimals = limitNDecimals;
exports.sanitizeNDecimals = sanitizeNDecimals;
exports.softLimit8Decimals = softLimit8Decimals;

require('regenerator-runtime/runtime');

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

var _checkIp = require('check-ip');

var _checkIp2 = _interopRequireDefault(_checkIp);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _xcpjsv = require('xcpjsv2');

var _xcpjsv2 = _interopRequireDefault(_xcpjsv);

var _universalCookie = require('universal-cookie');

var _universalCookie2 = _interopRequireDefault(_universalCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var build = "435";

function getStorage(type) {
  if (typeof window !== 'undefined' && type + 'Storage' in window) {
    return window[type + 'Storage'];
  } else {
    return require('localstorage-memory');
  }
}

var localStorageProxy = getStorage('local');
var sessionStorageProxy = getStorage('session');

var SATOSHIS = exports.SATOSHIS = 100000000;

var bip39SpanishFix = {
  "á": "á",
  "é": "é",
  "í": "í",
  "ó": "ó",
  "ú": "ú"
};

var divideLimited = function divideLimited(val, divisor) {
  return Math.floor(val) / divisor;
};

/*export function limit8Decimals(v) {
  if (v.length > 8) {
    return v.slice(0, 8)
  } else if (v.length === 8) {
    return v
  } else {
    return v + new Array(8 - v.length).fill(0).join('')
  }
}*/

function limitNDecimals(v, n) {
  if (v.length > n) {
    return v.slice(0, n);
  } else if (v.length === n) {
    return v;
  } else {
    return v + new Array(n - v.length).fill(0).join('');
  }
}

function sanitizeNDecimals(n, divisor) {
  var decimals = divisor.toString().length - 1;
  var v = n + '';
  var num = v.split('.');

  if (num.length > 1) {
    return num[0] + '.' + limitNDecimals(num[1], decimals);
  } else {
    return num[0] + '.' + Array(decimals).fill(0).join('');
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

//var window = window || { location: { hostname: '-' } }
function getDefaultBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || (0, _checkIp2.default)(window.location.hostname).isRfc1918 ? 'http://' + window.location.hostname + ':8085' : window.location.origin;
  } else {
    return '';
  }
}
var baseUrl = getDefaultBaseUrl();

function defaultAxios(ob) {
  if (!ob) {
    ob = {};
  }

  console.log('Using baseurl:', baseUrl);
  ob.baseURL = baseUrl;

  return _axios2.default.create(ob);
}

var fixList = _bip2.default.wordlists.spanish.filter(function (x) {
  return x !== x.normalize();
}).map(function (x) {
  return [x, x.normalize('NFD').replace(/[\u0300-\u036f]/g, "")];
});
function fixAccents(w) {
  if (w) {
    var words = w.split(" ");
    words = words.map(function (ow) {
      var idx = fixList.findIndex(function (p) {
        return p[1] === ow;
      });

      if (idx >= 0) {
        return fixList[idx][0];
      } else {
        return ow;
      }
    });

    return words.join(" ");
  } else {
    return w;
  }
}

function getKeyPairFromSessionStorage() {
  var mnemonic = sessionStorageProxy.getItem('currentMnemonic');
  var seedHex = _bip2.default.mnemonicToSeedHex(fixAccents(mnemonic));
  var d = _bitcoinjsLib2.default.crypto.sha256(Buffer.from(seedHex, 'hex'));
  return _bitcoinjsLib2.default.ECPair.fromPrivateKey(d, { network: _bitcoinjsLib2.default.networks.testnet });
}

var devices = {};

function buildAndSign(keyPair, tx, cb) {
  var builder = new _bitcoinjsLib2.default.TransactionBuilder(_bitcoinjsLib2.default.networks.testnet);

  if (tx.__tx) {
    tx = tx.__tx;
  }

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
}

function signTransaction(rawHex, cb) {
  var tx = _bitcoinjsLib2.default.Transaction.fromHex(rawHex);
  var device = sessionStorageProxy.getItem('device');
  console.log(device);

  if (device === 'userpass' || device === null) {
    var keyPair = getKeyPairFromSessionStorage();

    buildAndSign(keyPair, tx, cb);
  } else if (device === 'trezor') {
    var Trezor = devices[device](0);

    Trezor.signTx(tx.ins, tx.outs, function (err, tx) {
      if (err) {
        console.log('Trezor ERR:');
        console.log(err);
        console.trace();
        cb(null);
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
  }, {
    key: 'registerExperiment',
    value: function registerExperiment(name, description) {
      this.experimentList.push({ name: name, description: description });

      return true;
    }
  }, {
    key: 'experimentResult',
    value: function experimentResult(ob) {
      var _this2 = this;

      setImmediate(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                url = window.location.hostname === 'localhost' || (0, _checkIp2.default)(window.location.hostname).isRfc1918 ? 'http://' + window.location.hostname + ':3095' : 'https://metrics.contimita.com/';
                _context.next = 4;
                return _axios2.default.post(url, {
                  data: ob
                });

              case 4:

                console.log('Ex: ' + ob.type + ' done');
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);

                console.log('Error while reporting metrics to experiment:', _context.t0);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[0, 7]]);
      })));
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
    var _this3 = this;

    _classCallCheck(this, VexLib);

    var _this = _possibleConstructorReturn(this, (VexLib.__proto__ || Object.getPrototypeOf(VexLib)).call(this));

    _this.experimentList = [];

    _this.consumeCallList = function () {
      var call = _this._call_list_.shift();
      if (call) {
        call();
        setImmediate(_this.consumeCallList);
      }
    };

    _this.consumeNoauthCallList = function () {
      var call = _this._noauth_call_list_.shift();
      if (call) {
        call();
        setImmediate(_this.consumeNoauthCallList);
      }
    };

    _this._socket_connect_ = function () {
      console.log('Socket connected');
      _this._is_connected_ = true;
      _this.consumeNoauthCallList();
    };

    _this._authed_ = function () {
      _this._is_authed_ = true;
      _this.consumeCallList();
    };

    _this._socket_close_ = function () {
      console.log('Socket closed');
      _this._is_connected_ = false;
    };

    _this._socket_newblock_ = function (hash) {
      _this.emit('new block', hash);
      //this.vex('')
    };

    _this._socket_newdbupdate_ = function () {
      _this.emit('new dbupdate');
      //this.vex('')
    };

    _this._socket_newnotifs_ = function (notifs) {
      _this.emit('new notifs', notifs);
    };

    _this._socket_updates_ = function (updates) {
      _this.emit('updates', updates);
    };

    _this.hasEmittedNeedauth = false;

    _this._promisify_ = function (func) {
      return function (method, params) {
        return new Promise(function (resolve, reject) {
          _this[func](method, params, function (err, data) {
            if (err) {
              resolve(err);
            } else {
              resolve(data);
            }
          });
        });
      };
    };

    _this.vexblockAsync = _this._promisify_('vexblock');
    _this._ex_createOrderEnabled = _this.registerExperiment('Crear ordenes', 'Crear órdenes usando xcpjsv2. Aumenta sustancialmente la velocidad de creación de órdenes.');
    _this._ex_createFiatDepositEnabled = _this.registerExperiment('Reporte de depósitos', 'Reporte de depósitos usando xcpjsv2. Aumenta sustancialmente la velocidad de generación de reportes de depósitos (sin tomar en cuenta el tamaño del archivo subido).');
    _this._ex_generateWithdrawalEnabled = _this.registerExperiment('Generar retiros (sin 2fa)', 'Generar retiros usando xcpjsv2, no soporta 2fa. Aumenta sustancialmente la velocidad de generación de retiros.');
    _this._ex_generateTransferEnabled = _this.registerExperiment('Generar transferencias (sin 2fa)', 'Generar transferencias usando xcpjsv2, no soporta 2fa. Aumenta sustancialmente la velocidad de generación de transferencias.');
    _this._ex_generateDepositAddressEnabled = _this.registerExperiment('Generar direcciones de depósito', 'Generar direcciones de depósito usando xcpjsv2. Aumenta sustancialmente la velocidad de las solicitudes de generación de direcciones de depósitos (aunque no influye en la velocidad de respuesta de las billeteras del exchange).');


    _this.lang = options.lang || 'EN';
    _this.exchangeAddress = options.exchangeAddress || '';
    _this.issuanceAddress = options.issuanceAddress || options.exchangeAddress || '';

    console.log('VexLib init', _this.lang, _this.exchangeAddress, build);
    _this.experiments = localStorageProxy.getItem('experiments') === '1';
    _this.axios = defaultAxios({
      headers: {
        test: _this.experiments ? '1' : '0'
      }
    });

    _this.lastVexSeq = 0;
    _this.cbList = {};
    _this.fiatTokensDivisor = {
      VEFT: 100,
      VEST: 100
    };

    if (_this.experiments) {
      _axios2.default.defaults.headers.common['test'] = _this.experiments ? '1' : '0';
    }

    _this._is_connected_ = false;
    _this._is_authed_ = false;
    _this._call_list_ = [];
    _this._noauth_call_list_ = [];

    _this.sKeyPairFromMnemonic = VexLib.keyPairFromMnemonic;

    _this.axios.get('/config').then(function (response) {
      if (response.data.exchangeAddress) {
        console.log('Config loaded', response.data);

        _this.exchangeAddress = response.data.exchangeAddress;
        _this.issuanceAddress = response.data.issuanceAddress || response.data.exchangeAddress;
        _this.proxyAgent = response.data.proxyAgent || '';
        _this.maintenance = response.data.maintenance || '';
        _this.unspendableAddress = 'mvCounterpartyXXXXXXXXXXXXXXW24Hef';

        _this._start_socket_();
      } else {
        _this.axios.get('/vexapi/config').then(function (response) {
          if (response.data.exchangeAddress) {
            console.log('Config loaded', response.data);

            _this.exchangeAddress = response.data.exchangeAddress;
            _this.issuanceAddress = response.data.issuanceAddress || response.data.exchangeAddress;
            _this.proxyAgent = response.data.proxyAgent || '';
            _this.maintenance = response.data.maintenance || '';
            _this.unspendableAddress = 'mvCounterpartyXXXXXXXXXXXXXXW24Hef';

            _this._start_socket_();
          } else {
            console.log('Config couldnt be loaded, continuing anyways');
          }
        });
      }
    }).catch(function () {
      console.log('No config, starting up anyways');

      _this._start_socket_();
    });

    _xcpjsv2.default.setNetwork('testnet');
    _xcpjsv2.default.setBroadcastService({ broadcast: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(txHex) {
          var result;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _this.axios.post('/vexapi/sendtx', {
                    rawtx: txHex
                  });

                case 2:
                  result = _context2.sent;
                  return _context2.abrupt('return', result);

                case 4:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this3);
        }));

        function broadcast(_x) {
          return _ref2.apply(this, arguments);
        }

        return broadcast;
      }() });

    _xcpjsv2.default.setUtxoService(_xcpjsv2.default.services.indexdUtxos(baseUrl + '/index/'));
    return _this;
  }

  _createClass(VexLib, [{
    key: 'addrTxs',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(addr) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _axios2.default.get(baseUrl + '/index/a/' + addr + '/txs');

              case 2:
                return _context3.abrupt('return', _context3.sent.data);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addrTxs(_x2) {
        return _ref3.apply(this, arguments);
      }

      return addrTxs;
    }()
  }, {
    key: 'parseRawTransaction',
    value: function parseRawTransaction(rawhex) {
      return _bitcoinjsLib2.default.Transaction.fromHex(rawhex);
    }
  }, {
    key: 'tokenDivisor',
    value: function tokenDivisor(tkn) {
      if (tkn in this.fiatTokensDivisor) {
        return this.fiatTokensDivisor[tkn];
      } else {
        return SATOSHIS;
      }
    }
  }, {
    key: '_start_socket_',
    value: function _start_socket_() {
      var _this4 = this;

      this.socket = (0, _socket2.default)(baseUrl, { path: '/vexapi/socketio/' });

      this.socket.on('connect', this._socket_connect_);
      this.socket.on('new block', this._socket_newblock_);
      this.socket.on('new dbupdate', this._socket_newdbupdate_);
      this.socket.on('new notifs', this._socket_newnotifs_);
      this.socket.on('updates', this._socket_updates_);
      this.socket.on('close', this._socket_close_);
      this.socket.on('error', function (err) {
        return console.log('Socket error:', err);
      });

      var vexApiHandler = function vexApiHandler(data) {
        if (typeof data.seq !== 'undefined' && data.seq in _this4.cbList) {
          var cb = _this4.cbList[data.seq];

          if (cb) {
            if (data.error) {
              cb(data.error);
            } else if (data.err) {
              cb(data.err);
            } else {
              cb(null, data.data);
            }

            delete _this4.cbList[data.seq];
          }
        } else {
          console.log('Message not expected', data.seq);
        }
      };

      this.socket.on('vex', vexApiHandler);
      this.socket.on('vexblock', vexApiHandler);
      this.socket.on('db', vexApiHandler);
      this.socket.on('ldb', vexApiHandler);
      this.socket.on('banks', vexApiHandler);
      this.socket.on('indexer', vexApiHandler);
      this.socket.on('proxy', vexApiHandler);
      this.socket.on('orders', vexApiHandler);
      this.socket.on('mdb', vexApiHandler);
      this.socket.on('need2fa', function (data) {
        return _this4.emit('need2fa', data);
      });
      this.socket.on('needauth', function (data) {
        return _this4.emit('needauth', data);
      });
      this.socket.on('authok', function () {
        _this4.emit('authok');_this4._authed_();
      });
    }
  }, {
    key: '_api_',
    value: function _api_(entry, method, params, cb, noAuthNeeded) {
      var _this5 = this;

      this.cbList[this.lastVexSeq] = cb;

      var doCall = function (seq) {
        return function () {
          _this5.socket.emit(entry, {
            method: method,
            params: params,
            seq: seq
          });
        };
      }(this.lastVexSeq);

      this.lastVexSeq++;

      if (this._is_authed_ || this._is_connected_ && noAuthNeeded) {
        //if (this._is_connected_) {
        doCall();
      } else {
        if (noAuthNeeded) {
          this._noauth_call_list_.push(doCall);
          console.log('Postergating ' + entry + '.' + method + ' call until connection');
        } else {
          this._call_list_.push(doCall);
          console.log('Postergating ' + entry + '.' + method + ' call until authorization');
        }

        if (!this.hasEmittedNeedauth) {
          this.hasEmittedNeedauth = true;
          setTimeout(function () {
            _this5.emit('needauth');
          }, 500);
        }
      }
    }
  }, {
    key: 'vex',
    value: function vex(method, params, cb, noAuthNeeded) {
      this._api_('vex', method, params, cb, noAuthNeeded);
    }
  }, {
    key: 'vexblock',
    value: function vexblock(method, params, cb) {
      this._api_('vexblock', method, params, cb);
    }
  }, {
    key: 'db',
    value: function db(method, params, cb, noAuthNeeded) {
      this._api_('db', method, params, cb, noAuthNeeded);
    }
  }, {
    key: 'dbAsync',
    value: function dbAsync(method, params) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6._api_('db', method, params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  }, {
    key: 'ldb',
    value: function ldb(method, params, cb) {
      this._api_('ldb', method, params, cb);
    }
  }, {
    key: 'mdb',
    value: function mdb(method, params, cb) {
      this._api_('mdb', method, params, cb);
    }
  }, {
    key: 'mdbAsync',
    value: function mdbAsync(method, params) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _this7._api_('mdb', method, params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  }, {
    key: 'index',
    value: function index(method, params, cb) {
      this._api_('index', method, params, cb);
    }
  }, {
    key: 'banks',
    value: function banks(method, params, cb) {
      this._api_('banks', method, params, cb);
    }
  }, {
    key: 'indexer',
    value: function indexer(method, params, cb) {
      this._api_('indexer', method, params, cb);
    }
  }, {
    key: 'proxy',
    value: function proxy(method, params, cb) {
      this._api_('proxy', method, params, cb);
    }
  }, {
    key: 'orders',
    value: function orders(method, params, cb) {
      this._api_('orders', method, params, cb);
    }
  }, {
    key: 'signAndBroadcastTransaction',
    value: function signAndBroadcastTransaction(rawtx, cb) {
      var _this8 = this;

      signTransaction(rawtx, function (signed) {
        _this8.axios.post('/vexapi/sendtx', {
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
      var _this9 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

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
          //console.log(data.result)
          var balances = data.result.reduce(function (p, x) {
            if (!(x.asset in p)) {
              p[x.asset] = new _bignumber2.default(x.quantity);
            } else {
              p[x.asset] = p[x.asset].plus(new _bignumber2.default(x.quantity));
            }
            return p;
          }, {});

          for (var asset in balances) {
            var divisor = SATOSHIS;
            if (asset in _this9.fiatTokensDivisor) {
              divisor = _this9.fiatTokensDivisor[asset];
            }
            balances[asset] = balances[asset].dividedBy(divisor).toNumber();
          }
          cb(null, balances);
        }
      });
    }
  }, {
    key: 'userEnabled',
    value: function userEnabled(cb) {
      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      /*this.index('', {url: `/a//utxos`}, (err, data) => {
        console.log('Got from utxo', err, data)
        if (err) {
          cb(err)
        } else {
          cb(null, data.length > 0)
        }
      })*/

      cb(null, true);
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
  }, {
    key: 'hasUtxos',
    value: function hasUtxos(cb) {
      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      this.vex('get_unspent_txouts', {
        address: currentAddress,
        unconfirmed: true
      }, function (err, data) {
        //console.log('Got from utxo', err, data)
        if (err) {
          cb(err);
        } else {
          cb(null, data.result && data.result.length > 0);
        }
      }, true);
    }
  }, {
    key: 'proxy_getOrderBook',
    value: function proxy_getOrderBook(give, get, isBid, cb) {
      var pair = give + '/' + get;
      this.proxy(this.proxyPairs[pair] + 'order_book', {
        give: give, get: get, isBid: isBid
      }, function (err, data) {
        if (err) {
          console.log('PGOB err', err);
          cb(err);
        } else {
          var book = isBid ? data.bids : data.asks;

          cb(null, { giveAsset: give, getAsset: get, book: book.map(function (x) {
              var funds = parseFloat(x.price) * parseFloat(x.volume);
              var remaining_give = funds * parseFloat(x.remaining_volume) / parseFloat(x.volume);
              return {
                rawGive: funds * SATOSHIS,
                rawGet: parseFloat(x.volume) * SATOSHIS,
                give: remaining_give,
                get: x.remaining_volume,
                price: x.price
              };
            })
          });
        }
      });
    }
  }, {
    key: 'getOrderBook',
    value: function getOrderBook(give, get, isBid, cb) {
      this.orders('orderBook', { give: give, get: get }, function (err, data) {
        if (err) {
          console.log('orderBookErr', err);
          cb(err);
        } else {
          cb(null, data);
        }
      });
    }
  }, {
    key: 'getOrderBook_old',
    value: function getOrderBook_old(give, get, isBid, cb) {
      var _this10 = this;

      var proxyGive = give.slice(0, -1);
      var proxyGet = get.slice(0, -1);
      if (!isBid) {
        var _ref4 = [proxyGet, proxyGive];
        proxyGive = _ref4[0];
        proxyGet = _ref4[1];
      }

      var pair = proxyGive + '/' + proxyGet;
      if (this.proxyPairs && pair in this.proxyPairs) {
        this.proxy_getOrderBook(proxyGive, proxyGet, isBid, cb);
        return;
      }

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

          var giveIsFiat = give in _this10.fiatTokensDivisor;
          var getIsFiat = get in _this10.fiatTokensDivisor;

          var giveDivisor = giveIsFiat ? _this10.fiatTokensDivisor[give] : SATOSHIS;
          var getDivisor = getIsFiat ? _this10.fiatTokensDivisor[get] : SATOSHIS;

          var properComparePrice = function properComparePrice(a, b) {
            if (giveIsFiat || getIsFiat) {
              var ba = new _bignumber2.default(a);
              var bb = new _bignumber2.default(b);

              return ba.toFixed(2) === bb.toFixed(2);
            } else {
              return a === b;
            }
          };

          //console.log(isBid, giveIsFiat, getIsFiat, giveDivisor, getDivisor, give, get)

          var res = data.result.map(function (x) {
            return {
              rawGive: isBid ? x.give_remaining : x.get_remaining,
              rawGet: isBid ? x.get_remaining : x.give_remaining,
              give: isBid ? divideLimited(x.give_remaining, giveDivisor) : divideLimited(x.get_remaining, getDivisor),
              get: isBid ? divideLimited(x.get_remaining, getDivisor) : divideLimited(x.give_remaining, giveDivisor),
              //price: isBid?(x.get_quantity / x.give_quantity * getDivisor / giveDivisor):(x.give_quantity / x.get_quantity * getDivisor / giveDivisor)
              price: isBid ? x.get_quantity / getDivisor / (x.give_quantity / giveDivisor) : x.give_quantity / x.get_quantity * getDivisor / giveDivisor
              //price: isBid?(x.get_quantity / x.give_quantity):(x.give_quantity / x.get_quantity)
            };
          }).sort(function (a, b) {
            return isBid ? a.price - b.price : b.price - a.price;
          }).reduce(function (arr, itm) {
            sumGive += itm.give; //isBid?itm.give:itm.get
            sumGet += itm.get; //isBid?itm.get:itm.give

            itm.sumGive = sumGive;
            itm.sumGet = sumGet;

            if (arr.length > 0) {
              var lastItem = arr[arr.length - 1];

              if (lastItem && properComparePrice(lastItem.price, itm.price)) {
                lastItem.sumGive = sumGive;
                lastItem.sumGet = sumGet;

                lastItem.give += itm.give;
                lastItem.get += itm.get;

                arr[arr.length - 1] = lastItem;
              } else {
                arr.push(itm);
              }
            } else {
              arr.push(itm);
            }
            return arr;
          }, []).map(function (itm) {
            itm.give = sanitizeNDecimals(itm.give, isBid ? giveDivisor : getDivisor);
            itm.get = sanitizeNDecimals(itm.get, isBid ? getDivisor : giveDivisor);
            itm.sumGive = sanitizeNDecimals(itm.sumGive, isBid ? giveDivisor : getDivisor);
            itm.sumGet = sanitizeNDecimals(itm.sumGet, isBid ? getDivisor : giveDivisor);
            return itm;
          });
          cb(null, { giveAsset: give, getAsset: get, book: res });
        }
      });
    }
  }, {
    key: 'getBlockTimes',
    value: function getBlockTimes(data, cb) {
      this.getBlockTimesAsync(data).then(function (result) {
        cb(result);
      }).catch(function (err) {
        cb(data);
      });
    }
  }, {
    key: 'getBlockTimesAsync',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var _this11 = this;

        var getbtime, i, bt;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                getbtime = function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(height) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            return _context4.abrupt('return', new Promise(function (resolve, reject) {
                              _this11.indexer('blocktime', { height: height }, function (err, data) {
                                if (err) {
                                  reject(err);
                                } else {
                                  resolve(data);
                                }
                              });
                            }));

                          case 1:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this11);
                  }));

                  return function getbtime(_x4) {
                    return _ref6.apply(this, arguments);
                  };
                }();

                i = 0;

              case 2:
                if (!(i < data.length)) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 5;
                return getbtime(data[i].block);

              case 5:
                bt = _context5.sent;

                data[i].time = bt.time;

              case 7:
                i++;
                _context5.next = 2;
                break;

              case 10:
                return _context5.abrupt('return', data);

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getBlockTimesAsync(_x3) {
        return _ref5.apply(this, arguments);
      }

      return getBlockTimesAsync;
    }()
  }, {
    key: 'getBlockTimesAsync_old',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
        var _this12 = this;

        var mapping, bindices, getBtime, btimes;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                mapping = {};
                _context6.prev = 1;
                bindices = data.map(function (x) {
                  return x.block;
                });

                getBtime = function getBtime(block) {
                  return new Promise(function (resolve, reject) {
                    _this12.indexer('blocktime', { height: block }, function (err, data) {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(data);
                      }
                    });
                  });
                };

                _context6.next = 6;
                return Promise.all(bindices.map(getBtime));

              case 6:
                btimes = _context6.sent;


                btimes.forEach(function (x) {
                  mapping[x.height] = Math.round(x.time / 1000);
                });
                _context6.next = 14;
                break;

              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6['catch'](1);

                console.log('getBlockTimes exception', _context6.t0);
                throw _context6.t0;

              case 14:
                return _context6.abrupt('return', data.map(function (x) {
                  return _extends({ time: mapping[x.block] * 1000 }, x);
                }));

              case 15:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1, 10]]);
      }));

      function getBlockTimesAsync_old(_x5) {
        return _ref7.apply(this, arguments);
      }

      return getBlockTimesAsync_old;
    }()
  }, {
    key: '_recentOrders_proxyPair_',
    value: function _recentOrders_proxyPair_(give, get, filters, cb) {
      var endpoint = 'get_orders';
      if (filters.filter(function (x) {
        return x.field === 'source' && x.value === sessionStorageProxy.getItem('currentAddress');
      }).length > 0) {
        endpoint = 'get_my_orders';
      }

      this.proxy(this.proxyPairs[give + '/' + get] + endpoint, {
        give: give, get: get, filters: filters
      }, function (err, data) {
        if (err) {
          console.log('ROPP error', err);
          cb(err);
        } else {
          console.log('ROPP', data);
          cb(null, data.map(function (x) {
            return {
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
            };
          }));
        }
      });
    }
  }, {
    key: '_recentOrders_',
    value: function _recentOrders_(give, get, filters, cb) {
      var _this13 = this;

      var proxyGive = give.slice(0, -1);
      var proxyGet = get.slice(0, -1);
      if (this.proxyPairs && proxyGive + '/' + proxyGet in this.proxyPairs) {
        this._recentOrders_proxyPair_(proxyGive, proxyGet, filters, cb);
        return;
      }

      var bidFilters = filters.map(function (x) {
        return x;
      });
      var askFilters = filters.map(function (x) {
        return x;
      });

      bidFilters.push({ "field": "give_asset", "op": "=", "value": give });
      bidFilters.push({ "field": "get_asset", "op": "=", "value": get });
      askFilters.push({ "field": "give_asset", "op": "=", "value": get });
      askFilters.push({ "field": "get_asset", "op": "=", "value": give });

      this.vex('get_orders', {
        filters: bidFilters,
        order_by: 'block_index',
        order_dir: 'DESC',
        limit: 100
      }, function (err, bidData) {
        if (err) {
          cb(err);
        } else {
          _this13.vex('get_orders', {
            filters: askFilters,
            order_by: 'block_index',
            order_dir: 'DESC',
            limit: 100
          }, function (err, askData) {
            if (err) {
              cb(err);
            } else {
              var totals = bidData.result.concat(askData.result).sort(function (a, b) {
                return b.block - a.block;
              });
              console.log('-++-> totals', totals);
              processResults(totals);
            }
          });
        }
      });

      var processResults = function processResults(data) {
        var orders = data.filter(function (itm) {
          return !itm.status.startsWith('invalid');
        }).map(function (itm) {
          /*let type, price, giq, geq
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
            let pgegi = new BigNumber(geq).dividedBy(giveDivisor) //.dividedBy(pgige)
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
          }*/

          var giveDivisor = itm.give_asset in _this13.fiatTokensDivisor ? _this13.fiatTokensDivisor[itm.give_asset] : SATOSHIS;
          var getDivisor = itm.get_asset in _this13.fiatTokensDivisor ? _this13.fiatTokensDivisor[itm.get_asset] : SATOSHIS;
          var type = itm.give_asset === get && itm.get_asset === give ? 'buy' : 'sell';

          var giveq = new _bignumber2.default(itm.give_quantity).minus(itm.give_remaining).dividedBy(giveDivisor);
          var getq = new _bignumber2.default(itm.get_quantity).minus(itm.get_remaining).dividedBy(getDivisor);
          var price = void 0;

          if (getq.isZero()) {
            price = new _bignumber2.default(itm.give_quantity).dividedBy(itm.get_quantity);
          } else {
            price = giveq.dividedBy(getq);
          }

          return {
            type: type,
            status: itm.status,
            block: itm.block_index,
            price: price.toNumber(),
            qty: giveq.toNumber(),
            total: getq.toNumber(),
            get: itm.get_quantity,
            give: itm.give_quantity,
            hash: itm.tx_hash,
            get_remaining: itm.get_remaining,
            give_remaining: itm.give_remaining
          };
        }).filter(function (x) {
          return !!x;
        }); /*.reduce((arr, itm) => {
            if (itm) {
            arr.push(itm)
            }
            return arr
            }, [])*/

        _this13.getBlockTimes(orders, function (data) {

          cb(null, data);
        });
      };
    }
  }, {
    key: 'getGlobalRecentOrders',
    value: function getGlobalRecentOrders(give, get, cb) {
      this._recentOrders_(give, get, [], cb);
    }
  }, {
    key: 'getMyRecentOrders',
    value: function getMyRecentOrders(give, get, addr, cb) {
      if (typeof addr === 'function' && !cb) {
        cb = addr;
        addr = null;
      }
      var currentAddress = addr || sessionStorageProxy.getItem('currentAddress');

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
    key: 'testDecryptData',
    value: function testDecryptData(data, password) {
      var key = _hash2.default.sha256().update(password).digest();
      var aesCtr = new _aesJs2.default.ModeOfOperation.ctr(key, new _aesJs2.default.Counter(5));
      var encryptedBytes = Buffer.from(data, 'hex');
      var decryptedBytes = aesCtr.decrypt(encryptedBytes);
      var decryptedText = _aesJs2.default.utils.utf8.fromBytes(decryptedBytes);

      try {
        var ob = JSON.parse(decryptedText);

        return ob;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: 'getUser',
    value: function getUser(email, password, cb) {
      var _this14 = this;

      var itemKey = '_user_data_' + email + '_';
      var userData = localStorageProxy.getItem(itemKey);

      var fail = function fail(msg, data) {
        cb(msg || 'no-user-found', data);
      };

      var success = function success(_ref8) {
        var address = _ref8.address,
            mnemonic = _ref8.mnemonic;

        sessionStorageProxy.setItem('currentAddress', address);
        sessionStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic));
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
          console.log('Bad local password');
          dcb(e);
        }
      };

      var store = function store(data) {
        localStorageProxy.setItem(itemKey, data);
      };

      var tryLogin = function tryLogin() {
        if (userData === null) {
          var husr = _hash2.default.sha256().update(email).digest('hex');
          _this14.axios.get('/vexapi/user/' + husr).then(function (response) {
            if (response.status === 200) {
              decrypt(response.data.cryptdata, function (err, data) {
                if (err) {
                  console.log('Login challenge', response.data.challenge);
                  fail('bad-data-or-bad-password');
                } else {
                  store(response.data.cryptdata);
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
              //fail('bad-data-or-bad-password')
              userData = null;
              tryLogin();
            } else {
              success(data);
            }
          });
        }
      };

      tryLogin();
    }
  }, {
    key: 'sendRegisterPkg',
    value: function sendRegisterPkg(userAddress, pkg, cb) {
      var _this15 = this;

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
          var encryptedHex = Buffer.from(intermediaryHex, 'hex').toString('base64');

          //console.log(encryptedHex, '---BYTES--->', encryptedHex.length)
          delete pkg['files'];
          _this15.axios.post('/vexapi/userdocs/' + userAddress, {
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
    key: 'replaceLocalUser',
    value: function replaceLocalUser(email, password, mnemonic, uiLang, cb) {
      var _this16 = this;

      var husr = _hash2.default.sha256().update(email).digest('hex');
      var tries = 2;

      var tryReplace = function tryReplace() {
        _this16.axios.get('/vexapi/user/' + husr).then(function (response) {
          var postChallenge = function postChallenge(sigResult) {
            if (!sigResult) {
              console.log('cant sign', sigResult);
              cb('couldnt-sign');
            } else {
              sessionStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic));
              // TODO: Obtener el usuario guardado en el servidor para tener el challenge y firmarlo
              _this16.createUser(email, password, uiLang, sigResult, function (err, data) {
                if (err && err === 'bad-signature' && tries > 0) {
                  tries--;
                  setImmediate(tryReplace);
                } else {
                  cb(err, data);
                }
              });
            }
          };

          /*if (externalToken) {
            sessionStorageProxy.setItem('device', externalToken.getName())
            externalToken.signMessage(challenge, postChallenge)
          } else {*/
          var keyPair = getKeyPairFromSessionStorage();
          console.log('Challenge to sig:', response.data.challenge);
          var signature = _bitcoinjsMessage2.default.sign(response.data.challenge, keyPair.privateKey, keyPair.compressed);

          var sigResult = signature.toString('base64');

          postChallenge(sigResult);
          //}
        }).catch(function (err) {
          if (tries > 0) {
            tries--;
            setImmediate(tryReplace);
          } else {
            cb(err);
          }
        });
      };

      tryReplace();
    }
  }, {
    key: 'signMessage',
    value: function signMessage(msg, cb) {
      var keyPair = getKeyPairFromSessionStorage();
      var signature = _bitcoinjsMessage2.default.sign(msg, keyPair.privateKey, keyPair.compressed);

      cb(null, signature.toString('base64'));
    }
  }, {
    key: 'createUser',
    value: function createUser(email, password, uiLang, signature, cb) {
      var _this17 = this;

      var externalToken = null;

      if ((typeof password === 'undefined' ? 'undefined' : _typeof(password)) === "object") {
        externalToken = password;
        password = null;
      }

      if (typeof cb === "undefined") {
        cb = signature;
        signature = null;
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
            sessionStorageProxy.setItem('device', externalToken.getName());
            localStorageProxy.setItem(itemKey, externalToken.getName());
            cb(null, { address: address, device: externalToken.getName() });
          } else {
            sessionStorageProxy.setItem('device', 'userpass');
            sessionStorageProxy.setItem('currentAddress', address);
            sessionStorageProxy.setItem('currentMnemonic', fixAccents(mnemonic));
            localStorageProxy.setItem(itemKey, encryptedHex);
            var keyPair = VexLib.keyPairFromMnemonic(mnemonic);
            cb(null, { address: address, mnemonic: mnemonic, keyPair: keyPair });
          }
        };

        _this17.axios.post('/vexapi/user', {
          userid: husr,
          email: email,
          cryptdata: encryptedHex,
          address: address, signature: signature
        }).then(function (response) {
          if (response.status === 200) {
            if (response.data.error) {
              fail(response.data.error);
            } else {
              success();
            }
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
        var mnemonic = void 0;

        mnemonic = sessionStorageProxy.getItem('currentMnemonic');
        if (!mnemonic) {
          mnemonic = _bip2.default.generateMnemonic(null, null, _bip2.default.wordlists[uiLang]);
        }

        var keyPair = VexLib.keyPairFromMnemonic(mnemonic);

        var _bitcoin = _bitcoinjsLib2.default.payments.p2pkh({ pubkey: keyPair.publicKey, network: _bitcoinjsLib2.default.networks.testnet }),
            address = _bitcoin.address; //keyPair.getAddress()

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
    key: 'proxy_createOrder',
    value: function proxy_createOrder(currentAddress, giveAsset, giveAmount, getAsset, getAmount, cb) {
      if (!this.proxyAgent) {
        console.log('Error: Proxy agent not configured on server');
        cb(new Error('Proxy agent not configured on server'));
        return;
      }

      this.vex('create_send', {
        source: currentAddress,
        destination: this.proxyAgent,
        asset: giveAsset,
        quantity: giveAmount,
        memo: 'PRX:OP:' + getAsset + ':' + getAmount
      }, function (err, data) {
        if (err) {
          console.log('Error on Proxy create order', err);
          cb(err);
        } else if (data.error) {
          console.log('Soft Error on Proxy create order', data.error);
          cb(data.error);
        } else {
          cb(null, data.result);
        }
      });
    }
  }, {
    key: 'createOrder',
    value: function createOrder(giveAsset, giveAmount, getAsset, getAmount, cb) {
      var _this18 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var proxyGive = giveAsset.slice(0, -1);
      var proxyGet = getAsset.slice(0, -1);

      var pair = proxyGive + '/' + proxyGet;
      var invertedPair = proxyGet + '/' + proxyGive;
      if (this.proxyPairs && (pair in this.proxyPairs || invertedPair in this.proxyPairs)) {
        this.proxy_createOrder(currentAddress, giveAsset, giveAmount, getAsset, getAmount, cb);
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this18.emit('need-login');
        }

        cb(err || 'error-creating-order');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      if (this.experiments && this._ex_createOrderEnabled) {
        var doExperiment = function () {
          var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var res;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return _xcpjsv2.default.order(currentAddress, giveAsset, giveAmount, getAsset, getAmount);

                  case 2:
                    res = _context7.sent;

                    success(res);
                    _this18.experimentResult({
                      type: 'createOrder',
                      address: currentAddress, giveAsset: giveAsset, giveAmount: giveAmount, getAsset: getAsset, getAmount: getAmount, res: res
                    });

                  case 5:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this18);
          }));

          return function doExperiment() {
            return _ref9.apply(this, arguments);
          };
        }();

        doExperiment();
      } else {
        this.axios.post('/vexapi/order', {
          "give_asset": giveAsset,
          "give_quantity": giveAmount,
          "get_asset": getAsset,
          "get_quantity": getAmount,
          "source": currentAddress
        }).then(function (response) {
          if (response.status === 200) {
            signTransaction(response.data.result, function (signed) {
              _this18.axios.post('/vexapi/sendtx', {
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
    }
  }, {
    key: 'cancelOrder',
    value: function cancelOrder(txid, cb) {
      var _this19 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {

        if (err.response && err.response.status === 401) {
          _this19.emit('need-login');
        }

        cb('error-creating-cancel');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      // TODO update xcpjsv2 to support cancels
      this.axios.post('/vexapi/cancelorder', {
        "offer_hash": txid,
        "source": currentAddress
      }).then(function (response) {
        if (response.status === 200) {
          signTransaction(response.data.result, function (signed) {
            _this19.axios.post('/vexapi/sendtx', {
              rawtx: signed
            }).then(function (resp) {
              if (resp.data.error) {
                fail(resp.data.error);
              } else {
                console.log('Success cancel', resp.data.result);
                success(resp.data.result);
              }
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
    key: 'reportFiatDeposit',
    value: function reportFiatDeposit(getToken, getAmount, depositId, bankName, files, cb) {
      var _this20 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {

        if (err.response && err.response.status === 401) {
          _this20.emit('need-login');
        }

        console.log(err);

        cb('error-creating-report: ' + err);
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      var uploadData = function uploadData(txid) {
        _this20.axios.get('/vexapi/sesskey/' + currentAddress).then(function (response) {
          if (response.status === 200) {
            var key = Buffer.from(response.data.key, 'hex');
            var aesCtr = new _aesJs2.default.ModeOfOperation.ctr(key, new _aesJs2.default.Counter(5));
            var msg = JSON.stringify(files);
            var textBytes = _aesJs2.default.utils.utf8.toBytes(msg);
            var encryptedBytes = aesCtr.encrypt(textBytes);
            var intermediaryHex = _aesJs2.default.utils.hex.fromBytes(encryptedBytes);
            var encryptedHex = Buffer.from(intermediaryHex, 'hex').toString('base64');

            //console.log(encryptedHex, '---BYTES--->', encryptedHex.length)
            _this20.axios.post('/vexapi/deprep/' + currentAddress, {
              data: encryptedHex,
              txid: txid
            }).then(function (data) {
              success(txid);
            }).catch(function (err) {
              fail(err);
            });
          } else {
            fail();
          }
        }).catch(function (err) {
          fail(err);
        });
      };

      if (this.experiments && this._ex_createFiatDepositEnabled) {
        var doExperiment = function () {
          var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var res;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return _xcpjsv2.default.broadcast(currentAddress, Math.floor(Date.now() / 1000), 0, null, getToken + ':' + getAmount + ':' + depositId + ':' + bankName);

                  case 2:
                    res = _context8.sent;

                    console.log('DEP:', res);
                    uploadData(res.data.result);

                    _this20.experimentResult({
                      type: 'createFiatDeposit',
                      address: currentAddress, memo: getToken + ':' + getAmount + ':' + depositId + ':' + bankName, res: res
                    });

                  case 6:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this20);
          }));

          return function doExperiment() {
            return _ref10.apply(this, arguments);
          };
        }();

        doExperiment();
      } else {
        this.axios.post('/vexapi/report', {
          "text": getToken + ':' + getAmount + ':' + depositId + ':' + bankName,
          "source": currentAddress
        }).then(function (response) {
          if (response.status === 200) {
            signTransaction(response.data.result, function (signed) {
              return _this20.axios.post('/vexapi/sendtx', {
                rawtx: signed
              }).then(function (response) {
                var txid = response.data.result;

                uploadData(response.data.result);
              });
            });
          } else {
            fail();
          }
        }).catch(function (err) {
          fail(err);
        });
      }
    }
  }, {
    key: 'generateWithdrawal',
    value: function generateWithdrawal(token, amount, address, info, cb) {
      var _this21 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this21.emit('need-login');
        }

        cb(err || 'error-generating-withdrawal');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      var memo = void 0;
      var isHex = false;

      var validate = function validate(addr, net) {
        if (net === 'NEM') {
          return (address.indexOf('N') == 0 || address.indexOf('n') == 0) && address.length == 40;
        } else {
          try {
            var decaddr = _bs2.default.decode(addr);
            console.log('Decoded addr', decaddr);

            return true;
          } catch (e) {
            return false;
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
      };

      if (token in this.fiatTokensDivisor) {
        memo = 'v2:f:' + address + ':' + info;
      } else {
        var tokNet = token.slice(0, -1);

        /*if (tokNet === 'PTR') {
          tokNet = 'NEM'
          address = address.split('-').join('')
        }*/

        if (validate(address, tokNet)) {
          if (!info) {
            info = '';
          }
          memo = 'v2:c:' + address + ':' + info;
        } else {
          cb('invalid-address');
          return;
        }
      }

      /*if (info && (info.length > 0)) {
        memo = `:`
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

      var divisor = SATOSHIS;
      if (token in this.fiatTokensDivisor) {
        divisor = this.fiatTokensDivisor[token];
      }
      amount = Math.round(parseFloat(amount) * divisor);

      if (this.experiments && this._ex_generateWithdrawalEnabled) {
        var doExperiment = function () {
          var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var res;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return _xcpjsv2.default.send(currentAddress, _this21.unspendableAddress, token, amount, memo, isHex);

                  case 2:
                    res = _context9.sent;

                    success(res);

                    _this21.experimentResult({
                      type: 'generateWithdrawal',
                      address: currentAddress, token: token, amount: amount, memo: memo, isHex: isHex, res: res
                    });

                  case 5:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this21);
          }));

          return function doExperiment() {
            return _ref11.apply(this, arguments);
          };
        }();

        doExperiment();
      } else {
        this.axios.post('/vexapi/withdraw', {
          "asset": token,
          "quantity": amount,
          "memo": memo,
          "memo_is_hex": isHex,
          "source": currentAddress,
          "encoding": "opreturn"
        }).then(function (response) {
          if (response.status === 200) {
            if (response.data.error) {
              fail(response.data.error);
            } else if (!response.data) {
              fail(response.error);
            } else {
              signTransaction(response.data.result, function (signed) {
                _this21.axios.post('/vexapi/sendtx', {
                  rawtx: signed
                }).then(function (response) {
                  success(response.data.result);
                });
              });
            }
          } else {
            fail('error-building-tx');
          }
        }).catch(function (err) {
          fail(err);
        });
      }
    }
  }, {
    key: 'generateTransfer',
    value: function generateTransfer(token, amount, destination, memo, twofa, cb) {
      var _this22 = this;

      if (!cb && twofa && typeof twofa === 'function') {
        cb = twofa;
        twofa = null;
      }
      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');
        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this22.emit('need-login');
        }

        cb(err || 'error-generating-transfer');
      };

      var success = function success(txid) {
        cb(null, txid);
      };

      var validate = function validate(addr, net) {
        try {
          var decaddr = _bs2.default.decode(addr);
          console.log('Decoded addr', decaddr);

          return true;
        } catch (e) {
          return false;
        }
      };

      var divisor = SATOSHIS;
      if (token in this.fiatTokensDivisor) {
        divisor = this.fiatTokensDivisor[token];
      }
      amount = Math.round(parseFloat(amount) * divisor);

      var csOb = {
        source: currentAddress,
        destination: destination, asset: token, quantity: amount, memo: memo
      };

      if (twofa) {
        csOb.twofa = twofa;
      }

      if (this.experiments && this._ex_generateTransferEnabled) {
        var doExperiment = function () {
          var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
            var res;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    console.log('csOb:', csOb);
                    _context10.next = 3;
                    return _xcpjsv2.default.send(csOb.source, csOb.destination, csOb.asset, csOb.quantity, csOb.memo);

                  case 3:
                    res = _context10.sent;

                    console.log('RES: ', res);
                    success(res.data.result);
                    _this22.experimentResult({
                      type: 'generateTransfer',
                      address: currentAddress, csOb: csOb, res: res
                    });

                  case 7:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, _this22);
          }));

          return function doExperiment() {
            return _ref12.apply(this, arguments);
          };
        }();

        doExperiment();
      } else {
        this.vex('create_send', csOb, function (err, data) {
          if (err) {
            console.log('err', err);
            fail(err);
          } else if (data.error) {
            console.log('err', data.error);
            fail(data.error);
          } else {
            signTransaction(data.result, function (signed) {
              _this22.axios.post('/vexapi/sendtx', {
                rawtx: signed
              }).then(function (response) {
                success(response.data.result);
              }).catch(function (err) {
                fail(err);
              });
            });
          }
        });
      }

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

    /*generateCodeWithdrawal(token, amount, code, cb) {
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
       let memo = `admin:`
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
         cb('error-creating-report')
      }
       let success = (txid) => {
        cb(null, txid)
      }
       this.axios.post('/vexapi/report', {
        "text": `::`,
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
    }*/

  }, {
    key: 'getFiatDepositReports',
    value: function getFiatDepositReports(cb) {
      var currentAddress = sessionStorageProxy.getItem('currentAddress');

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
    value: function getWithdraws(addr, cb) {
      if (!cb && typeof addr === 'function') {
        cb = addr;
        addr = null;
      }

      var currentAddress = addr || sessionStorageProxy.getItem('currentAddress');

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
    value: function getDeposits(addr, cb) {
      var _this23 = this;

      if (!cb && typeof addr === 'function') {
        cb = addr;
        addr = null;
      }

      var currentAddress = addr || sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this23.emit('need-login');
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
      var _this24 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this24.emit('need-login');
        }

        cb(err || 'error-getting-deposits');
      };

      var success = function success(status) {
        cb(null, status);
      };

      if (this.experiments && this._ex_generateDepositAddressEnabled) {
        var doExperiment = function () {
          var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
            var res;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return _xcpjsv2.default.broadcast(currentAddress, Math.floor(Date.now() / 1000), 0, null, 'GENADDR:' + token);

                  case 2:
                    res = _context11.sent;

                    success(res);
                    _this24.experimentResult({
                      type: 'generateDepositAddress',
                      address: currentAddress, token: token, res: res
                    });

                  case 5:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, _callee11, _this24);
          }));

          return function doExperiment() {
            return _ref13.apply(this, arguments);
          };
        }();

        doExperiment();
      } else {
        this.vex('create_broadcast', {
          source: currentAddress,
          text: 'GENADDR:' + token,
          fee_fraction: 0,
          fee: 10000,
          timestamp: Math.floor(Date.now() / 1000),
          value: 0,
          fee_per_kb: 10000
        }, function (err, data) {
          if (err) {
            fail(err);
          } else {
            signTransaction(data.result, function (signedTransaction) {
              _this24.axios.post('/vexapi/sendtx', {
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
    }
  }, {
    key: 'getTokenDepositAddress',
    value: function getTokenDepositAddress(token, cb) {
      var _this25 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('login-first');
        this.emit('need-login');

        return;
      }

      var fail = function fail(err) {
        if (err.response && err.response.status === 401) {
          _this25.emit('need-login');
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
          value: this.issuanceAddress
        }],
        order_by: 'tx_index',
        order_dir: 'DESC',
        status: 'valid'
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
      var currentAddress = sessionStorageProxy.getItem('currentAddress');

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

      console.log('Current address:', currentAddress);
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
    value: function localLogin(ops, cb) {
      var _this26 = this;

      var externalToken = null;
      var twofacode = null;

      if (typeof cb === 'undefined') {
        cb = ops;
        ops = null;
      }

      if (ops && typeof ops === 'string') {
        externalToken = ops;
      } else if (ops && (typeof ops === 'undefined' ? 'undefined' : _typeof(ops)) === 'object') {
        externalToken = ops['externalToken'] || null;
        twofacode = ops['twofacode'] || null;
      }

      var sign = function sign(currentAddress) {
        sessionStorageProxy.setItem('currentAddress', currentAddress);
        _this26.getChallenge(function (err, challenge) {
          if (err) {
            console.log('Error getting challenge');
            cb(err);
          } else {
            var postChallenge = function postChallenge(sigResult) {
              if (!sigResult) {
                console.log('cant sign', sigResult);
                cb('couldnt-sign');
              } else {
                console.log('signature ready, posting');
                _this26.axios.post('/vexapi/challenge/' + currentAddress, { signature: sigResult }).then(function (response) {
                  console.log('Got response from sig', response);
                  if (response.data.success) {
                    _this26.axios = defaultAxios({ headers: {
                        'addr': currentAddress,
                        'token': response.data.accessToken
                      } });

                    /*if (!this._is_authed_) {
                      this.emit('needauth')
                    }*/

                    _this26.userEnabled(function (err, isEnabled) {
                      if (err) {
                        cb(err);
                      } else {
                        if (isEnabled) {
                          _this26._authed_();
                          _this26.socket.emit('auth', { address: currentAddress, token: response.data.accessToken, twofa: twofacode });

                          var device = sessionStorageProxy.getItem('device');

                          if (device === 'userpass' || device === null) {
                            _xcpjsv2.default.services.transactionSigner.registerSigner(currentAddress, function () {
                              var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(tx) {
                                var keyPair, signedHex;
                                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                                  while (1) {
                                    switch (_context12.prev = _context12.next) {
                                      case 0:
                                        keyPair = getKeyPairFromSessionStorage();
                                        _context12.next = 3;
                                        return new Promise(function (resolve) {
                                          return buildAndSign(keyPair, tx, resolve);
                                        });

                                      case 3:
                                        signedHex = _context12.sent;
                                        return _context12.abrupt('return', signedHex);

                                      case 5:
                                      case 'end':
                                        return _context12.stop();
                                    }
                                  }
                                }, _callee12, _this26);
                              }));

                              return function (_x6) {
                                return _ref14.apply(this, arguments);
                              };
                            }());
                          } else if (device === 'trezor') {
                            _xcpjsv2.default.services.transactionSigner.registerSigner(currentAddress, function () {
                              var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(tx) {
                                var Trezor, signedHex;
                                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                                  while (1) {
                                    switch (_context13.prev = _context13.next) {
                                      case 0:
                                        Trezor = devices[device](0);
                                        _context13.next = 3;
                                        return new Promise(function (resolve, reject) {
                                          console.log('Signer TRZR', tx);
                                          Trezor.signTx(tx.__tx.ins, tx.__tx.outs, function (err, tx) {
                                            if (err) {
                                              console.log('Trezor ERR:');
                                              console.log(err);
                                              console.trace();
                                              reject(null);
                                            } else {
                                              console.log('Serialized TX:', tx);

                                              resolve(tx);
                                            }
                                          });
                                        });

                                      case 3:
                                        signedHex = _context13.sent;
                                        return _context13.abrupt('return', signedHex);

                                      case 5:
                                      case 'end':
                                        return _context13.stop();
                                    }
                                  }
                                }, _callee13, _this26);
                              }));

                              return function (_x7) {
                                return _ref15.apply(this, arguments);
                              };
                            }());
                          }

                          cb(null, response.data);
                        } else {
                          cb('user-not-enabled');
                        }
                      }
                    });
                  } else {
                    console.log('challenge error', response.data);
                    cb('challenge-error');
                  }
                }).catch(function (err) {
                  console.log('challenge exception', err);
                  cb(err);
                });
              }
            };

            if (externalToken) {
              sessionStorageProxy.setItem('device', externalToken.getName());
              externalToken.signMessage(challenge, postChallenge);
            } else {
              var keyPair = getKeyPairFromSessionStorage();
              var signature = _bitcoinjsMessage2.default.sign(challenge, keyPair.privateKey, keyPair.compressed);

              var sigResult = signature.toString('base64');

              postChallenge(sigResult);
            }
          }
        });
      };

      if (!externalToken) {
        sign(sessionStorageProxy.getItem('currentAddress'));
      } else {
        externalToken.getAddress(sign);
      }
    }
  }, {
    key: 'remoteLogin',
    value: function remoteLogin(email, password, externalToken, cb) {
      var _this27 = this;

      var ob = {};
      if (typeof cb === "undefined") {
        cb = externalToken;
        externalToken = null;
      } else {
        ob.externalToken = externalToken;
      }

      if (email.indexOf("\n") > 0) {
        var spl = email.split("\n");
        email = spl[0];
        ob.twofacode = spl[1];
      }

      if (externalToken) {
        this.localLogin({ externalToken: externalToken }, cb);
      } else {
        this.getUser(email, password, function (err, userData) {
          if (err) {
            if (err === 'bad-data-or-bad-password') {
              console.log('Attempting local only login');
              _this27.localLogin(ob, cb);
            } else {
              console.log('Unrecoverable error while trying to login', email);
              cb(err);
            }
          } else {
            console.log('Attempting local only login');
            _this27.localLogin(ob, cb);
          }
        });
      }
    }
  }, {
    key: 'remoteLogout',
    value: function remoteLogout(cb) {
      var _this28 = this;

      var currentAddress = sessionStorageProxy.getItem('currentAddress');

      if (!currentAddress) {
        cb('needs-html-login-first');

        return;
      }

      this.axios.get('/vexapi/logout').then(function () {
        _this28.axios = defaultAxios();
        sessionStorageProxy.removeItem('currentAddress');
        sessionStorageProxy.removeItem('currentMnemonic');
        _xcpjsv2.default.services.transactionSigner.unregisterSigner(currentAddress);
        cb(null, true);
      }).catch(function (err) {
        _this28.axios = defaultAxios();
        sessionStorageProxy.removeItem('currentAddress');
        sessionStorageProxy.removeItem('currentMnemonic');
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
          cb(null, data.result.filter(function (x) {
            return !(x[0] === 'A' || x[x.length - 1] !== 'T');
          }));
        }
      });
    }
  }, {
    key: 'getFees',
    value: function getFees(give, get, cb) {
      var value = void 0;

      if (give === '*') {
        value = 'options fee:%:%';
      } else {
        value = ('options fee:%:%:' + give + ':' + get).toLowerCase();
      }

      this.vex('get_broadcasts', {
        filters: [{
          field: 'text',
          op: 'LIKE',
          value: value
        }, {
          field: 'source',
          op: '==',
          value: this.exchangeAddress
        }],
        status: 'valid'
      }, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data.result.length > 0) {
            var text = data.result.pop().text;
            var structure = /options fee:(0\.\d+):(0\.\d+):?([a-zA-Z]{4,12})?:?([a-zA-Z]{4,12})?/.exec(text);

            if (structure.length !== 5) {
              cb('no-fee');
            } else {
              cb(null, {
                feeMaker: structure[1],
                feeTaker: structure[2]
              });
            }
          } else {
            cb('no-fee');
          }
        }
      });
    }
  }, {
    key: 'setFee',
    value: function setFee(giveAsset, getAsset, feeMaker, feeTaker, cb) {
      this.db('set_fee', {
        giveAsset: giveAsset, getAsset: getAsset,
        feeMaker: feeMaker, feeTaker: feeTaker
      }, function (err, data) {
        if (err) {
          console.log('SETFEE', err);
          cb(err);
        } else {
          cb(null, data);
        }
      });
    }
  }, {
    key: 'getWIF',
    value: function getWIF() {
      var device = sessionStorageProxy.getItem('device');

      if (device === 'userpass' || device === null) {
        var keyPair = getKeyPairFromSessionStorage();
        if (keyPair) {
          return keyPair.toWIF();
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }, {
    key: 'createSendFromWif',
    value: function createSendFromWif(wif, quantity, destination, asset, cb) {
      var _this29 = this;

      var keyPair = _bitcoinjsLib2.default.ECPair.fromWIF(wif, _bitcoinjsLib2.default.networks.testnet);

      var finish = function finish(rawHex) {
        var tx = _bitcoinjsLib2.default.Transaction.fromHex(rawHex);

        buildAndSign(keyPair, tx, function (signed) {
          _this29.axios.post('/vexapi/ext_sendtx', {
            rawtx: signed
          }).then(function (response) {
            cb(null, response.data.result);
          }).catch(function (err) {
            cb(err);
          });
        });
      };

      this.vex('create_send', {
        source: keyPair.getPublicKeyBuffer().toString('hex'),
        destination: destination, asset: asset, quantity: quantity
      }, function (err, data) {
        if (err) {
          console.log('err', err);
          cb(err);
        } else if (data.error) {
          console.log('err', data.error);
          cb(data.error);
        } else {
          console.log('data', data.result);
          //cb(null, data.result)
          finish(data.result);
        }
      });
    }
  }, {
    key: 'addressFromMnemonic',
    value: function addressFromMnemonic(mnemonic) {
      var keyPair = VexLib.keyPairFromMnemonic(mnemonic);

      var _bitcoin = _bitcoinjsLib2.default.payments.p2pkh({ pubkey: keyPair.publicKey, network: _bitcoinjsLib2.default.networks.testnet }),
          address = _bitcoin.address;

      return address;
    }
  }, {
    key: 'setExperiments',
    value: function setExperiments(n) {
      localStorageProxy.setItem('experiments', n);
      this.experiments = n === '1';

      _axios2.default.defaults.headers.common['test'] = this.experiments ? '1' : '0';
    }
  }, {
    key: 'getCurrentStorage',
    value: function getCurrentStorage() {
      return {
        local: localStorageProxy,
        session: sessionStorageProxy
      };
    }
  }], [{
    key: 'keyPairFromMnemonic',
    value: function keyPairFromMnemonic(mnemonic) {
      var seedHex = _bip2.default.mnemonicToSeedHex(fixAccents(mnemonic));

      var d = _bitcoinjsLib2.default.crypto.sha256(Buffer.from(seedHex, 'hex'));
      return _bitcoinjsLib2.default.ECPair.fromPrivateKey(d, { network: _bitcoinjsLib2.default.networks.testnet });
    }
  }]);

  return VexLib;
}(_events2.default);

exports.default = VexLib;
