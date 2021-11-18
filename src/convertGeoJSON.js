const fs = require('fs');

const rawdata = fs.readFileSync('./src/geojson/arcs.geojson');

const geojson = JSON.parse(rawdata);

const typeWeights = {
  'coast': 1,
  'channel': 1.5,
  'river': 1.5,
  'sea': 1.5,
  'desert': 2
};

geojson.features.forEach( (f, i) => {
  geojson.features[i].properties = {
    "fid": geojson.features[i].properties.fid,
    "typeWeight": typeWeights[geojson.features[i].properties.type] || 1
  };
});

fs.writeFileSync('src/geojson/arcs.json', JSON.stringify(geojson));

module.exports = geojson;