// Coordinates for original map view
var startingCoords = [37.09, -95.71];
var mapZoomLevel = 5;

// Create the createMap function
function createMap(startingCoords, mapZoomLevel, earthquakeInstances) {

  // Create a baseMaps object to hold the satellite layer
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the darkmap layer
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var baseMaps = {
    Satellite: satellitemap,
    Dark: darkmap,
    Light: lightmap
  };
  // Create an overlayMaps object to hold the earthquakes layer
  overlayMaps = {
    Earthquakes: earthquakeInstances
  };

  // Create the map object with options
  var myMap = L.map("map", {
    center: startingCoords,
    zoom: mapZoomLevel,
    layers: [satellitemap, earthquakeInstances]
  });

  // Create layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Legend set up
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    var colors = ["#ccffcc", "#ccff99", "#ffff99", "#ffdb4d", "#e68a00","#cc0000"];
    var labels = [];

    // Add levels
    var legendInfo = "<h1>Epicenter Depth</h1>" +
      "<div class=\"labels\">"
    // for (var i = 0; i < limits.length; i++) {
    //   legendInfo += "<div>" + limits[i] + "</div>";
    // }

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">" + limit + "</li>");
    });
    for (var i = 0; i < limits.length; i++) {
      div.innerHTML += "<ul>" + labels[i] + "</ul>";
    }

    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

}

// Create function to select color for circles
function chooseColor(depth) {
  // Initialize color variable
  var color = "";
  // Assign color by epicenter depth
  if (depth < 10) {
    color = "#ccffcc";
  }
  else if (depth < 30) {
    color = "#ccff99";
  }
  else if (depth < 50) {
    color = "#ffff99";
  }
  else if (depth < 70) {
    color = "#ffdb4d";
  }
  else if (depth < 90) {
    color = "#e68a00"
  }
  else {
    color = "#cc0000"
  }
  return color;
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
    var quakeInfo = `Location: ${quake.properties.place} <hr>
      Magnitude: ${quake.properties.mag} <br>
      Epicenter Depth: ${quake.geometry.coordinates[2]}`;
    earthquakeCircles.push(
      L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        color: chooseColor(quake.geometry.coordinates[2]),
        fillColor: chooseColor(quake.geometry.coordinates[2]),
        fillOpacity: 0.5,
        radius: quake.properties.mag * 10000
      }).bindPopup(quakeInfo)
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
  createMap(startingCoords, mapZoomLevel, createCircles(response));
});
