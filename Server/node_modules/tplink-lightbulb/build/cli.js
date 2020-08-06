#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arg = void 0;

var _lib = _interopRequireDefault(require("./lib"));

var _yargs = _interopRequireDefault(require("yargs"));

var _colorsys = require("colorsys");

var _jsonColorizer = _interopRequireDefault(require("json-colorizer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var json = process.stdout.isTTY ? function (s) {
  return console.log((0, _jsonColorizer["default"])(JSON.stringify(s, null, 2)));
} : function (s) {
  return console.log(JSON.stringify(s, null, 2));
}; // for pkg support

if (typeof process.pkg !== 'undefined') {
  process.pkg.defaultEntrypoint = 'tplight';
}

var arg = _yargs["default"].usage('Usage: $0 <COMMAND>').help('h').alias('h', 'help').demandCommand(1, 1, 'You need a command.').version().example('$0 scan -h', 'Get more detailed help with `scan` command').example('$0 on -h', 'Get more detailed help with `on` command').example('$0 off -h', 'Get more detailed help with `off` command').example('$0 temp -h', 'Get more detailed help with `temp` command').example('$0 hex -h', 'Get more detailed help with `hex` command').example('$0 hsb -h', 'Get more detailed help with `hsb` command').example('$0 cloud -h', 'Get more detailed help with `cloud` command').example('$0 raw -h', 'Get more detailed help with `raw` command').example('$0 details -h', 'Get more detailed help with `details` command').example('$0 led -h', 'Get more detailed help with `led` command').command('scan', 'Scan for lightbulbs', function (yarg) {
  yarg.alias('timeout', 't').nargs('timeout', 1).describe('timeout', 'Timeout for scan (in seconds)')["default"]('timeout', 0).alias('filter', 'f').nargs('filter', 1).describe('filter', 'filter to a specific class of devices (ie: IOT.SMARTBULB)').alias('broadcast', 'b').nargs('broadcast', 1).describe('broadcast', 'The network broadcast address for scanning')["default"]('broadcast', '255.255.255.255').example('$0 scan -t 1', 'Get list of TP-Link smart devices on your network, stop after 1 second');
}, function (argv) {
  var scan = _lib["default"].scan(argv.filter, argv.broadcast).on('light', function (light) {
    console.log("".concat(light._info.address, " - ").concat(light._sysinfo.alias, " - ").concat(light._sysinfo.model));
  });

  if (argv.timeout) {
    setTimeout(function () {
      scan.stop();
    }, argv.timeout * 1000);
  } else {
    console.log('Press Ctrl-C to stop');
  }
}).command('on <ip>', 'Turn on lightbulb', function (yarg) {
  yarg["boolean"]('quiet').describe('quiet', "Don't output return value of command").alias('quiet', 'q').alias('transition', 't').nargs('transition', 1)["default"]('transition', 0).describe('t', 'Transition time (in ms)').alias('brightness', 'b').nargs('brightness', 1)["default"]('brightness', 100).describe('b', 'Brightness').example('$0 on 10.0.0.200', 'Turn on a light').example('$0 on -t 10000 10.0.0.200', 'Take 10 seconds to turn on a light');
}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  bulb.power(true, argv.transition, {
    brightness: argv.brightness
  }).then(function (r) {
    return argv.quiet || json(r);
  })["catch"](console.error);
}).command('off <ip>', 'Turn off lightbulb', function (yarg) {
  yarg["boolean"]('quiet').describe('quiet', "Don't output return value of command").alias('quiet', 'q').alias('transition', 't').nargs('transition', 1)["default"]('transition', 0).describe('t', 'Transition time (in ms)').example('$0 off 10.0.0.200', 'Turn off a light').example('$0 off -t 10000 10.0.0.200', 'Take 10 seconds to turn off a light');
}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  bulb.power(false, argv.transition).then(function (r) {
    return argv.quiet || json(r);
  })["catch"](console.error);
}).command('temp <ip> <color>', 'Set the color-temperature of the lightbulb (for those that support it)', function (yarg) {
  yarg["boolean"]('quiet').describe('quiet', "Don't output return value of command").alias('quiet', 'q').alias('transition', 't').nargs('transition', 1)["default"]('transition', 0).describe('t', 'Transition time (in ms)').example('$0 temp 10.0.0.200 1', 'Set color-temp to orangish').example('$0 temp 10.0.0.200 10000', 'Set color-temp to bluish');
}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  bulb.power(true, argv.transition, {
    hue: 0,
    saturation: 0,
    color_temp: argv.color
  }).then(function (r) {
    return argv.quiet || json(r);
  })["catch"](console.error);
}).command('hex <ip> <color>', 'Set color of lightbulb using hex color (for those that support it)', function (yarg) {
  yarg["boolean"]('quiet').describe('quiet', "Don't output return value of command").alias('quiet', 'q').alias('transition', 't').nargs('transition', 1)["default"]('transition', 0).describe('t', 'Transition time (in ms)').example('$0 hex 10.0.0.200 "#48258b"', 'Set the lightbulb to a nice shade of purple.').example('$0 hex -t 10000 10.0.0.200 "#48258b"', 'Take 10 seconds to set the lightbulb to a nice shade of purple.');
}, function (argv) {
  var color = (0, _colorsys.hexToHsl)(argv.color);
  var bulb = new _lib["default"](argv.ip);
  bulb.power(true, argv.transition, {
    hue: color.h,
    saturation: color.s,
    brightness: color.l,
    color_temp: 0
  }).then(function (r) {
    return argv.quiet || json(r);
  })["catch"](console.error);
}).command('hsb <ip> <hue> <saturation> <brightness>', 'Set color of lightbulb using HSB color (for those that support it)', function (yarg) {
  yarg["boolean"]('quiet').describe('quiet', "Don't output return value of command").alias('quiet', 'q').alias('transition', 't').nargs('transition', 1)["default"]('transition', 0).describe('t', 'Transition time (in ms)').example('$0 hsb 10.0.0.200 72 58 35', 'Set the lightbulb to a nice shade of purple.').example('$0 hsb -t 10000 10.0.0.200 72 58 35', 'Take 10 seconds to set the lightbulb to a nice shade of purple.');
}, function (argv) {
  var transition = argv.transition,
      hue = argv.hue,
      saturation = argv.saturation,
      brightness = argv.brightness;
  var bulb = new _lib["default"](argv.ip);
  bulb.power(true, transition, {
    color_temp: 0,
    hue: hue,
    saturation: saturation,
    brightness: brightness
  }).then(function (r) {
    return argv.quiet || json(r);
  })["catch"](console.error);
}).command('cloud <ip>', 'Get cloud info', {}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  bulb.cloud().then(function (r) {
    return json(r);
  })["catch"](console.error);
}).command('raw <ip> <json>', 'Send a raw JSON command', {}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  bulb.send(JSON.parse(argv.json)).then(function (r) {
    return argv.quiet || json(r);
  })["catch"](console.error);
}).command('details <ip>', 'Get details about the device', {}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  Promise.all([bulb.details(), bulb.info()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        details = _ref2[0],
        info = _ref2[1];

    json(_objectSpread(_objectSpread({}, details), info));
  })["catch"](console.error);
}).command('led <ip> <ledState>', 'Turn on/off LED indicator', function (yarg) {
  yarg.example('$0 led 10.0.0.200 off', 'Turn off the LED').example('$0 led 10.0.0.200 on', 'Turn on the LED');
}, function (argv) {
  var bulb = new _lib["default"](argv.ip);
  var ledState = ['y', 'yes', 'true', '1', 'on'].indexOf(argv.ledState.toLowerCase()) === -1;
  bulb.led(ledState);
}).argv;

exports.arg = arg;

