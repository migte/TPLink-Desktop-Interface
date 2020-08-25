// By - migte

// dependencies
var router = require("express")();
const TPLSmartDevice = require('tplink-lightbulb');

// on post request to device name endpoint
router.post('/', function(req, res) {
    let device = req.body.device;
    let name = req.body.deviceName;

    if (device == null) {
        // null request
    } else {

        let ip = device
        let d = new TPLSmartDevice(ip);

        // power on device
        d.name(name);

        };
        
    res.send(name)
});


module.exports = router;
