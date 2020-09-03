"use strict";

var _dgram = _interopRequireDefault(require("dgram"));

var _events = _interopRequireDefault(require("events"));

var _safeBuffer = require("safe-buffer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports = /*#__PURE__*/function () {
  function TPLSmartDevice(ip) {
    _classCallCheck(this, TPLSmartDevice);

    this.ip = ip;
  }
  /**
   * Scan for lightbulbs on your network
   * @module scan
   * @param {string} filter  [none] Only return devices with this class, (ie 'IOT.SMARTBULB')
   * @param {string} broadcast ['255.255.255.255'] Use this broadcast IP
   * @return {EventEmitter} Emit `light` events when lightbulbs are found
   * @example
  ```js
  // turn first discovered light off
  const scan = TPLSmartDevice.scan()
  .on('light', light => {
    light.power(false)
      .then(status => {
        console.log(status)
        scan.stop()
      })
  })
  ```
   */


  _createClass(TPLSmartDevice, [{
    key: "info",

    /**
     * Get info about the TPLSmartDevice
     * @module info
     * @return {Promise} Resolves to info
     * @example
    ```js
    // get info about a light
    const light = new TPLSmartDevice('10.0.0.200')
    light.info()
    .then(info => {
      console.log(info)
    })
    ```
     */
    value: function info() {
      return this.send({
        system: {
          get_sysinfo: {}
        }
      }).then(function (info) {
        return info.system.get_sysinfo;
      });
    }
    /**
     * Send a message to a lightbulb (for RAW JS message objects)
     * @module send
     * @param  {Object} msg Message to send to bulb
     * @return {Promise}    Resolves with answer
     * @example
    ```js
    const light = new TPLSmartDevice('10.0.0.200')
    light.send({
    'smartlife.iot.smartbulb.lightingservice': {
      'transition_light_state': {
        'on_off': 1,
        'transition_period': 0
      }
    }})
    .then(response => {
    console.log(response)
    })
    .catch(e => console.error(e))
    ```
     */

  }, {
    key: "send",
    value: function send(msg) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_this.ip) {
          return reject(new Error('IP not set.'));
        }

        var client = _dgram["default"].createSocket('udp4');

        var message = _this.encrypt(_safeBuffer.Buffer.from(JSON.stringify(msg)));

        client.send(message, 0, message.length, 9999, _this.ip, function (err, bytes) {
          if (err) {
            return reject(err);
          }

          client.on('message', function (msg) {
            resolve(JSON.parse(_this.decrypt(msg).toString()));
            client.close();
          });
        });
      });
    }
    /**
     * Set power-state of lightbulb
     * @module power
     * @param {Boolean} powerState On or off
     * @param {Number}  transition Transition to new state in this time
     * @param {Object}  options    Object containing `mode`, `hue`, `saturation`, `color_temp`, `brightness`
     * @returns {Promise}          Resolves to output of command
     * @example
     * ```js
    // turn a light on
    const light = new TPLSmartDevice('10.0.0.200')
    light.power(true)
    .then(status => {
      console.log(status)
    })
    .catch(err => console.error(err))
    ```
     */

  }, {
    key: "power",
    value: function power() {
      var _this2 = this;

      var powerState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.info().then(function (info) {
        if (typeof info.relay_state !== 'undefined') {
          return _this2.send({
            system: {
              set_relay_state: {
                state: powerState ? 1 : 0
              }
            }
          });
        } else {
          return _this2.send({
            'smartlife.iot.smartbulb.lightingservice': {
              transition_light_state: _objectSpread({
                ignore_default: 1,
                on_off: powerState ? 1 : 0,
                transition_period: transition
              }, options)
            }
          }).then(function (r) {
            return r['smartlife.iot.smartbulb.lightingservice'].transition_light_state;
          });
        }
      });
    }
    /**
       * Set led-state of lightbulb
       * @module led
       * @param {Boolean} ledState On or off
       * @returns {Promise}          Resolves to output of command
       * @example
       * ```js
    // turn the LED status light on
    const light = new TPLSmartDevice('10.0.0.200')
    light.led(true)
    .then(status => {
    console.log(status)
    })
    .catch(err => console.error(err))
    ```
     */

  }, {
    key: "led",
    value: function led() {
      var ledState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return this.send({
        system: {
          set_led_off: {
            off: ledState ? 0 : 1
          }
        }
      });
    }
    /**
     * Set the name of lightbulb
     * @module name
     * @param {String} newAlias 
     * @returns {Promise}          Resolves to output of command
     * @example
     * ```js
    // change the name of a light
    const light = new TPLSmartDevice('10.0.0.200')
    light.name("New Name")
    .then(status => {
    console.log(status)
    })
    .catch(err => console.error(err))
    ```
    */

  }, {
    key: "name",
    value: function name(newAlias) {
      var _this3 = this;

      return this.info().then(function (info) {
        return typeof info.dev_name !== 'undefined' ? _this3.send({
          system: {
            set_dev_alias: {
              alias: newAlias
            }
          }
        }) : _this3.send({
          'smartlife.iot.common.system': {
            set_dev_alias: {
              alias: newAlias
            }
          }
        });
      });
    }
    /**
     * Get schedule info
     * @module daystat
     * @param  {Number} month Month to check: 1-12
     * @param  {Number} year  Full year to check: ie 2017
     * @return {Promise}      Resolves to schedule info
     * @example
    ```js
    // get the light's schedule for 1/2017
    const light = new TPLSmartDevice('10.0.0.200')
    light.schedule(1, 2017)
    .then(schedule => {
      console.log(schedule)
    })
    .catch(e => console.error(e))
    ```
     */

  }, {
    key: "daystat",
    value: function daystat(month, year) {
      var now = new Date();
      month = month || now.getMonth() + 1;
      year = year || now.getFullYear();
      return this.send({
        'smartlife.iot.common.schedule': {
          get_daystat: {
            month: month,
            year: year
          }
        }
      }).then(function (r) {
        return r['smartlife.iot.common.schedule'].get_daystat;
      });
    }
    /**
     * Get cloud info from bulb
     * @module cloud
     * @return {Promise} Resolves to cloud info
     * @example
    ```js
    // get the cloud info for the light
    const light = new TPLSmartDevice('10.0.0.200')
    light.cloud()
    .then(info => {
      console.log(info)
    })
    .catch(e => console.error(e))
    ```
     */

  }, {
    key: "cloud",
    value: function cloud() {
      return this.send({
        'smartlife.iot.common.cloud': {
          get_info: {}
        }
      }).then(function (r) {
        return r['smartlife.iot.common.cloud'].get_info;
      });
    }
    /**
     * Get schedule from bulb
     * @module schedule
     * @return {Promise} Resolves to schedule info
     * @example
    ```js
    // get the bulb's schedule
    const light = new TPLSmartDevice('10.0.0.200')
    light.schedule()
    .then(schedule => {
      console.log(schedule)
    })
    .catch(e => console.error(e))
    ```
     */

  }, {
    key: "schedule",
    value: function schedule() {
      return this.send({
        'smartlife.iot.common.schedule': {
          get_rules: {}
        }
      }).then(function (r) {
        return r['smartlife.iot.common.schedule'].get_rules;
      });
    }
    /**
     * Get operational details from bulb
     * @module details
     * @return {Promise} Resolves to operational details
     * @example
    ```js
    // get some extra details about the light
    const light = new TPLSmartDevice('10.0.0.200')
    light.details()
    .then(details => {
      console.log(details)
    })
    .catch(e => console.error(e))
    ```
     */

  }, {
    key: "details",
    value: function details() {
      return this.send({
        'smartlife.iot.smartbulb.lightingservice': {
          get_light_details: {}
        }
      }).then(function (r) {
        return r;
      });
    }
    /**
     * Reboot the device
     * @module reboot
     * @returns {Promise} Resolves to output of command
     * @example
    ```js
    // get some extra details about the light
    const light = new TPLSmartDevice('10.0.0.200')
    light.reboot()
    .then(status => {
      console.log(status)
    })
    .catch(e => console.error(e))
    ```
     */

  }, {
    key: "reboot",
    value: function reboot() {
      return this.send({
        'smartlife.iot.common.system': {
          reboot: {
            delay: 1
          }
        }
      });
    }
    /**
     * Badly encrypt message in format bulbs use
     * @module encrypt
     * @param  {Buffer} buffer Buffer of data to encrypt
     * @param  {Number} key    Encryption key (default is generally correct)
     * @return {Buffer}        Encrypted data
     * @example
    ```js
    const encrypted = TPLSmartDevice.encrypt(Buffer.from('super secret text'))
    ```
     */

  }, {
    key: "encrypt",
    value: function encrypt(buffer, key) {
      return TPLSmartDevice.encrypt(buffer, key);
    }
    /**
     * Badly decrypt message from format bulbs use
     * @module decrypt
     * @param  {Buffer} buffer Buffer of data to decrypt
     * @param  {Number} key    Encryption key (default is generally correct)
     * @return {Buffer}        Decrypted data
     *  @example
    ```js
    const decrypted = TPLSmartDevice.decrypt(encrypted)
    ```
     */

  }, {
    key: "decrypt",
    value: function decrypt(buffer, key) {
      return TPLSmartDevice.decrypt(buffer, key);
    }
  }], [{
    key: "scan",
    value: function scan(filter) {
      var _this4 = this;

      var broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '255.255.255.255';
      var emitter = new _events["default"]();

      var client = _dgram["default"].createSocket({
        type: 'udp4',
        reuseAddr: true
      });

      client.bind(9998, undefined, function () {
        client.setBroadcast(true);
        var msgBuf = TPLSmartDevice.encrypt(_safeBuffer.Buffer.from('{"system":{"get_sysinfo":{}}}'));
        client.send(msgBuf, 0, msgBuf.length, 9999, broadcast);
      });
      client.on('message', function (msg, rinfo) {
        var decryptedMsg = _this4.decrypt(msg).toString('ascii');

        var jsonMsg = JSON.parse(decryptedMsg);
        var sysinfo = jsonMsg.system.get_sysinfo;

        if (filter && sysinfo.mic_type !== filter) {
          return;
        }

        var light = new TPLSmartDevice(rinfo.address);
        light._info = rinfo;
        light._sysinfo = sysinfo;
        light.host = rinfo.address;
        light.port = rinfo.port;
        light.name = sysinfo.alias;
        light.deviceId = sysinfo.deviceId;
        emitter.emit('light', light);
      });

      emitter.stop = function () {
        return client.close();
      };

      return emitter;
    }
  }, {
    key: "encrypt",
    value: function encrypt(buffer) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xAB;

      for (var i = 0; i < buffer.length; i++) {
        var c = buffer[i];
        buffer[i] = c ^ key;
        key = buffer[i];
      }

      return buffer;
    }
  }, {
    key: "decrypt",
    value: function decrypt(buffer) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xAB;

      for (var i = 0; i < buffer.length; i++) {
        var c = buffer[i];
        buffer[i] = c ^ key;
        key = c;
      }

      return buffer;
    }
  }]);

  return TPLSmartDevice;
}();

