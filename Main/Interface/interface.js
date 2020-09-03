var PaustedStatusLoad = true;
var myElem = document.getElementById('deviceList');
var devices = [];
var currentlySelectedDevicesRaw = [];
var currentlySelectedDevices = [];
var isChecked = false;
var reloadVar;
var SetupLoop;
var BiggestNames = []
var currentlyOpenMenu = "PowerSettingsMenu"


window.addEventListener("load", LoadAndSetup);

function LoadAndSetup() {
    LoadDevices();
    SetupDevices();
    reload();
}

function reload() {
    reloadVar = setTimeout(() => {
        SetupDevices();
        reload();
        
    }, 600);
}


// load the devices into the program
function LoadDevices() {
    let list = document.getElementById("deviceList");
    let listItem = document.createElement("li");
    list.appendChild(listItem);

    let label = document.createElement("label")
    label.className = "container";
    label.style.marginBottom = "48px";

    label.innerHTML = '<input type="checkbox" name="selectAll" onclick="selectAllFunc(this)">';
    listItem.appendChild(label);

    let selectAll = document.createElement("span");
    selectAll.className = "Select All";
    selectAll.innerHTML = "&nbsp";
    label.append(selectAll);

    let checkM = document.createElement('span');
    checkM.className = "checkmark";
    label.appendChild(checkM)

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/devices',
        success: function(data) {
            if (data.length < 1) {
                LoadDevices();
            } else {
                setTimeout(() => {
                    // for every device...
                    $.each(data, function(i, data) {
                        let str = String(data);
                        let deviceNameForData = String(str.split(' - ')[1]);
                        let deviceIP = str.split(" - ")[0];
                        devices.push(data);
                        devices = devices.filter((v, i, a) => a.indexOf(v) === i)

                        let template = document.getElementsByTagName('template')[0];
                        let device = template.content.cloneNode(true);

                        // edit properites
                        let listItem = device.childNodes[1];
                        listItem.id = "device" + String(i);
                        listItem.dataset.IP = deviceIP;
                        listItem.dataset.Model = str.split(" - ")[2];
                        listItem.dataset.Name = deviceNameForData
                        let ipString = String(listItem.dataset.IP);
                        let modelString = String(listItem.dataset.Model);
                        let nameString = listItem.dataset.Name;
                        list.appendChild(device)

                        let label = listItem.childNodes[1];
                        let checkbox = label.childNodes[1];
                        checkbox.id = "device" + String(i) + String(i);
                        checkbox.value = '' + ipString + '-/-' + modelString + '';

                        let div = listItem.childNodes[3]
                        let statusMain = div.childNodes[1];
                        let statusSecondary = div.childNodes[3];
                        let title = div.childNodes[5];

                        statusMain.id = "devicelistStatusID" + String(i);
                        statusSecondary.id = "ledListStatusID" + String(i);

                        let deviceName = str.split(" ");
                        if (deviceName[3] == "-"){
                            title.innerHTML = deviceName[2];
                        } else if (deviceName[4] == "-") {
                            title.innerHTML = deviceName[2] + " " + deviceName[3];
                        } else if (deviceName[5] == "-") {
                            title.innerHTML = deviceName[2] + " " + deviceName[3] + " " + deviceName[4];
                        } else if (deviceName[6] == "-") {
                            title.innerHTML = deviceName[2] + " " + deviceName[3] + " " + deviceName[4] + " " + deviceName[5];
                        } else if (deviceName[7] == "-") {
                            title.innerHTML = deviceName[2] + " " + deviceName[3] + " " + deviceName[4] + " " + deviceName[5] + " " + deviceName[6];
                        } 
                        title.className = "deviceListTitle"
                    })
                }, 700);
            }
        }
    })
}

