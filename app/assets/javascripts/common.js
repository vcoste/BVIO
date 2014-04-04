(function($) {
	var map;
	var markerManager;
	var mapCoordinates;
	var currentCoordinates;
	var category_id = 119;

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
			$("#productTable tbody").empty();
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
		$.ajax({
			url: "/products/" + id,
			dataType: "json",
			data: {
				corners: getCornerCoordinates(map)
			}
		}).done(function(response) {
			console.log(response);
			$(".product-details img").attr("src", response.image_url);
			$(".product-title").html(response.name);

			$(".review-stars").empty();
			for (var i = 1; i < 6; i++) {
				if (i <= response.avg_rating) {
					$(".review-stars").append("&#9733;&nbsp;");
				} else {
					$(".review-stars").append("&#9734;&nbsp;");
				}
			}

			var reviewText = (response.top_review.review_text.length > 390 ? response.top_review.review_text.substr(0,390) + "..." : response.top_review.review_text);
			$(".top-review").html('"' + reviewText +  '"');
			$(".top-review-rating i").html(response.top_review.rating);

			if (response.top_review.is_recommended) {
				$(".top-review-recommended i").html("YES");	
			} else {
				$(".top-review-recommended i").html("NO");
			}

			$(".product-tag-recommendations").empty();
			for (var j = 0; (j < 3 && j < response.tag_array.length); j++) {
				var tag = Object.keys(response.tag_array[j]);
				var percent = (response.tag_array[j])[tag];
				$(".product-tag-recommendations").append("<li>" + tag +  " - " + percent + "%</li>")
			}

			$(".gender-male").html("&#9794;&nbsp;" + response.gender_percentages.Male + "%");
			$(".gender-female").html("&#9792;&nbsp;" + response.gender_percentages.Female + "%");

		});
	}

	$(function () {
		tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
		getLocation(displayMap);
	});
})(jQuery);
