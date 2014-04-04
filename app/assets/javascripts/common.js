(function($) {
	var map;
	var markerManager;
	var mapCoordinates;
	var currentCoordinates;
	var category_id = 68;

	var mapContainer;
	var mapSpinner;

	var tableContainer
	var tableSpinner
	var productInfoSpinner

	function getLocation(cb) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cb);
	    }
	}

	function getCornerCoordinates(map) {
		var bounds = map.getBounds();
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
			zoom: 9,
			scale: true,
			panZoomBar: true
		});
		mapSpinner.stop();
		initMarkers(map);
		renderMapButtons(map);
		getProducts(category_id, map);
	}

	function renderMapButtons(map) {
		var homeButton = $("<a id='searchHome'><i class='fa fa-home'></i> Home</a>");
		homeButton.on("click", function() {
			getLocation(setView);
		});
		$(".map-buttons").append(homeButton);

		var searchButton = $("<a id='searchProducts'><i class='fa fa-search'></i> Search</a>");
		searchButton.on("click", function() {
			mapCoordinates = getCornerCoordinates(map);
			getProducts(category_id, map);
		});
		$(".map-buttons").append(searchButton);
	}

	function setView(position) { 
		currentCoordinates = position;
		var latlng = L.latLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
		map.setView (latlng, 9, false);
	}

	function initMarkers(map) {
		markerManager = new tomtom.MarkerManager({
			map: map,
			animation: true,
			clustering: true
		});
	}

	function addMarkers(coordinatesArray) {
		$.each(coordinatesArray, function(index, coordinate) {
			var latlng = L.latLng(parseFloat(coordinate.latitude), parseFloat(coordinate.longitude));
			markerManager.addMarker(new tomtom.Marker(latlng));
		});
		markerManager.update();
	}

	function removeAllMarkers() {
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
			},
			beforeSend: function() {
				tableSpinner.stop();
				$("#productTable tbody").empty();
				tableSpinner.spin(tableContainer);	
			}
		}).done(function(response) {
			tableSpinner.stop();

			$.each(response, function(index, product) {
				var tableRow = $("<tr data-id='" + product.id + "'>" +
					"<td>" + product.name + "</td>" +
					"<td>" + product.avg_rating + "</td>" +
					"<td>" + product.satisfaction + "%</td>" +
					"<td>" + product.total_reviews + "</td>" +
					"<td>" + product.num_recommendations + "</td>" +
				"</tr>");
				tableRow.on("click", function() {
					if (!$(this).hasClass("selected")) {
						$("#productTable tbody .selected").removeClass("selected");
						$(this).addClass("selected");
						getProductInformation($(this).data("id"), map);
					}
				});
				$("#productTable tbody").append(tableRow);
			});
		});
	}

	function getProductInformation(id, map) {

		var opts1 = {
		  lines: 7, // The number of lines to draw
		  length: 4, // The length of each line
		  width: 2, // The line thickness
		  radius: 2, // The radius of the inner circle
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
		  top: '235px',
		  left: '94%'
		};

		productContainer = document.getElementById('product-container');	
		productInfoSpinner = new Spinner(opts1).spin(productContainer);

		$.ajax({
			url: "/products/" + id,
			dataType: "json",
			data: {
				corners: getCornerCoordinates(map)
			}
		}).done(function(response) {
			productInfoSpinner.stop();
			$(".product-details").append("<img src='" + response.image_url + "'>");
			$(".product-details").append("<p class='product-title'>" + response.name + "</p><hr/>");

			var starString = "";
			for (var i = 1; i < 6; i++) {
				if (i <= response.avg_rating) {
					starString += "&#9733;&nbsp;";
				} else {
					starString += "&#9734;&nbsp;";
				}
			}
			$(".product-details").append("<p class='sub-heading'>Average Ratings</p>");
			$(".product-details").append("<span class='review-stars'>" + starString + "</span><hr/>");

			$(".product-details").append("<p class='sub-heading'>Top Review</p>");
			var reviewText = (response.top_review.review_text.length > 390 ? response.top_review.review_text.substr(0,390) + "..." : response.top_review.review_text);
			$(".product-details").append('<i class="top-review">"' + reviewText + '"</i>');
			$(".product-details").append("<p class='top-review-rating'>Rating Given: <i>" + response.top_review.rating + "</i></p>");
			$(".product-details").append("<p class='top-review-recommended'>Recommended Product: <i>" + (response.top_review.is_recommended ? "YES" : "NO") + "</i></p><hr/>");

			$(".product-details").append("<p class='sub-heading'>Product Recommendations</p>");
			var productRecommendations = "<ul class='product-tag-recommendations'>";
			for (var j = 0; (j < 3 && j < response.tag_array.length); j++) {
				var tag = Object.keys(response.tag_array[j]);
				var percent = (response.tag_array[j])[tag];
				productRecommendations += "<li>" + tag +  " - " + Math.round(percent) + "%</li>";
			}
			$(".product-details").append(productRecommendations + "</ul><hr/>");

			$(".product-details").append("<p class='sub-heading'>Gender Demographics</p>");
			$(".product-details").append("<span class='gender-male'>&#9794;&nbsp;" + Math.round(response.gender_percentages.Male) + "%</span>");
			$(".product-details").append("<span class='vertical-divider'>|</span>");
			$(".product-details").append("<span class='gender-female'>&#9792;&nbsp;" + Math.round(response.gender_percentages.Female) + "%</span>");

			var coordinatesArray = new Array();
			$.each(response.reviews, function(index, review) {
				coordinatesArray.push({
					latitude: review.latitude,
					longitude: review.longitude
				});
			});

			removeAllMarkers();
			addMarkers(coordinatesArray);
		});
	}

	$(function () {
		$.ajax({
			url: "/categories",
			dataType: "json"
		}).done(function(response) {
			$.each(response, function(index, category) {
				var category = $("<li data-id='" + category.id + "'>" + category.name  + "</li>");
				category.on("click", function() {
					$("#categoryNavigationList .selected").removeClass("selected");
					$(this).addClass("selected");
					category_id = $(this).data("id");
				});
				$("#categoryNavigationList").append(category);
			});

			$($("#categoryNavigationList").children()[0]).click();
		});	

		tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
		getLocation(displayMap);
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
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: '350px'
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

		tableContainer = document.getElementById('spinnerContainer');
		tableSpinner = new Spinner(opts2).spin(tableContainer);
		
	});
})(jQuery);
