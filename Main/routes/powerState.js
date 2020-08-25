// By - migte
// Note: sloppy variable definitions. Encountered an error with value calls. Will look into in the future

// dependencies
var router = require("express")();
const TPLSmartDevice = require('tplink-lightbulb');

// on post request to power endpoint
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

// on post request to LED power endpoint
router.post('/:ledState', function(req, res) {
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
                    d.led(true);
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
                d.led(true);
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
                    d.led(false);
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
                d.led(false);
            };
        };
    };
    res.send("led state")
});

// on post request to device name endpoint
router.post('/:deviceName', function(req, res) {
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
        
    res.send("test")
});


module.exports = router;
