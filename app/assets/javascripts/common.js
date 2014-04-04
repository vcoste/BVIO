(function($) {
	var map;
	var markerManager;
	var mapCoordinates;
	var currentCoordinates;
	var category_id = 35;

	var mapContainer;
	var mapSpinner;

	var tableContainer
	var tableSpinner

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
		mapSpinner.stop();
		initMarkers(map);
		getProducts(category_id, map);
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

	function getProducts(category, map) {
		$.ajax({
			url: "/products",
			dataType: "json",
			data: {
				category_id: category,
				corners: getCornerCoordinates(map)	
			}
		}).done(function(response) {
			tableSpinner.stop();
			$.each(response, function(index, product) {
				var tableRow = $("<tr>" +
					"<td>" + product.name + "</td>" +
					"<td>" + product.avg_rating + "</td>" +
					"<td>" + product.satisfaction + "</td>" +
					"<td>" + product.total_reviews + "</td>" +
				"</tr>");
				tableRow.on("click", function() {
					if (!$(this).hasClass("selected")) {
						$("#productTable tbody .selected").removeClass("selected");
						$(this).addClass("selected");
					}
				});
				$("#productTable tbody").append(tableRow);
			});
		});
	}


	$(function () {
		tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
		//tomtom.setImagePath("../../../vendor/assets/map");

		var opts1 = {
		  lines: 13, // The number of lines to draw
		  length: 20, // The length of each line
		  width: 10, // The line thickness
		  radius: 30, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#000', // #rgb or #rrggbb or array of colors
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9 // The z-index (defaults to 2000000000)
		};
		var opts2 = {
		  lines: 13, // The number of lines to draw
		  length: 20, // The length of each line
		  width: 10, // The line thickness
		  radius: 30, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#000', // #rgb or #rrggbb or array of colors
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000) 
		  top: '850px'  // Top position relative to parent in px
		};
		
		mapContainer = document.getElementById('map-container');		
		mapSpinner = new Spinner(opts1).spin(mapContainer);

		tableContainer = document.getElementById('asdf');
		console.log(tableContainer);
		tableSpinner = new Spinner(opts2).spin(tableContainer);

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
