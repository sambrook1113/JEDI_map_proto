class Asset{
	constructor(id, location, type, map, marker){
		this.id=id;
		this.location;
		this.type=type;
		this.map = map;
		this.marker = marker;
		this.timestamp;
	}

	setLocation(location){
		this.location = location;
	}

	getLocation(){
		return this.location;
	}

	getID(){
		return this.id;
	}

	getType(){
		return this.type;
	}
	getMarker(){
		return this.marker;
	}
}

class EnemyAsset{
	constructor(id ,location, map, marker, buffer, danger){
		this.id = id;
		this.location = location;
		this.map = map;
		this.marker = marker;
		this.buffer = buffer;
		this.danger = danger;
		this.bufferMarker;
		this.dangerMarker;
	}

	setLocation(location){
		this.location = location;
	}

	getLocation(){
		return this.location;
	}

	getMarker(){
		return this.marker;
	}

	getBuffer(){
		return this.buffer;
	}

	getDanger(){
		return this.danger;
	}

	setBuffer(buffer){
		this.buffer = buffer;
	}

	setDanger(danger){
		this.danger = danger;
	}

	setBufferMarker(marker){
		this.bufferMarker = marker;
	}

	setDangerMarker(marker){
		this.dangerMarker = marker;
	}

	updateLocation(lat, lon){
		let newPosn = new google.maps.LatLng(lat,lon)
		this.marker.setPosition(newPosn);
		this.bufferMarker.setCenter(newPosn);
		this.dangerMarker.setCenter(newPosn);
		
	}
}



