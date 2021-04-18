const fs = require('fs');

const rawdata       = fs.readFileSync('./src/geojson/arcs.geojson');

const geojson = JSON.parse(rawdata);

geojson.features.forEach( (f, i) => {
    geojson.features[i].properties = {
        "fid": geojson.features[i].properties.fid
    };
});

fs.writeFileSync('src/geojson/arcs.json', JSON.stringify(geojson));

module.exports = geojson;