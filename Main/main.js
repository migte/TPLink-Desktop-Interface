const { app, BrowserWindow, nativeImage } = require('electron')
const electron = require('electron')
const path = require('path');
const url = require('url')
const http = require('http');
const app2 = require('./app');
const port = process.env.PORT || 3000
const server = http.createServer(app2);

// Listen on localhost 3000
server.listen(port);

var image = nativeImage.createFromPath(__dirname + '/Interface/thumbnails/logo.png'); 

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    x: 800,
    y: 600,
    center: true,
    icon: image,
    minHeight: 645,
    minWidth: 805,
    webPreferences: {
      nodeIntegration: true
    },
  })
  win.setMenuBarVisibility(false)
  win.setMenuBar

  win.once('ready-to-show', () => {
    win.show();
    win.center();

  })

  // and load the index.html of the app.
  win.loadFile("Interface/Loading.html")
  setTimeout(() => {
   win.loadFile('Interface/index.html')
    win.maximize();
  
  }, 6500);


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.