function SetupDevices() {
    if (PaustedStatusLoad == true) {
        SetupLoop = setTimeout(() => {
            if (devices.length == 0) {

            } else {

            }

            // request properties per device in array
            for (let i=0; i < devices.length; i++) {
                let IPBefore = String(devices[i]);
                let IPSplit = IPBefore.split(" - ")
                
                IP = {
                    ip: IPSplit[0],
                }

                // request to server
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/devices/deviceStatus",
                    data: IP,
                    success: function(data) {
                        let dataString = String(data.model);
                        let dataName = String(data.alias);
                        let modelName = dataString.split('(');

                        // Smart Switches and Plugs
                        if (modelName[0] == "HS100" || modelName[0] == "HS105" || modelName[0] == "HS110" || modelName[0] == "HS200" || modelName[0] == "HS210") {
                            let state = data.relay_state;
                            let ledState = data.led_off
                            let childNumber = "devicelistStatusID" + String(i);
                            let childNumber2 = "ledListStatusID" + String(i);
                            let childItem = document.getElementById(childNumber);
                            let childItem2 = document.getElementById(childNumber2);
                            let deviceWithId = document.getElementById("device" + String(i))


                            function powerOff() {
                                childItem.style.border = ".25vw solid red"
                                childItem.style.background = "black";
                                deviceWithId.dataset.powerState = "Off";                            }
                            function powerOn() {
                                childItem.style.border = ".25vw solid green"
                                childItem.style.background = "white";
                                deviceWithId.dataset.powerState = "On";
                            }
                            function ledOff() {
                                childItem2.style.background = "rgb(104,255,122)";
                                deviceWithId.dataset.ledState = "On";
                            }
                            function ledOn() {
                                childItem2.style.background = "rgb(83, 83, 83)";
                                deviceWithId.dataset.ledState = "Off"; 
                            }

                            // if power is off
                            if (state == 0) {
                                powerOff();
                                // if led is off
                                if (ledState == 0) {
                                    ledOff();
                                }
                                // if led is on
                                else if (ledState == 1) {
                                    ledOn();
                                }
                            }
                            // if power is on 
                            else if (state == 1) {
                                powerOn();
                                // if led is off
                                if (ledState == 0) {
                                    ledOff();
                                }
                                // if led is on
                                else if (ledState == 1) {
                                    ledOn();
                                }
                            }
                            
                        }
                        // Color Changing Lightbulbs
                        else if (modelName[0] == "LB130" || modelName[0] == "LB230") {
                            let state = data.light_state.on_off;
                            let color = data.light_state.hue;
                            let lightness = data.light_state.brightness / 2;
                            let saturation = data.light_state.saturation;
                            let color_temp = data.light_state.color_temp;
                            let childNumber = "devicelistStatusID" + String(i);
                            let childItem = document.getElementById(childNumber);
                            let deviceWithId = document.getElementById("device" + String(i))
                            
                            // If off
                            if (state == 0) {
                                childItem.style.border = ".25vw solid red";
                                childItem.style.background = "black";
                                deviceWithId.dataset.powerState = "Off";
                            }
                            // If on
                            else if (state == 1) {
                                deviceWithId.dataset.powerState = "On";
                                childItem.style.border = ".25vw solid green"
                                // if color is in hsl
                                if (color > 0 && saturation > 0) {
                                    childItem.style.background = "hsl(" + color + "," + saturation + "%," + lightness + "%)";
                                }
                                // if color is in whiteness/temperature
                                else {
                                    if (color_temp >= 2500 && color_temp <= 3000) {
                                        rgb = "rgb(255, 191, 122)"
                                    } else if (color_temp >= 3001 && color_temp <= 3500) {
                                        rgb = "rgb(255, 203, 148)"
                                    } else if (color_temp >= 3501 && color_temp <= 5000) {
                                        rgb = "rgb(255, 243, 230)"
                                    } else if (color_temp >= 5001 && color_temp <= 6000) {
                                        rgb = "rgb(242, 247, 255)"
                                    } else if (color_temp >= 6001 && color_temp <= 6000) {
                                        rgb = "rgb(232, 240, 252)"
                                    } else if (color_temp >= 6001) {
                                        rgb = "rgb(186, 214, 255)"
                                    } else {
                                        rgb = "rgb(255,255,255)"
                                    }
                                    childItem.style.background = rgb;
                                };
                            };
                        }
                        // Tempearture Changing Lightbulbs
                        else if (modelName[0] == "LB100" || modelName[0] == "LB120" || modelName[0] == "LB200" || modelName[0] == "LB230" || modelName[0] == "KL130") {
                            let state = data.light_state.on_off;
                            let color_temp = data.light_state.color_temp;
                            let deviceWithId = document.getElementById("device" + String(i) + String(i))
                            childNumber = "devicelistStatusID" + String(i);
                            childItem = document.getElementById(childNumber);

                            // If off
                            if (state == 0) {
                                childItem.style.border = ".25vw solid red";
                                childItem.style.background = "black";
                                deviceWithId.dataset.powerState = "Off";
                            }
                            // If on
                            else if (state == 1) {
                                if (color_temp >= 2500 && color_temp <= 3000) {
                                    rgb = "rgb(255, 191, 122)"
                                } else if (color_temp >= 3001 && color_temp <= 3500) {
                                    rgb = "rgb(255, 203, 148)"
                                } else if (color_temp >= 3501 && color_temp <= 5000) {
                                    rgb = "rgb(255, 243, 230)"
                                } else if (color_temp >= 5001 && color_temp <= 6000) {
                                    rgb = "rgb(242, 247, 255)"
                                } else if (color_temp >= 6001 && color_temp <= 6000) {
                                    rgb = "rgb(232, 240, 252)"
                                } else if (color_temp >= 6001) {
                                    rgb = "rgb(186, 214, 255)"
                                } else {
                                    rgb = "rgb(255,255,255)"
                                }
                                childItem.style.background = rgb;
                            };
                        }
                        // Binary Light bulbs (off, on)
                        else if (modelName[0] == "KL130") {
                            let state = data.light_state.on_off;
                            childNumber = "devicelistStatusID" + String(i);
                            childItem = document.getElementById(childNumber);                 
                            
                            // If off
                            if (state == 0) {
                                childItem.style.border = ".25vw solid red";
                                childItem.style.background = "black";
                                deviceWithId.dataset.powerState = "Off";
                            }
                            // If on
                            else if (state == 1) {
                                childItem.style.border = ".25vw solid green";
                                deviceWithId.dataset.powerState = "On";
                                childItem.style.background = "white"
                                
                            };
                        };
                    }
                });
            };
        }, (200));
    } else {
        SetupDevices;
    };
};

