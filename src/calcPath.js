const PathFinder = require('geojson-path-finder');


/**
 * 
 * @param {object} geojson graph model, in geojson format
 * @param {float} start array of coordinates of startig point
 * @param {float} dest array of coordinates of destination point
 * @returns 
 */
const calcPath = ( geojson, start, dest ) => {

    const gj_start = geoJsonFromArr(start);
    const gj_dest = geoJsonFromArr(dest);

    const pathfinder = new PathFinder(geojson, { 
        precision: 1e-3,
        weightFn: function(a, b, props) {
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            return Math.sqrt(dx * dx + dy * dy) + props.typeWeight;
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
        "distance": (Math.round(path.weight * 100) / 100).toFixed(2)
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
