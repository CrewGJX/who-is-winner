import {
	app,
	BrowserWindow,
	Tray,
	Menu
} from 'electron'

import axios from 'axios'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:9080` :
	`file://${__dirname}/index.html`

function createWindow() {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		// transparent: true,
		// frame: false,
		resizable: false,
		// alwaysOnTop: true,
		center: true,
		// skipTaskbar: true,
		autoHideMenuBar: true,
		// focusable: false
	})
	// mainWindow.setAlwaysOnTop(true, 'pop-up-menu'); //一定要这样设置 要不然在mac下全屏播放PPT的时候看不到

	mainWindow.maximize(); //窗口最大化
	// mainWindow.setIgnoreMouseEvents(true); //点击穿透

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

function initTrayIcon() {

	const tray = new Tray('./static/meinv.jpg');
	const trayContextMenu = Menu.buildFromTemplate([{
		label: '退出',
		click: () => {
			app.quit()
		}
	}, {
		label: '弹幕速度',
		submenu: [
			{
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
	}]);
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