function selectAllFunc(theSwitch) {
    $("input:checkbox[name=selectAll]:checked").each(function() {
        isChecked = true;
      });
    $("input:checkbox[name=selectAll]:not(:checked)").each(function() {
        isChecked = false;
    });
    // select all or de-select all
    if (isChecked == true) {
        $("input:checkbox[name=type]").prop('checked', true);
        deviceSelectionUpdate();
      } else if (isChecked == false) {
        $("input:checkbox[name=type]").prop('checked', false);
        deviceSelectionUpdate();
    }
}

function deviceSelectionUpdate(thisVar) {
    $("input:checkbox[name=type]:checked").each(function() {
    // Values
    let parentIDFull = this.parentNode.parentNode.id
    let parentIdSplit = parentIDFull.split("vice");
    let parentID = parentIdSplit[1];
    let currentState = document.getElementById("device" + parentID);

    // determine last selected input to automatically switch power switch
    if (currentState.dataset.powerState == "On") {
        document.getElementById("powerSwitch").checked = true;
    } else if (currentState.dataset.powerState == "Off") {
        document.getElementById("powerSwitch").checked = false;
    };
    if (currentState.dataset.ledState == "On") {
        document.getElementById("ledSwitch").checked = true;
    } else if (currentState.dataset.ledState == "Off") {
        document.getElementById("ledSwitch").checked = false;
    };
    
    // Push values up to array
    currentlySelectedDevicesRaw.push($(this).val()); 
    $.each(currentlySelectedDevicesRaw, function(i, el) {
        if($.inArray(el, currentlySelectedDevices) === -1) currentlySelectedDevices.push(el);
    });
    })

    // remove all unchecked items from data array
    $("input:checkbox[name=type]:not(:checked)").each(function() {
        let index = currentlySelectedDevices.indexOf($(this).val());
        if (index > -1) {
            currentlySelectedDevices.splice(index, 1)
        };
    });
};

