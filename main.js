const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
          }
    });

    mainWindow.maximize();

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'main.html'),
            protocol: 'file:',
            slashes: true
        })
    )

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send("loadControl", true);
    })
})