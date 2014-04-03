tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
// tomtom.setImagePath("/images/map");

$( document ).ready(function() {
	var map
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
				'lat': bounds._northEast.lat,
				'lng': bounds._northEast.lng
			},
			'SE': {
				'lat': bounds._southWest.lat,
				'lng': bounds._northEast.lng
			}, 
			'SW': {
				'lat': bounds._southWest.lat,
				'lng': bounds._southWest.lng
			}, 
			'NW': {
				'lat': bounds._northEast.lat,
				'lng': bounds._southWest.lng
			}
		}
		return corners;
	}

	function displayMap(position) {
		map = new tomtom.Map({
			domNode: "map",
			center: [position.coords.latitude, position.coords.longitude],
			apiKey: tomtom.apiKey,
			zoom: 14,
			overviewMap: true,
			scale: true,
			panZoomBar: true
		});

		console.log(getCornerCoordinates(map));
	}

	getLocation();
});