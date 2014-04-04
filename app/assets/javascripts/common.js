(function($) {
	var map;
	var markerManager;
	var mapCoordinates;
	var currentCoordinates;

	function getLocation(cb) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cb);
	    }
	}

	function getCornerCoordinates(map) {
		var bounds = map.getBounds();
		console.log(bounds);
		var corners = {
			'NE': {
				'latitude': bounds._northEast.lat,
				'longitude': bounds._northEast.lng
			},
			'SE': {
				'latitude': bounds._southWest.lat,
				'longitude': bounds._northEast.lng
			}, 
			'SW': {
				'latitude': bounds._southWest.lat,
				'longitude': bounds._southWest.lng
			}, 
			'NW': {
				'latitude': bounds._northEast.lat,
				'longitude': bounds._southWest.lng
			}
		}
		return corners;
	}

	function displayMap(position) { 
		currentCoordinates = position;
		map = new tomtom.Map({
			domNode: "map-container",
			center: [position.coords.latitude, position.coords.longitude],
			apiKey: "cqz42jgvsqt6qra52jj373hr",
			zoom: 10,
			overviewMap: true,
			scale: true,
			panZoomBar: true
		});

		initMarkers(map);
	}

	function setView(position) { 
		currentCoordinates = position;
		console.log(position);
		var latlng = L.latLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
		map.setView (latlng, 12, false);
	}

	function initMarkers(map) {
		markerManager = new tomtom.MarkerManager({
			map: map,
			animation: true,
			clustering: true
		});
	}

	function addMarkers(coordinatesArray) {
		for (var coordinate in coordinatesArray) {
			markerManager.addMarker(new tomtom.Marker([coordinate.latitude, coordinate.longitude]));
		}
		markerManager.update();
	}

	function removeAllMarkers(coordinatesArray) {
		markerManager.clearMarkers();
		markerManager.update();
	}


	$(function () {
		tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
		tomtom.setImagePath("../../../vendor/assets/map");

		$("#reDoSearch").bind( "click", function() {
		  mapCoordinates = getCornerCoordinates(map)
		  console.log(mapCoordinates);
		  //search with the updated coordinates
		  //basicaly ajax call to get data from given coordinates
		});

		$("#locateMe").bind( "click", function() {
			getLocation(setView)
			// map.locate();
		});

		getLocation(displayMap);
	});
})(jQuery);
