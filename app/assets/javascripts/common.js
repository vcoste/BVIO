(function($) {
	var map;
	var markerManager;

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(displayMap);
	    }
	}

	function getCornerCoordinates(map) {
		var bounds = map.getBounds();
		console.log(bounds);
		var corners = {
			'NE' : {
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
		tomtom.setImagePath("../../vendor/assets/images");
		map = new tomtom.Map({
			domNode: "map-container",
			center: [position.coords.latitude, position.coords.longitude],
			apiKey: "cqz42jgvsqt6qra52jj373hr",
			zoom: 14,
			overviewMap: true,
			scale: true,
			panZoomBar: true
		});

		initMarkers(map);
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

	// function removeMarkers(coordinatesArray) {
	// 	markerManager.update();
	// }

	function removeAllMarkers(coordinatesArray) {
		markerManager.clearMarkers();
		markerManager.update();
	}

	$(function () {
		tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
		tomtom.setImagePath("../../vendor/assets/images");

		getLocation();
		// map.on("load", function() {
		// 	alert("MAP Loaded");
		// });
	});
})(jQuery);
