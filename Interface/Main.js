/*
By - migte

Thanks to any additional sources for programming assistance
*/

var PaustedStatusLoad = true;
var myElem = document.getElementById('deviceList');
var devices = [];
var currentlySelectedDevicesRaw = [];
var currentlySelectedDevices = [];
var isChecked = false;


// On load, call load and setup
window.addEventListener("load", LoadAndSetup);

function LoadAndSetup() {
    
    // Load the devices
    LoadDevices();
    // Setup the devices and their status
    SetupDevices();
    // Refresh the status
    reload();
}

// Refresh the status
function reload() {
    setTimeout(() => {
        SetupDevices();
        reload();
        
    }, 600);
}

// Load the devices
function LoadDevices() {
    // Selects our list
    let list = document.getElementById('deviceListList');
    list.innerHTML = "";

    // Creates a list item
    let listItem = document.createElement("li");
    list.appendChild(listItem);

    // Creates a label
    let label = document.createElement("label");
    label.className = "container";
    label.style.marginBottom = "48px";

    // Creates an input
    label.innerHTML = '<input type="checkbox" name="selectAll" onclick="selectAllFunc(this)">';
    listItem.appendChild(label);

    // Creates select all checkbox
    let selAll = document.createElement("span");
    selAll.className = "Select All";
    selAll.innerHTML = "&nbsp";
    label.appendChild(selAll);

    // Creates a select all checkmark
    let checkM = document.createElement("span");
    checkM.className = "checkmark";
    label.appendChild(checkM)

    // Requests information on the amount of devices and their data
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/devices',
        
        // On success
        success: function(data) {
            // For each device on data delivery
            $.each(data, function(i, data) {

                // Assure data is stingified
                let str = String(data);
                
                // Set data values
                let deviceNameForData = String(str.split(" - ")[1]);
                let deviceIP = str.split(" - ")[0];

                // Store device and delete any duplicates
                devices.push(data);
                devices = devices.filter((v, i, a) => a.indexOf(v) === i);
                
                // Create list data
                let listItem = document.createElement("li");
                listItem.id = "device" + i;
                listItem.dataset.IP = deviceIP;
                listItem.dataset.Model = str.split(" - ")[2];
                listItem.dataset.Name = deviceNameForData;

                // Easy data variables
                let ipString = listItem.dataset.IP;
                let modelString = listItem.dataset.Model;
                let nameString = listItem.dataset.Name;

                // Append
                list.appendChild(listItem)

                // Create data display
                
                // Label
                let label = document.createElement("label");
                label.innerHTML = '<input type="checkbox" name="type" value=' + ipString + '-/-' + modelString + '" onclick="deviceSelectionUpdate(this)">'
                label.className = "container";
                listItem.appendChild(label);

                // Status
                let spanStatus = document.createElement("span");
                spanStatus.className = "devicelistStatus";
                spanStatus.id = "devicelistStatusID" + String(i);
                spanStatus.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                label.append(spanStatus)
                
                // Title
                let spanTitle = document.createElement("span");
                spanTitle.className = "deviceListTitle";
                let deviceName = str.split(" ");

                // Set name depending on space character count
                if (deviceName[3] == "-"){
                    spanTitle.innerHTML = deviceName[2];
                } else if (deviceName[4] == "-") {
                    spanTitle.innerHTML = deviceName[2] + " " + deviceName[3];
                } else if (deviceName[5] == "-") {
                    spanTitle.innerHTML = deviceName[2] + " " + deviceName[3] + " " + deviceName[4];
                } else if (deviceName[6] == "-") {
                    spanTitle.innerHTML = deviceName[2] + " " + deviceName[3] + " " + deviceName[4] + " " + deviceName[5];
                } else if (deviceName[7] == "-") {
                    spanTitle.innerHTML = deviceName[2] + " " + deviceName[3] + " " + deviceName[4] + " " + deviceName[5] + " " + deviceName[6];
                } 
                label.appendChild(spanTitle);

                // Checkbox Input 2
                let input = document.createElement("input");
                input.type="checkbox";
                input.id = "device" + [i] + [i];
                label.appendChild(input);

                // Checkmark
                let checkMark = document.createElement("span");
                checkMark.className = "checkmark";
                label.appendChild(checkMark)




            });
        }
    });

};

