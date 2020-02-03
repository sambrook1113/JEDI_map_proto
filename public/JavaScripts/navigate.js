var demoSAM;
var demoCoordinates = [[50.908187, -1.404441],
						[51.196519, -1.008933],
						[51.337438, -0.761741],
						[51.457392, -0.465110],
						[51.597510, -0.283836],
						[51.769242, 0.087670],
						[51.946210, -0.018775],
						[52.084576, 0.015706],
						[52.205465, 0.121017],
						[52.345006, 0.317804],
						[52.430686, 0.535777],
						[52.524624, 0.790442],
						[52.580939, 0.983464],
						[52.603542, 1.175982],
						[52.630640, 1.296145]];


// async function demoSimulation(){
// 	//addTank("24816",51.866000, 0.975082);
//     //addJet("23579",50.718690, -1.880682); 
//     communicate();
// }

function spotSAM(){
	//demoSAM = addSAM(51.895751, 0.890772,30000,60000);
	document.getElementById('notificationDisplay').innerHTML = '"'+activeAssets[0].getType()+'" ' + "with ID: " + activeAssets[0].getID()+
	" has spotted SAM at coordinates: " + "51.895751, 0.890772";
}

// async function startSimulation(){
// 	await runSimulation(1000);

// }

function communicate(){
	var socket = io('http://localhost:3001');
	socket.on('iot_ping', (data)=>{
		feedData(data);
		//console.log(data.unique_id+": "+data.location.lat+" "+data.location.lon);

	})
}

