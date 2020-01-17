 var map;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 51.525782, lng: -0.129070},
          zoom: 8
        });
        //addMarkers();
      }

      function addMarkers(){
      	var marker = new google.maps.Marker({
            position: new google.maps.LatLng(51.346863, -0.991497),
            icon: 'https://www.aerotime.aero/aviation-blog/wp-content/uploads/2017/05/Dassault-Rafale.jpg',
            map: map
          });
      }


     
 