function powerUpdate() {
    // pause status load
    PausedStatusLoad = true

    // grab our switch
    document.getElementById("powerSwitch").disabled = true;


    // Set wait length to prevent failure on lack of resource. Grows depending on amount of devices selected
    let waitLength = currentlySelectedDevices.length * 360 + 3000;

    // Disable switch
    setTimeout(() => {
        document.getElementById("powerSwitch").disabled = false;
    }, waitLength);

    let deliveryCurrentlySelectedDevices = currentlySelectedDevices;

    // If power is switched on
    $("input:checkbox[name=powerSwitch]:checked").each(function() {

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/power",
            data: {devices: deliveryCurrentlySelectedDevices, powerSetting: "powerOn"},

            // On success
            success: function(data) {
                PausedStatusLoad = false;

            },
            error: function(jqXHR, textStatus, errorThrown) {
                // no error handling
            }
        });
    });
    // If power is swithced off
    $("input:checkbox[name=powerSwitch]:not(:checked)").each(function() {

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/power",
            data: {devices: deliveryCurrentlySelectedDevices, powerSetting: "powerOff"},

            // On success
            success: function(data) {
                PausedStatusLoad = false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // no error handling
            }
        });
    });
};

function ledUpdate() {
    // pause status load
    PausedStatusLoad = true

    // grab our switch
    document.getElementById("ledSwitch").disabled = true;


    // Set wait length to prevent failure on lack of resource. Grows depending on amount of devices selected
    let waitLength = currentlySelectedDevices.length * 360 + 3000;

    // Disable switch
    setTimeout(() => {
        document.getElementById("ledSwitch").disabled = false;
    }, waitLength);

    let deliveryCurrentlySelectedDevices = currentlySelectedDevices;

    // If power is switched on
    $("input:checkbox[name=ledSwitch]:checked").each(function() {

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/power/ledState",
            data: {devices: deliveryCurrentlySelectedDevices, powerSetting: "powerOn"},

            // On success
            success: function(data) {
                PausedStatusLoad = false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // no error handling
            }
        });
    });
    // If power is swithced off
    $("input:checkbox[name=ledSwitch]:not(:checked)").each(function() {

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/power/ledState",
            data: {devices: deliveryCurrentlySelectedDevices, powerSetting: "powerOff"},

            // On success
            success: function(data) {
                PausedStatusLoad = false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // no error handling
            }
        });
    });
};

var CurrentIp

function deviceNameChange(thisVar) {

    let newName = document.getElementById("newNameInput").value

    if (newName == "" || newName == null) {
        // user entered no response
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/deviceSettings",
            data: {device: CurrentIp, deviceName: newName},
            success: function(data) {
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // no error handling
            }
          });
    }

    document.getElementById('devicePrompt').style.display = "none";
}

function promptClose() {
    document.getElementById('devicePrompt').style.display = "none";
}

function customPrompt(thisVar) {

    CurrentIp = String(thisVar.parentNode.parentNode.dataset.IP)
    PausedStatusLoad = true
    let inputBox = document.getElementById("devicePrompt");
    inputBox.style.display = "block";
    document.getElementById("newNameInput").focus();
}


function changeLayout(selected) {
    
    function presentChange(menu) {
        let menuElement = document.getElementById(menu);
        let currentElement = document.getElementById(currentlyOpenMenu);

        currentElement.style.display = "none";
        menuElement.style.display = "block"

        currentlyOpenMenu = menu
    }


    switch(selected) {
        case "Power":
            presentChange("PowerSettingsMenu");
            break
        case "Color":
            presentChange("ColorSettingsMenu");
            break
    }

}

// adjust brightness slider to display picked color
// color conversion script by CSS Tricks
function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
  }

  function HSLToHex(h,s,l) {
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
  
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
  }

function colorSliderChange() {
    let colorSlider = document.getElementById("hueSlider");
    
    let inHex = HSLToHex(colorSlider.value,100, 50)

    colorData = {
        devices: currentlySelectedDevices,
        color: inHex
    }

    // request a color change from server
    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/color',
        data: colorData,
        success: function(data) {
        },
        error: function (jqHXR, textStatus, errorThrown){
            // no error handling
        }
    });
}

function tempSliderChange() {
    let tempSlider = document.getElementById("temperatureSlider");
    
    let temperature = tempSlider.value

    tempData = {
        devices: currentlySelectedDevices,
        temp: temperature
    }

    // request a color change from server
    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/color/temp',
        data: tempData,
        success: function(data) {
        },
        error: function (jqHXR, textStatus, errorThrown){
            // no error handling
        }
    });
}

function refreshPage() {
    location.reload();
}