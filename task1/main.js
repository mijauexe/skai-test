import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj';

// Very basic error handling function if the polygon can't be loaded
const handleError = (error) => {
  // Display or handle the error message in the HTML page
  const errorMessage = `${error}`;
  console.log(error)
  document.getElementById('map').innerText = error;
};

/*
  Declare a list for loading the polygon json
  And a geoJsonObject that is used by the OL library as a wrapper to draw on the map
*/
var listy = [];
var geojsonObject = {};

// First we fetch the local json file asynchronously
fetch('polygon.json')
  .then(response => response.json())
  .then(data => {

    /*
      Data in the json file is declared in coordinates, 
      but we need to transform them to the projected coordinate system EPSG:3857
      to be able to draw them on the map
    */

    data.polygon.map(coord => {
      listy.push(fromLonLat(coord));
    });

    // Since we fetched the data asynchronously, 
    // we need to create the wrapper here in the "then" function AFTER the data is fetched and parsed

    geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857',
        },
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [listy],
          },
        },
      ],
    };

    return geojsonObject;
  })
  .then(() => {

    // Create the basic style with a custom color
    const styles = {
      'Polygon': new Style({
        stroke: new Stroke({
          color: 'purple',
          lineDash: [4],
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(161, 3, 152, 0.5)',
        }),
      }),
    };

    const styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };

    // Create a vector layer for drawing
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    //Use the extent of the polygon for zooming
    const extent = vectorSource.getExtent();

    // Creating the map
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: 'map',
    });

    // Calculate the rough center of the polygon to be able to focus on the area when loading the page
    const centerX = (extent[0] + extent[2]) / 2;
    const centerY = (extent[1] + extent[3]) / 2;

    map.setView(new View({
      center: [centerX, centerY],
      zoom: 8,
    }));

    map.getView().fit(extent, {
      padding: [50, 50, 50, 50], // Add padding to ensure the polygon is fully visible
      duration: 1000, // Zoom animation duration in milliseconds
    });

  })
  .catch(error => {
    handleError(`Error fetching polygon coordinates: ${error}`);
  });
