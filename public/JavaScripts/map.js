 var map;
 var markerSize;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 51.525782, lng: -0.129070},
          zoom: 8
        });
        markerSize= new google.maps.Size(64,64);
        addJet(51.346863, -0.991497);
        addSAM(52.406521, 0.716856);
        drawRadius(52.406521, 0.716856);
      }



      function addJet(lat,lng){
      	var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            icon: {url:'https://www.aerotime.aero/aviation-blog/wp-content/uploads/2017/05/Dassault-Rafale.jpg',
            	scaledSize: markerSize},
            map: map
      	})
      }

      function addSAM(lat,lng){
      	var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            icon: {url:'http://roe.ru/upload/resize_cache/iblock/c1b/1200_900_1e3cd68611aa859771f9d287689e58ce0/c1b5a3751912f657f904d88cc2f8ba02.jpg',
            	scaledSize: markerSize},
            map: map
      	})
      }

      function drawRadius(lat,lng){
      	var radius = new google.maps.Circle({
      		center: new google.maps.LatLng(lat,lng),
      		map: map,
      		radius: 50000,
      		fillColor: "red"
      	})
      }


     
 