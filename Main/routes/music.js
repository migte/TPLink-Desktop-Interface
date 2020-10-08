// Original script is from this thread: https://github.com/konsumer/tplink-lightbulb/issues/35
// Thanks to Konsumer and Blakewenloe

// Dependencies
var router = require("express")();
const TPLSmartDevice = require('@migte/tplink-lightbulb-modified-version');
const createMusicStream = require('create-music-stream');
const MusicBeatDetector = require('music-beat-detector').MusicBeatDetector;
const MusicBeatScheduler = require('music-beat-detector').MusicBeatScheduler;
const MusicGraph = require('music-beat-detector').MusicGraph
const Speaker = require("speaker");
var _ = require('lodash');
const { random } = require('lodash');

const saturationRange = [75, 80, 85, 90, 95, 100, 100, 100];


ms1 = "https://www.youtube.com/watch?v=w21022FXRSI"
mm1 = 55
cc1 = 91
cc2 = 191
cc3 = 291
dd1 = false

// on post request to device name endpoint
router.post('/', function(req, res) {
  // values
  var musicSource = req.body.t; // URL
  var musicSensitivity = 55 // should I make this customizable in the future? Judging by how its .5 to 1, this will probably confuse people..
  var Color1 = parseInt(req.body.t); // number 0-360
  var Color2 = parseInt(req.body.t); // number 0-360
  var Color3 = parseInt(req.body.t); // number 0-360
  var DiscoMode = req.body.t; //boolean

  // Color generator
  function colors(colorValue) {

    // range of values to chose in difference/range
    let differenceOptions = [12, 14, 16, 18]
    let differenceValue = differenceOptions[Math.floor(Math.random() * differenceOptions.length)];

    let c1 = colorValue - differenceValue
    let c2 = colorValue + differenceValue
    colorRange = _.range(c1, c2, 3)

    // turn anything above a hue of 360 to a valid value. (ex: )
    for (x in colorRange) {
        color = colorRange[x]
        if (color > 360) {
            color = color - 360
        }
    }

    return colorRange

  }


  const musicBeatScheduler = new MusicBeatScheduler(pos => {
      new function() {
        var self = this;
        this.lamp = [
          // list all of your lamps
          "192.168.0.159",
          "192.168.0.180"
        ];
    
        this.init = function() {
          for (var i in this.lamp) {
            var light = new TPLSmartDevice(this.lamp[i]);
            this.setLightColor(light);
          }
        };
    
        this.setLightColor = function(light) {
          
            if (DiscoMode !== true) {
              let storageArray = [];
              let randomHueArray = storageArray.concat(colors(Color1), colors(Color2), colors(Color3))
              var randomHue = randomHueArray[Math.floor(Math.random() * randomHueArray.length)];
            } else {
              var randomHue = parseInt(Math.random() * 360),
            }  
           
            var randomSaturation = saturationRange[Math.floor(Math.random() * saturationRange.length)]
            
            light.power(true, 5, {
              color_temp: 0,
              mode: "normal",
              hue: randomHue, // range depending on the values the user requested
              saturation: randomSaturation, // range selected from array
              brightness: 100 // set to 100. Not sure I like how it looks otherwise. Will experiment or add customizability in the future
            });
        };
      }().init();
    });
    
    //MusicBeatDetector analyzes the music
    const musicBeatDetector = new MusicBeatDetector({
      sensitivity: musicSensitivity,
      scheduler: musicBeatScheduler.getScheduler()
    });
    
    createMusicStream(musicSource)
      //pipe on analyzer
      .pipe(musicBeatDetector.getAnalyzer())
      .on("end", () => {
        console.log("end");
      })
      //pipe on speaker
      .pipe(new Speaker())
      .on("open", () => musicBeatScheduler.start());



  res.send("its party time")
});

module.exports = router;