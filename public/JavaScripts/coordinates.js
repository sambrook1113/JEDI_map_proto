class Asset{
	constructor(id, location, type, map, marker){
		this.id=id;
		this.location;
		this.type=type;
		this.map = map;
		this.marker = marker;
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
}


