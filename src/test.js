const fetch = require('node-fetch');
const calcPath = require('./calcPath');
const geojson    = require('./geojson/arcs.json');

const loading = () => {
  var h = ['|', '/', '-', '\\'];
  var i = 0;

  return setInterval(() => {
    i = (i > 3) ? 0 : i;
    console.clear();
    console.log(`Checking... ${h[i]}`);
    i++;
  }, 300);
};


const runTest = async () => {

  const api_url = 'https://db.bradypus.net/api/paths?'
   + 'verb=search'
   + '&pretty=1'
   + '&geojson=1'
   + '&shortsql='
    + '@places~[id,name,geodata.geometry~-500:0~>name:asc'
  ;


  const response = await fetch(api_url);
  const data = await response.json();

  const all = data.features.map( item => {
    return {
      "id": item.properties.id,
      "name": item.properties.name, 
      "coord": item.geometry.coordinates
    }
  });

  const loading_instace = loading();

  const error_list = [];
  

  all.forEach(e => {
    all.forEach(eb => {
      if ( e.id !== eb.id ) {
        try {
          calcPath(geojson, e.coord, eb.coord);
          // console.log(`OK: path from ${e.name} to ${eb.name} calculated`);
          
        } catch (error) {
          console.log(`Error: cannot calculate path from ${e.id}: ${e.name} to ${eb.id}: ${eb.name}`);
          error_list.push(
            [`${e.id} (${e.name})`, `${eb.id} (${eb.name})`]
          );          
        }
      }
    });
  });

  clearInterval(loading_instace);

  console.log(`\n---\nError calculating routes: ${error_list.map( e => `from ${e[0]} to ${e[1]}\n`)}`);

};


runTest();