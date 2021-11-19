const PathFinder = require('geojson-path-finder');
const geojsonLength = require('geojson-length');

/**
 * 
 * @param {object} geojson graph model, in geojson format
 * @param {float} start array of coordinates of startig point
 * @param {float} dest array of coordinates of destination point
 * @param {boolean} considerTypeWeight if true, type weight will be considered
 * @returns 
 */
const calcPath = ( geojson, start, dest, considerTypeWeight ) => {

    const gj_start = geoJsonFromArr(start);
    const gj_dest = geoJsonFromArr(dest);

    
    const pathfinder = new PathFinder(geojson, { 
        precision: 1e-3,
        weightFn: function(a, b, props) {
            const typeWeight = considerTypeWeight ? props.typeWeight : 1;

            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            return Math.sqrt(dx * dx + dy * dy) * typeWeight;
        }
    });

    const path = pathfinder.findPath(gj_start, gj_dest);
    
    if (!path){
        throw `Cannot calculate path from ${start.join(', ')} to ${dest.join(', ')}`;
    }

    const GeoJson = {
        "type": "FeatureCollection",
        "name": "arcs",
        "features": [
            { 
            "type": "Feature", 
            "properties": {}, 
            "geometry": { 
                "type": "LineString", 
                "coordinates": path.path
            }
        }
        ]
    };
    
    return {
        "geojson": GeoJson,
        "distance": (geojsonLength(GeoJson.features[0].geometry) / 1000).toFixed(2)
    };
};

const geoJsonFromArr = (lngLatArr) => {
    return { 
        "type": "Feature", 
        "geometry": { 
            "type": "Point", 
            "coordinates": [ 
                parseFloat(lngLatArr[0]), 
                parseFloat(lngLatArr[1])
            ] 
        } 
    };
}

module.exports = calcPath;
