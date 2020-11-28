const db = require('electron-db');
const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs'); 

const { app , BrowserWindow , Menu , ipcMain , ipcRenderer} = electron;
let mainWindow;
db.createTable('sifreler', (succ, msg) => {
  // succ - boolean, tells if the call is successful
  console.log("Success: " + succ);
  console.log("Message: " + msg);
})


app.on('ready',() => {
	mainWindow = new BrowserWindow({
		webPreferences: {
   		 	nodeIntegration: true,
   		 	enableRemoteModule: true,
		},
		icon: path.join(__dirname, 'icons/icons/mac/icon.icns')
	});
	mainWindow.loadURL(
		url.format({
			pathname:path.join(__dirname,"index.html"),
			protocol:"file:",
			slashes:true
		}),
	);

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

	ipcMain.on("add:new",(err,data) => {

		 
		if (db.valid('sifreler')) {
		  db.insertTableContent('sifreler', data, (succ, msg) => {
		    // succ - boolean, tells if the call is successful
		    console.log("Success: " + succ);
		    console.log("Message: " + msg);
		    mainWindow.webContents.send("add:new:callback","data");
		  })
		}
	})

	ipcMain.on("delete:id",(err,data) => {
		db.deleteRow('sifreler', {'id': data}, (succ, msg) => {
 		 	console.log(msg);
 		 	mainWindow.webContents.send("add:new:callback","data");
		});
	});

	ipcMain.on("update:db",(err,data) => {
		let where = {
 		 "id": data.id
		};
		 
		let set = {
		  "name": data.name,
		  "email": data.email,
		  "password": data.password
		}
		 
		db.updateRow('sifreler', where, set, (succ, msg) => {
		  // succ - boolean, tells if the call is successful
		  console.log("Success: " + succ);
		  console.log("Message: " + msg);
		  mainWindow.webContents.send("add:new:callback","data");
		});
	});



})

const mainMenuTemplate = [
	{
		label: "File",
		submenu:[
			{
				label:"Çikiş",
				role:"quit"
			},
			{
				label:"Reload",
				role:"reload"
			},
		]
	},
	{
		label: "Dev Tools",
		submenu:[
			{
				label:"Geliştirici",
				click(item,focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	},
	{
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  }
];