// Setup Devices
function SetupDevices() {

    // If paused
    if (PaustedStatusLoad == true) {
        setTimeout(() => {
            if (devices.length == 0) {
                
            } else {

            }
            // Take the amount of devices + the data inside of them
            for (let i = 0; i < devices.length; i++) {
                let IPBefore = String(devices[i]);
                let IPSplit = IPBefore.split(' - ');

                // IP object
                IP = {
                    ip: IPSplit[0]
                }

                // Requset to server
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/devices/deviceStatus",
                    data: IP,
                    
                    // On success
                    success: function(data) {
                        // Ensured stringified data
                        let dataString = String(data.model);
                        
                        let modelName = dataString.split("(");

                        // Determine what to do with recieved data based on supported device type
                        if (modelName[0] == "HS100" || modelName[0] == "HS200" || modelName[0] == "HS210") {
                            let state = data.relay_state;
                            childNumber = "devicelistStatusID" + String(i);
                            childItem = document.getElementById(childNumber);


                            // If off
                            if (state == 0) {
                                childItem.style.border = "5px solid red";
                                childItem.style.background = "black";
                                document.getElementById("device" + i + i).dataset.powerState = "Off";
                            }
                            // If on
                            else if (state == 1) {
                                childItem.style.border = "5px solid green";
                                childItem.style.background = "white";
                                document.getElementById("device" + i + i).dataset.powerState = 'On';
                            }
                        }
                        // Assuming device is a color changing light bulb. Should probably change this to prevent compatibility issues
                        else {
                            let state = data.on_off;
                            let color = data.hue;
                            let lightness = data.brightness / 2;
                            let saturation = data.saturation;
                            // Displays color temp. Will add color temp interface managment in the future
                            let color_temp = data.color_temp;

                            childNumber = "devicelistStatusID" + String(i);
                            childItem = document.getElementById(childNumber);

                            // If off
                            if (state == 0) {
                                childItem.style.border = "5px solid red";
                                childItem.style.background = "black";
                                document.getElementById("device" + i + i).dataset.powerState = "Off";
                            } 
                            // If on
                            else if (state == 1) {
                                // If color is in hsl
                                if (color > 0 && saturation > 0) {
                                    childItem.style.border = "5px solid green";
                                    childItem.style.background = "hsl(" + color + "," + saturation + "%," + lightness + "%)";
                                    document.getElementById("device" + i + i).dataset.powerState = "On";
                                } 
                                // If color is in temperature
                                else {
                                    childItem.style.border = "5px solid green";
                                    document.getElementById("device" + i + i).dataset.powerState = "On";
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
                        };
                    }
                });
            };
        }, 100);
    } else {
        SetupDevices;
    };
};

// When select all button is pressed
function selectAllFunc(theSwitch){
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

  
// Update the current data of what devices we have selected
function deviceSelectionUpdate(thisVar) {
    $("input:checkbox[name=type]:checked").each(function() {
    // Values
    let parentIDFull = this.parentNode.parentNode.id
    let parentIdSplit = parentIDFull.split("vice");
    let parentID = parentIdSplit[1];
    let currentState = document.getElementById("device" + parentID + parentID);

    // determine last selected input to automatically switch power switch
    if (currentState.dataset.powerState == "On") {
        document.getElementById("powerSwitch").checked = true;
    } else if (currentState.dataset.powerState == "Off") {
        document.getElementById("powerSwitch").checked = false;
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

// on color value change
function colorChanged() {
    // grab picker and set our package
    color = document.getElementById("c0").value;
    colorData = {
        devices: currentlySelectedDevices,
        color: color
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
};

function powerUpdate() {
    // pause status load
    PausedStatusLoad = true

    // grab our switch
    document.getElementById("powerSwitch").disabled = true;

    // Set wait length to prevent failure on lack of resource. Grows depending on amount of devices selected
    let waitLength = currentlySelectedDevices.length * 500 + 3000;

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