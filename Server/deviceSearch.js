// By - migte

const TPLSmartDevice = require('tplink-lightbulb')

deviceListRaw = []
deviceList = []

// search for devices in network
exports.DeviceSearch = function () {

scanNetwork = function () {
    deviceList = []
    deviceListRaw = []
    
    const scan = TPLSmartDevice.scan()
    .on('light', light => {
    deviceListRaw.push(light.ip + " - " + light._sysinfo.alias + " - " + light._sysinfo.model)
    // remove any duplicate devices (will not remove duplicate names. Must be duplicate ip + name + model)
    deviceList = deviceListRaw.filter((v, i, a) => a.indexOf(v) == i)
    })

    // prevents async overlapping. Try promises maybe?
    setTimeout(() => {
    return deviceList
    }, 350);

    }
    
    // calls function and returns data when function is called
    data = scanNetwork()
    setTimeout(() => {
        return deviceList
    }, 400);
}
