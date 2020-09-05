// By - migte
// dependencies 
const express = require('express');
const router = express.Router();
const TPLSmartDevice = require('@migte/tplink-lightbulb-modified-version');
const { DeviceSearch } = require('../DeviceSearch');

// converts hex to hsl
// source: https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return {h: h, s: s, l: l};
}

var color = "";

// on post request
router.post('/', function(req, res) {
    
    // values
    let devices = req.body["devices[]"];
    let color = req.body.color;
    let HSLValue = hexToHSL(color);

    if (devices == null) {
        // empty request  
    } else {
        // if we have more than one device
        if (devices[0].length > 1) {
            // for every device
            for (i in devices) {
                // values
                let deviceArray = String(devices[i]);
                let splitArray = deviceArray.split("-/-");
                let ip = splitArray[0];
                let modelNameRaw = splitArray[1]; 
                let modelName = modelNameRaw.split("(");
                let d = new TPLSmartDevice(ip);
                // If color changing (compatible) device
                if (modelName[0] == "LB130" || modelName[0] == "LB230") {
                    d.power(true, 100, { hue: HSLValue.h, saturation: HSLValue.s, color_temp: 0, brightness: 100});
                };
            };
        } 
        // If we are only receivng instructions for 1 device
        else {

            // values
            let deviceArray = String(devices);
            let splitArray = deviceArray.split("-/-");
            let ip = splitArray[0];
            let modelNameRaw = splitArray[1]
            let modelName = modelNameRaw.split("(")
            let d = new TPLSmartDevice(ip);

            // If color changing (compatible) device
            if (modelName[0] == "LB130" || modelName[0] == "LB230"){
                d.power(true, 100, { hue: HSLValue.h, saturation: HSLValue.s, color_temp: 0, brightness: 100});
            }; 
        };
    };
    res.send(req.body);
});

// on post request to status endpoint
router.post('/:temp', (req, res, next) => {

  // values
  let devices = req.body["devices[]"];
  let temp = parseInt(req.body.temp);
  

  if (devices == null) {
    // empty request  
} else {
    // if we have more than one device
    if (devices[0].length > 1) {
        // for every device
        for (i in devices) {
            // values
            let deviceArray = String(devices[i]);
            let splitArray = deviceArray.split("-/-");
            let ip = splitArray[0];
            let modelNameRaw = splitArray[1]; 
            let modelName = modelNameRaw.split("(");
            let d = new TPLSmartDevice(ip);

            // If temperature changing (compatible) device
            if (modelName[0] == "LB100" || modelName[0] == "LB120" || modelName[0] == "LB130" || modelName[0] == "LB200" || modelName[0] == "LB230" || modelName[0] == "KL130") {
                d.power(true, 100, { hue: 0, saturation: 0, color_temp: temp, brightness: 100});
            };
        };
    } 
    // If we are only receivng instructions for 1 device
    else {

        // values
        let deviceArray = String(devices);
        let splitArray = deviceArray.split("-/-");
        let ip = splitArray[0];
        let modelNameRaw = splitArray[1]
        let modelName = modelNameRaw.split("(")
        let d = new TPLSmartDevice(ip);

            // If temperature changing (compatible) device
        if (modelName[0] == "LB100" || modelName[0] == "LB120" || modelName[0] == "LB130" || modelName[0] == "LB200" || modelName[0] == "LB230" || modelName[0] == "KL130") {
          d.power(true, 100, { hue: HSLValue.h, saturation: 0, color_temp: temp, brightness: 100});
        }; 
    };
};
res.send(req.body);
});

module.exports = router;