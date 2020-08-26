# TPLink Desktop Interface
Control your TP-Link smart devices from the comfort of your PC! You can finally break free from the limits of the mobile KASA app and experience full control over your Smart Lights, Smart Switches, Smart Plugs, and more!

## What is this?
This is a small, easy to use application that allows you to control certain properties of your TP-Link smart devices from your PC. As of current development this includes turning devices on and off, changing the color of a lightbulb, changing the temperature of a lightbulb, changing the LED status of a device, changing the Name of devices (not supported for light bulbs). Unfortunately, I do not have access to all TP-Link smart devices, so there is currently only support for a select few, but as future updates come, expect further support for more models.

## How does it work?
Using a module made by "Konsumer" (https://www.npmjs.com/package/tplink-lightbulb), we are able to scan, receive, change, and control every aspect of our TP-Link smart devices connected within our network. Using this, I created this application that lets you manage and view the status of your TP-Link smart devices from your PC, rather than having to use the mobile KASA app.

# How to install
If you are looking to use the desktop interface, keep reading. If you would like instructions on how to customize this repository and then create your own app, look below for the "Customize This Repository" section.

## Step 1:
download the necessary files from this link: https://drive.google.com/drive/folders/1zVkKqxQKOLUn1A8LttDPLNke7G57qUvS?usp=sharing

## Step 2:
Extract the files anywhere you would like on your computer (it is recommended to put them in your "Program Files" folder.) After that, open the file and place the shortcut anywhere you'd like. Use the shortcut to run the app. Congratulations, you can now control your TPLink smart devices from your computer!

# Customize This Repository
If you would like to modify this application, feel free to fork and use this repository and go at it! To properly edit and complete your modified interface, follow these steps:

## Step 1:
Download Node.JS. This is the runtime engine we will be using. (https://nodejs.org/en/download/)

## Step 2:
Install the required modules. To do this, open a console (cmd) and head to the Main folder. To do this, open a command prompt and type the following 
```cmd
cd PATH
```
and replace PATH with the path to the Main. Example: C:\Users\user\Desktop\TPLink-Desktop-Interface\Main

Then write
```cmd
npm i
```
and after that is complete, write
```cmd
npm run getPackager
```

## Step 3:
Edit the program however you'd like! It isn't too complicated, so don't be worried. The program is split into two main parts. The interface, and the main electron part (which also runs a localhost REST API server.)

## Step 4:
Once you are done with all your changes, you can run the app by going to the Main directory via CMD and typing
```cmd
npm start
```
Or by packaging it and turning it into an executable. To do this, type (in the Main directory via CMD as we did before)
```cmd
npm run packageApp
```
On completion, this will create a folder inside your Main folder called TPLink-Desktop-Interface....
You can move this directory anywhere you'd like on your PC. Inside it there is an exe, which you can make a shortcut of and place on your desktop.


## What devices are supported?
As of now, the list of currently supported devices include:


* LB130
* HS100
* HS200


* LB100 (experimental) 
* LB120 (experimental) 
* LB200 (experimental) 
* LB230 (experimental) 
* KL110 (experimental) 
* KL130 (experimental) 
* HS210 (experimental)

**If your devices is marked as "experimental" and it either works or does not work, I would love your help to make them compatible with my interface, as it is just a few simple steps I cannot replicate since I do not personally have the devices. Feel free to contact me in the case that is so :)

### Future update plans:
- [ ] Add audio visualizer feature
- [ ] Ability to change brightness of a bulb
- [ ] Ability to change the name of a bulb
- [ ] Add full support for HS210 devices

If you have any requests or suggestions, feel free to post an issue and I'll take a look at it!
