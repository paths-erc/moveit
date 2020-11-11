const runTest = () => {


  fetch('https://db.bradypus.net/api/v2/paths?verb=search&pretty=1&geojson=1&shortsql=@places~[id,name,geodata.geometry~%2Bgeodata||places.id|=|^paths__geodata.id_link||and|geodata.table_link|=|paths__places~-0:500~>name:asc')
    .then(resp => resp.json())
    .then(d => {

      let all = [];

      d.features.forEach(item => {
        all.push({
          "id": item.properties.id,
          "name": item.properties.name,
          "coord": item.geometry.coordinates
        });
      });
    
      all.forEach(e => {
        all.forEach(eb => {
          if ( e.id !== eb.id ) {
            const path = calcPath(e.coord, eb.coord);
            if (!path){
              console.log(`Cannot calculate path from ${e.id}: ${e.name} to ${eb.id}: ${eb.name}`);
            } else {
              console.log(`OK`);
            }
          }
        });
      });
  });
};


runTest();