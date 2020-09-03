// By - migte
// dependencies
const express = require('express');
const router = express.Router();
var search = require('../DeviceSearch');
const TPLSmartDevice = require('tplink-lightbulb');
const e = require('express');
data = search.DeviceSearch();

function deviceRefresh() {
    setTimeout(() => {
        data2 = search.DeviceSearch();
    }, 4900)
    setTimeout(() => {
        if (data == data2){
            // device list has not changed
        } else {
            data = data2
        }
    }, 5000);
    
}
setInterval(() => {
    deviceRefresh();
}, 2230);


// on get reuqest
router.get('/', function(req, res) {

    res.send(deviceList);
    console.log(deviceList)
  
});

// on post request to status endpoint
router.post('/:deviceStatus', (req, res, next) => {
    setTimeout(() => {
        // values
        let ip = (req.body.ip);
        let device = new TPLSmartDevice(ip);
        let state = null
        device.info()
        .catch(e=> console.error(e))
        .then(info => {
            let name = String(info.model);
            let nameVal = name.split("(")
            // supported color changing devices (should probably add support for temperature only bulbs when temperature slider is added)
            if (nameVal[0] == "LB100" || nameVal[0] == "LB120" || nameVal[0] == "LB130" || nameVal[0] == "LB200" || nameVal[0] == "LB230" || nameVal[0] == "KL110" || nameVal[0] == "KL130" || nameVal[0] == "HS100" || nameVal[0] == "HS200" || nameVal[0] == "HS210") {
                res.send(info);
            }
        })
    });
});
module.exports = router;