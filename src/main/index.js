import {
	app,
	BrowserWindow,
	Tray,
	Menu,
	ipcMain
} from 'electron'

import axios from 'axios'
var fs = require('fs')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, editForm, danmuScreen
const winURL = `http://localhost:9080`

function createWindow() {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		width: 960,
		height: 540,
		// transparent: true,
		// frame: false,
		resizable: true,
		// alwaysOnTop: true,
		center: false,
		// skipTaskbar: true,
		autoHideMenuBar: false,
		// focusable: false
	})
	// mainWindow.setAlwaysOnTop(true, 'pop-up-menu'); //一定要这样设置 要不然在mac下全屏播放PPT的时候看不到

	// mainWindow.maximize(); //窗口最大化
	// mainWindow.setIgnoreMouseEvents(true); //点击穿透

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

function createEditForm() {
	/**
	 * Initial window options
	 */
	editForm = new BrowserWindow({
		width: 500,
		height: 400,
		// transparent: true,
		// frame: false,
		resizable: true,
		// alwaysOnTop: true,
		// center: true,
		// skipTaskbar: true,
		autoHideMenuBar: true,
		// focusable: false
	})
	// mainWindow.setAlwaysOnTop(true, 'pop-up-menu'); //一定要这样设置 要不然在mac下全屏播放PPT的时候看不到

	// editForm.maximize(); //窗口最大化
	// mainWindow.setIgnoreMouseEvents(true); //点击穿透

	editForm.loadURL('http://localhost:9080/#/fillDataPage')

	editForm.on('closed', () => {
		editForm = null
	})
}

function showDanmu (){
	danmuScreen = new BrowserWindow({
		width: 1920,
		height: 1080,
		// transparent: true,
		// frame: false,
		// resizable: false,
		// alwaysOnTop: true,
		// center: true,
		// skipTaskbar: true,
		// autoHideMenuBar: true,
		// focusable: false
	})
	// danmuScreen.setAlwaysOnTop(true, 'pop-up-menu'); //一定要这样设置 要不然在mac下全屏播放PPT的时候看不到
	
	danmuScreen.maximize(); //窗口最大化
	// danmuScreen.setIgnoreMouseEvents(true); //点击穿透
	
	danmuScreen.loadURL('http://localhost:9080/#/screen')
	
	danmuScreen.on('closed', () => {
		danmuScreen = null
	})
}

function disableDanmu(){
	danmuScreen.close()
}

function initTrayIcon() {

	const tray = new Tray('./static/test.jpg');
	const trayContextMenu = Menu.buildFromTemplate([{
			label: '退出',
			click: () => {
				app.quit()
			}
		}, {
			label: '弹幕速度',
			submenu: [{
					label: "慢",
					checked: false,
					type: 'radio',
					click() {
						axios.get("http://localhost:8100/control/?optName=speed&optValue=slow")
					}
				},
				{
					label: "中等",
					checked: true,
					type: 'radio',
					click() {
						axios.get("http://localhost:8100/control/?optName=speed&optValue=normal")
					}
				},
				{
					label: "快",
					checked: false,
					type: 'radio',
					click() {
						axios.get("http://localhost:8100/control/?optName=speed&optValue=fast")
					}
				}
			]
		},
		{
			label: '暂停',
			type: "checkbox",
			checked: false,
			click() {
				axios.get(
					`http://localhost:8100/control/?optName=notRenderData&optValue=!self.options.notRenderData&optType=json`)
			}
		},
		{
			label: '行距',
			submenu: [{
					label: "单倍行距",
					checked: false,
					type: 'radio',
					click() {
						axios.get("http://localhost:8100/control/?optName=rowSpacing&optValue=1")
					}
				},
				{
					label: "1.5倍行距",
					checked: false,
					type: 'radio',
					click() {
						axios.get("http://localhost:8100/control/?optName=rowSpacing&optValue=1.5")
					}
				},
				{
					label: "2倍行距",
					checked: false,
					type: 'radio',
					click() {
						axios.get("http://localhost:8100/control/?optName=rowSpacing&optValue=2")
					}
				}
			]
		}
	]);
	tray.setToolTip('抽奖小程序');
	tray.on('right-click', () => {
		tray.popUpContextMenu(trayContextMenu);
	});

}

app.on('ready', _ => {
	createWindow();
	initTrayIcon();
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})

ipcMain.on("commCrtl", (event, args) => {
	switch (args){
		case "openEditForm":{
			createEditForm()
			break
		}
		case "showDanmu": {
			showDanmu()
			break
		}
		case "showWhoIsWinner": {
			danmuScreen.webContents.send("eventInstance", "showWhoIsWinner")
			break
		}
		case "drawWhoIsWinner": {
			danmuScreen.webContents.send("eventInstance", "drawWhoIsWinner")
			break
		}
		case "disableDanmu": {
			disableDanmu()
			break
		},
		case "disableDetail":{
			danmuScreen.webContents.send("eventInstance", "disableDetail")
		}
	}
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
