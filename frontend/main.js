// Using CommonJS due to Electrons limited support for ESM
const {app, BrowserWindow, ipcMain} = require("electron");

app.whenReady().then(() => {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        width: 1400,
        height: 865,
        x: 2500,
        y: 300});
    window.loadFile('./renderer/index.html');

    // WINDOW CONTROLS
    ipcMain.on("minimize", () => {
        window.minimize();
    });

    ipcMain.on("maximize", () => {
        if (window.isMaximized())
            window.unmaximize();
        else
            window.maximize();
    });

    ipcMain.on("close", () => {
        app.quit();
    });
});