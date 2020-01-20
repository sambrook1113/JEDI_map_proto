 var map;
 var markerSize;
 var activeAssets = [];

 function initMap() {
 	map = new google.maps.Map(document.getElementById('map'), {
 		center: {lat: 51.852694460878936, lng: -0.21696062500000224},
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
 	danger = drawRadius(lat, lng, dng, "red");
 	buffer = drawRadius(lat, lng, buf, "blue");
 	return {marker: marker, danger: danger, buffer: buffer} 
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
 				this.psn = new google.maps.LatLng(demoCoordinates[0][0], demoCoordinates[0][1]);
 				activeAssets[0].marker.setPosition(this.psn);
 				checkBreach(this.psn,demoSAM.buffer);
 				demoCoordinates.shift();
 				runSimulation(millisecondsToWait);
 			}
 			else{
 				console.log("simulation complete.")
 			}
 		}, millisecondsToWait);
 	});
 }

 function checkBreach(marker,circle){
 	this.radius = circle.getRadius()
 	this.center = circle.getCenter()
 	this.distance = parseInt(google.maps.geometry.spherical.computeDistanceBetween(this.center, marker));
 	if((this.distance-this.radius)<=0){
 		console.log("circle breached!!!!")
 		return true
 	}
 	else{
 		return false
 	}
 }














