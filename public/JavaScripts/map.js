 var map;
 var markerSize;
 var activeAssets = [];
 var activeEnemyAssets = [];

 function initMap() {
 	map = new google.maps.Map(document.getElementById('map'), {
 		center: {lat: 51.852694460878936, lng: -0.21696062500000224},
 		zoom: 8,
 		styles: mapStyleJSON
 	});
 	markerSize= new google.maps.Size(64,64);
 	smallMarkerSize = new google.maps.Size(24,24);
 	communicate();
 }

 function addJet(id,lat,lng){
 	var marker = new google.maps.Marker({
 		position: new google.maps.LatLng(lat,lng),
 		icon: {url:'../public/photos/jet.png',
 		scaledSize: markerSize},
 		map: map
 	});
 	var asset = new Asset(id,[lat,lng],"Eurofighter Typhoon",map,marker);
 	activeAssets.push(asset);
 	return asset
 }

 function addTank(id,lat,lng){
 	var marker = new google.maps.Marker({
 		position: new google.maps.LatLng(lat,lng),
 		icon: {url:'../public/photos/tank.png',
 		scaledSize: smallMarkerSize},
 		map: map
 	});
 	var asset = new Asset(id,[lat,lng],"CHALLENGER 2",map,marker);
 	activeAssets.push(asset);
 	return asset
 }

 function addEnemyAsset(EnID, lat,lng,dng,buf){
 	var marker = new google.maps.Marker({
 		position: new google.maps.LatLng(lat,lng),
 		icon: {url:'../public/photos/SAM.png',
 		scaledSize: markerSize},
 		map: map
 	});
 	danger = drawRadius(lat, lng, dng, "red");
 	buffer = drawRadius(lat, lng, buf, "blue");
 	let enemyAsset = new EnemyAsset(EnID, [lat,lng], map, marker, buf, dng);
 	enemyAsset.setBufferMarker(buffer);
 	enemyAsset.setDangerMarker(danger);
 	activeEnemyAssets.push(enemyAsset);
 	return enemyAsset
 }

 function drawRadius(lat,lng,rad,col){
 	var radius = new google.maps.Circle({
 		center: new google.maps.LatLng(lat,lng),
 		map: map,
 		radius: rad,
 		fillColor: col
 	});
 	return radius
 }

 function feedData(data){
 	let asset = null;
 	let assetIsActive = false;
 	for(var x=0; x<activeAssets.length; x++){
 		if(activeAssets[x].getID()==data.unique_id){
 			asset = activeAssets[x];
 			assetIsActive = true;
 		}
 	}
 	if(assetIsActive!=true){
 		asset = createNewAsset(data);
 		assetIsActive = true;
 	}
 	if(assetIsActive){ // for the sake of undefined edge cases
 		asset.marker.setPosition(new google.maps.LatLng(data.location.lat,data.location.lon));
 		markEnemyAssets(data, ()=>{
 			for(var x=0; x<activeEnemyAssets.length; x++){
 				checkBreach(asset, activeEnemyAssets[x], data);
 			}
 		});
 		updateAssetsLedger();
 		updateReceivedLedger(data);
 	}
 }

 function markEnemyAssets(data, callback){
 	if(data.enemy != null){
 		let enemy = null;
 		let enemyIsActive = false;
 		for(var x=0; x<activeEnemyAssets.length; x++){
 			if(data.enemy.id==activeEnemyAssets[x].id){
 				enemy = activeEnemyAssets[x];
 				enemyIsActive = true;
 			}
 		}
 		if(enemyIsActive!=true){
 				enemy = addEnemyAsset(data.enemy.id,data.enemy.location.lat, data.enemy.location.lon, data.enemy.death, data.enemy.buffer);
 			}
 		enemy.updateLocation(data.enemy.location.lat, data.enemy.location.lon);
 		updateEnemyAssetsLedger()
 	}
 	callback();
 }

 function createNewAsset(data){
 	let type = data.type
 	switch(data.type) {
  	case 'Eurofighter Typhoon':
    	let jet = addJet(data.unique_id, data.location.lat, data.location.lon)
    	return jet
    	break;
    case 'Challenger 2':
    	let tank = addTank(data.unique_id, data.location.lat, data.location.lon)
    return tank
	}
 }

 function checkBreach(asset, enAsset, data){
 	console.log('checkBreach')
 	if(asset.type=='Eurofighter Typhoon'){
 		let distance = parseInt(google.maps.geometry.spherical.computeDistanceBetween(enAsset.bufferMarker.getCenter(), asset.marker.getPosition()));
 		if(distance<enAsset.bufferMarker.getRadius()){
 			updateSentLedger(data, enAsset)
 			return true
 		}
 		else{
 			return false
 		}
 	}
 }

 function updateAssetsLedger(){
 	let myHTML = "";
 	myHTML += "<table>";
 	myHTML += `<tr><th colspan="3">FRIENDLY ASSETS</th></tr>`
 	myHTML += "<tr> <th>ID</th><th>Type</th><th>Last Position</th></tr>"
 	for(var x=0; x<activeAssets.length;x++){
 		myHTML += "<tr>";
 		myHTML += "<td>" + activeAssets[x].id + "</td>";
 		myHTML += "<td>" + activeAssets[x].type + "</td>";
 		myHTML += "<td>" + activeAssets[x].marker.getPosition().lat().toFixed(6)+", "+ activeAssets[x].marker.getPosition().lng().toFixed(6)+ "</td>";
 		myHTML += "</tr>";
 	}
 	myHTML += "</table>";
 	document.getElementById('active-assets').innerHTML = myHTML;
 }

  function updateEnemyAssetsLedger(){
 	let myHTML = "";
 	myHTML += "<table>";
 	myHTML += `<tr><th colspan="2">ENEMY ASSETS</th></tr>`
 	myHTML += "<tr> <th>ID<th>Last Position</th></tr>"
 	for(var x=0; x<activeEnemyAssets.length;x++){
 		myHTML += "<tr>";
 		myHTML += "<td>" + activeEnemyAssets[x].id + "</td>";
 		myHTML += "<td>" + activeEnemyAssets[x].marker.getPosition().lat().toFixed(6)+", "+ activeEnemyAssets[x].marker.getPosition().lng().toFixed(6)+ "</td>";
 		myHTML += "</tr>";
 	}
 	myHTML += "</table>";
 	document.getElementById('active-enemy-assets').innerHTML = myHTML;
 }

function updateReceivedLedger(data){
	let table = document.getElementById("received-table");
	if(table.rows.length>=5){
		table.deleteRow(-1);
	}

	let row = table.insertRow(2);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	let cell3 = row.insertCell(2);
	cell1.innerHTML = data.type;
	cell2.innerHTML = data.location.lat + ", "+ data.location.lon;
	cell3.innerHTML = new Date();

}

function updateSentLedger(data, enAsset){
	let table = document.getElementById("sent-table");
	if(table.rows.length>=5){
		table.deleteRow(-1);
	}

	let row = table.insertRow(2);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	cell1.innerHTML = data.unique_id;
	cell2.innerHTML = "DANGER: En Asset at: " + enAsset.bufferMarker.getCenter().lat() + ", " + enAsset.bufferMarker.getCenter().lng();

}












