// Coordinates for original map view
var startingCoords = [37.09, -95.71];
var mapZoomLevel = 3;

// Create the createMap function
function createMap(startingCoords, mapZoomLevel, earthquakeInstances) {

  // Create a baseMaps object to hold the satellite layer
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the darkmap layer
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the outdoormap layer
  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var baseMaps = {
    Satellite: satellitemap,
    Dark: darkmap,
    Outdoors: outdoormap
  };
  // Create an overlayMaps object to hold the earthquakes layer
  overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map object with options
  var myMap = L.map("map", {
    center: startingCoords,
    zoom: mapZoomLevel,
    layer: [satellitemap, earthquake]
  });

  // Create layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}



// Create the createCircles function
function createCircles(response) {
  // Pull the "features" property from response
  var quakes = response.features;

  // Initialize an array to hold the earthquake data
  var earthquakeCircles = [];

  // Loop through the earthquakes array
    // For each earthquake, create a circle and bind a popup with additional info
  quakes.forEach(function(quake) {
    earthquakeCircles.push(
      L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        
      }).bindPopup()
    );
  });

  // Create a layer group with the earthquake circles and output as function return
  var earthquakeInstances = L.layerGroup(earthquakeCircles);
  return earthquakeInstances;
}



// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(response) {
  // createMap(newYorkCoords, mapZoomLevel,createMarkers(response));
  console.log(response);
  console.log(`Lon:${response.features[0].geometry.coordinates[0]}`);
  console.log(`Lat:${response.features[0].geometry.coordinates[1]}`);
  console.log(`epicenter depth:${response.features[0].geometry.coordinates[2]}`);
  console.log(`Magnitude:${response.features[0].properties.mag}`);
  console.log(`Place:${response.features[0].properties.place}`);
});
