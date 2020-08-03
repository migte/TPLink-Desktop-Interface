# TPLink Desktop Interface
Control your TP-Link smart devices from the comfort of your PC! You can finally break free from the limits of the mobile KASA app and experience full control over your Smart Lights, Smart Switches, Smart Plugs, and more!

## What is this?
This is a small, easy to use application that allows you to control certain properties of your TP-Link smart devices from your PC. As of current development this includes turning devices on and off, and changing the color of color changing devices. Unfortunately I do not have access to all TP-Link smart devices, so there is currently only support for a select few, but as future updates come, expect further support for more models.

## How does it work?
Using a package created by the user named Konsumer (https://www.npmjs.com/package/tplink-lightbulb), we are able to scan, recieve, put, and control every aspect of our TP-Link smart devices connected within our network. Using this, and several other packages, I created this application that lets you manage and view the status of your TP-Link smart devices from your PC, rather than having to use the mobile KASA app.

## What devices are supported?
As of now, the list of currently supported devices include:

* LB130
* HS100
* HS200
* HS210 (experimental)

# How to get started
### Step 1:
The first step is to install node from https://nodejs.org/en/download/ . This is a runtime enviroment that allows javascript to be run as a backend language.

### Step 2:
Install the git packages. You can find that above of this READ.me file. Just press the downlaod code button, download it as a zip (or use github desktop,) and extract the files anywhere on your PC you would like.

### Step 3:
The third and final step is to create a shortcut to the .exe file (**Please note, you cannot move the original TPLink Desktop Interface.exe as the program will not function**)
Once you create a shortcut of the file by right clicking and creating a new shortcut, you can move the shortcut anywhere on your PC to run it!

(Note: On some devices, windows may block the program from running as it is not an official / certified application. If you would like to run the program, you would have to select "more information" and then "run anyways")

## Congradulations! You can now control your TP-Link smart devices from your PC! Thats one less problem you now have to deal with!
Please note, this is a very early release and there are still a lot of compatibility issues and things to work on. If you encounter any errors with your download, please create an issue, as any information could possibly help the program improve. Thanks!


### Future update plans:
- [ ] Add full supporte for HS210 devices
- [ ] Add a fix to the lack of resource when attempting to change the status of multiple devices too quickly.
- [ ] Convert from an html interface to an Electron (desktop app) style interface.
- [ ] Add support for more devices (will have to look into how certain devices display their data)
- [ ] Add the ability to disable or enable the LED status light on power switches
