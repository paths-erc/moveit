import * as fs from 'fs';
import typeWeight from './typeWeights.js';

const rawdata = fs.readFileSync('./src/geojson/arcs.geojson');

const geojson = JSON.parse(rawdata);

geojson.features.forEach( (f, i) => {
  geojson.features[i].properties = {
    "fid": geojson.features[i].properties.fid,
    "typeWeight": typeWeight[geojson.features[i].properties.type] || 1
  };
});

fs.writeFileSync('src/geojson/arcs.json', JSON.stringify(geojson));

export default geojson;