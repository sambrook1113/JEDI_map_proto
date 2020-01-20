 var map;
 var markerSize;
 var activeAssets = [];

 function initMap() {
 	map = new google.maps.Map(document.getElementById('map'), {
 		center: {lat: 51.525782, lng: -0.129070},
 		zoom: 8
 	});
 	markerSize= new google.maps.Size(64,64);
 	demoSimulation();
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

 function addSAM(lat,lng,dng,buf){
 	var marker = new google.maps.Marker({
 		position: new google.maps.LatLng(lat,lng),
 		icon: {url:'../public/photos/SAM.png',
 		scaledSize: markerSize},
 		map: map
 	});
 	drawRadius(lat, lng, dng, "red");
 	drawRadius(lat, lng, buf, "blue");
 	return marker
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

 function runSimulation(millisecondsToWait){
 	return new Promise(resolve => {
 		setTimeout(() => {
 			if(demoCoordinates.length>=1){
 				activeAssets[0].marker.setPosition(new google.maps.LatLng(demoCoordinates[0][0], demoCoordinates[0][1]));
 				demoCoordinates.shift();
 				console.log(demoCoordinates)
 				runSimulation(millisecondsToWait);
 			}
 			else{
 				console.log("simulation complete.")
 			}
 		}, millisecondsToWait);
 	});
 }












