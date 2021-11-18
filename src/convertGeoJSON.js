const fs = require('fs');

const rawdata = fs.readFileSync('./src/geojson/arcs.geojson');

const geojson = JSON.parse(rawdata);

const typeWeights = {
  'coast': 0,
  'channel': 1,
  'river': 1,
  'sea': 1,
  'desert': 2
};

geojson.features.forEach( (f, i) => {
  geojson.features[i].properties = {
    "fid": geojson.features[i].properties.fid,
    "typeWeight": typeWeights[geojson.features[i].properties.type] || 0
  };
});

fs.writeFileSync('src/geojson/arcs.json', JSON.stringify(geojson));

module.exports = geojson;