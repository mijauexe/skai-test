import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj';

var listy = [];
var geojsonObject = {};

fetch('polygon.json')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.polygon.map(coord => {
      listy.push(fromLonLat(coord));
    });
    console.log(listy.length)
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
    // Define styles and create vector layer

    const styles = {
      'Polygon': new Style({
        stroke: new Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    };

    const styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    const extent = vectorSource.getExtent();
    console.log(extent)

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: 'map',
    });

    const centerX = (extent[0] + extent[2]) / 2;
    const centerY = (extent[1] + extent[3]) / 2;

    map.setView(new View({
      center: [centerX, centerY],
      zoom: 8,
    }));
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50], // Add padding to ensure the polygon is fully visible
      duration: 1000, // Animation duration in milliseconds (optional)
    });

  })
  .catch(error => {
    console.error('Error fetching polygon coordinates:', error);
  });
