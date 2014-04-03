tomtom.apiKey = "cqz42jgvsqt6qra52jj373hr";
// tomtom.setImagePath("/images/map");

$( document ).ready(function() {

	function getLocation() {
		console.log('hey')
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(displayMap);
	    }
	}

	function displayMap() {
		var map = new tomtom.Map({
			domNode: "map",
			apiKey: tomtom.apiKey
		});
	}

	getLocation();
	// map.on("load", function() {
	// 	alert("MAP Loaded");
	// });
});