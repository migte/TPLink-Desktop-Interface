// By - migte
// Note: sloppy variable definitions. Encountered an error with value calls. Will look into in the future

// dependencies
var router = require("express")();
const TPLSmartDevice = require('tplink-lightbulb');

// on post request to endpoint
router.post('/', function(req, res) {
    let devices = req.body["devices[]"];
    let state = req.body.powerSetting;

    if (devices == null) {
        // null request
    } else {
        // if request was to power on the devices
        if (state == "powerOn") {
            // if more than one device is requested to be changed
            if (devices[0].length > 1) {
                for (i in devices) {
                    let deviceArray = String(devices[i]);
                    let splitArray = deviceArray.split("-/-");
                    let ip = splitArray[0];
                    let modelName = splitArray[1];
                    let d = new TPLSmartDevice(ip);

                    // power on device
                    d.power(true);
                };
            }
            // if only one device was requested to be changed
            else {
                let device = String(devices);
                let splitArray = device.split("-/-");
                let ip = splitArray[0];
                let modelName = splitArray[1];
                let d = new TPLSmartDevice(ip);

                // power on device
                d.power(true);
            };
        };

        // if request was to power off the devices
        if (state == "powerOff") {
            // if more than one device is requested to be changed
            if (devices[0].length > 1) {
                for (i in devices) {
                    let deviceArray = String(devices[i]);
                    let splitArray = deviceArray.split("-/-");
                    let ip = splitArray[0];
                    let modelName = splitArray[1];
                    let d = new TPLSmartDevice(ip);

                    // power on device
                    d.power(false);
                };
            }
            // if only one device was requested to be changed
            else {
                let device = String(devices);
                let splitArray = device.split("-/-");
                let ip = splitArray[0];
                let modelName = splitArray[1];
                let d = new TPLSmartDevice(ip);

                // power on device
                d.power(false);
            };
        };
    };
    res.send("Power State")
});


module.exports = router;
