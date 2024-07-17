// Define url for GeoJSON earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add earthquake data to map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // Create colors for depth
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }
    // Establish magnitude size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 4;
    }

    // Add earthquake data to map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

    // Add legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let labels = [];
        let depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

        for (let i = 0; i < depth.length; i++) {
            let color = mapColor(depth[i] + 1);
            labels.push(
                '<i style="background:' + color + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+')
            );
        }

        div.innerHTML += labels.join("");
        return div;
    };
    legend.addTo(myMap)
});
