var demoSAM;

function spotSAM(){
	document.getElementById('notificationDisplay').innerHTML = '"'+activeAssets[0].getType()+'" ' + "with ID: " + activeAssets[0].getID()+
	" has spotted SAM at coordinates: " + "51.895751, 0.890772";
}

function communicate(){
	var socket = io('http://localhost:3001');
	socket.on('iot_ping', (data)=>{
		feedData(data);
		console.log('active assets: ' +activeAssets.length)
		console.log('enemy assets: '+ activeEnemyAssets.length)
	})
}

