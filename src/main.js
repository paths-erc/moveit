const L = require('leaflet');
const geojson  = require('./geojson/arcs.json');
const calcPath = require('./calcPath');
const hashToCoords = require('./hashToCoords');

const hashData = hashToCoords();


var map = L.map('map')
  .setView([30.0594885,31.2584644], 8);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);
L.tileLayer(`https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png`)
  .addTo(map);

  L.Control.Panel = L.Control.extend({
    position: 'topleft',
    onAdd: function(map) {
      const div = L.DomUtil.create('div');
      div.innerHTML = `<img src="./img/moveit.svg" alt="MOvEIT" class="py-3 ">
      <p class="text-center">A road network for Late Antique Egypt.<br>
      Built with ♡ by <a href="http:purl.org/lad" title="Laboratorio di Archeologia Digitale alla Sapienza">LAD</a> for <a href="https://atlas.paths-erc.eu" title="PAThs. Archaeological Atlas of Coptic Literature">PAThs</a></p>
      
      <div class="form-group">
        <div class="input-group">
          <span class="input-group-text">From</span>
          <select class="form-control" id="from"></select>
        </div>
      </div>
      
      <div class="form-group my-3">
        <div class="input-group">
          <span class="input-group-text">To&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <select class="form-control" id="to"></select>
        </div>
      </div>

      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="considerTypeWeight" checked>
        <label class="form-check-label" for="considerTypeWeight">
          Consider route type
        </label>
      </div>
      
      <div class="d-grid">
        <button class="btn btn-success btn-block calculate">Calculate</button>
      </div>
      
      <hr>
      <p class="text-center">Source code, documentation and detailed information 
      are available on <a href="https://github.com/paths-erc/moveit">GitHub</a>
      <hr>
      <a href="http://purl.org/lad" title="LAD: Laboratorio di Archeologia Digitale alla Sapienza">
        <img src="./img/lad-blue.png" alt="LAD: Laboratorio di Archeologia Digitale alla Sapienza" class="px-5">
      </a>
      `;

      div.style['max-width'] = '350px';
      div.style['background'] = '#ffffff';
      div.classList.add('p-3');
      div.classList.add('border');

      return div;
    }
});

map.zoomControl.setPosition('topright');
new L.Control.Panel({ position: 'topleft' }).addTo(map);



const from = document.getElementById('from');
const to = document.getElementById('to');
const considerTypeWeightElement = document.getElementById('considerTypeWeight');

const shortSQL = `https://bdus.cloud/db/api/paths?verb=search&&geojson=1&shortsql=${
[
  '@places',
  '[id,name,geodata.geometry',
  '-500:0',
  '>name:asc'
].join('~')}`;


fetch(shortSQL).then(resp => resp.json()).then(d => {
  L.geoJSON(d, {
    onEachFeature: (feature, layer) => {
      if (feature.properties && feature.properties.name) {
        layer.bindPopup(`<div class="text-center">
        <strong>${feature.properties.name}</strong>
        <hr>
        <a href="https://atlas.paths-erc.eu/places/${feature.properties.id}" target="_blank"><big>paths.place.${feature.properties.id}</big></a>
        <hr>
        <a href="javascript:void(0)" class="from" data-coords="${feature.geometry.coordinates.join(' ')}">Directions from here</a>
        |
        <a href="javascript:void(0)" class="to" data-coords="${feature.geometry.coordinates.join(' ')}">Directions to here</a>
        |
        <a href="javascript:void(0)" class="calculate" data-coords="${feature.geometry.coordinates.join(' ')}">Calculate</a>
        </div>
        `);
      }
    },
    pointToLayer: (t, i, col) => {
      return new L.CircleMarker(i, {
        radius: 5,
        weight: 1,
        color: '#0000ff'
      })
    }
  }).addTo(map)
  
  d.features.map( e => {
    from.options[from.options.length] = new Option(e.properties.name, e.geometry.coordinates.join(' '), false, (e.properties.name === hashData.fromLabel))
    to.options[to.options.length] = new Option(e.properties.name, e.geometry.coordinates.join(' '), false, (e.properties.name === hashData.toLabel))
  });
});

let geoJsonLayer;

const coordsToHash = function (fromPlace, toPlace, fromCoord, toCoord, considerType){
  window.location.hash = `${encodeURIComponent(fromPlace)}/${encodeURIComponent(toPlace)}/${fromCoord.join(',')}/${toCoord.join(',')}/${considerType ? 'considerType' : ''}`;
}

const directions = (fromTo, coords) => {
  document.querySelector(`#${fromTo} [value="${coords}"]`).selected = true;
  return false;
}

const calcAndShow = (fromCoord, toCoord, fromLabel, toLabel, considerType) => {
  try {
    const path = calcPath(geojson, fromCoord, toCoord, considerType);
    if (typeof geoJsonLayer !== 'undefined'){
      map.removeLayer(geoJsonLayer);
    }
    geoJsonLayer = L.geoJSON(path.geojson, {
      style: {
        color: "#f7801e",
        weight: 5,
        opacity: 0.7
      }
    }).addTo(map);
    map.fitBounds(geoJsonLayer.getBounds());
    geoJsonLayer.bindPopup(`Path from <strong>${fromLabel}</strong> to <strong>${toLabel}</strong>: <strong>${path.distance}</strong> km`).openPopup();
  } catch (error) {
    alert(`Cannot calculate path from ${fromCoord} to ${toCoord}`);
    return;
  }
};

// Event listeners
document.addEventListener('click', (e) => {
  const el = e.target;
  const coords = el.dataset.coords;
  if (el.classList.contains('from') && coords){
    directions('from', coords);
  } else if (el.classList.contains('to') && coords){
    directions('to', coords);
  } else if (el.classList.contains('calculate')){
    if (from.value === to.value){
      alert('From e To can not be the same place!');
      return;
    }
    const fromCoord = from.value.split(' ');
    const toCoord = to.value.split(' ');
    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = from.options[to.selectedIndex].text;
    
    coordsToHash(fromLabel, toLabel, fromCoord, toCoord, considerTypeWeightElement.checked);
    calcAndShow(fromCoord, toCoord, fromLabel, toLabel, considerTypeWeightElement.checked);
  }
});


if ( 
  hashData && 
  hashData.fromCoord && 
  hashData.toCoord 
  ){
    calcAndShow(hashData.fromCoord, hashData.toCoord, hashData.fromLabel, hashData.toLabel, hashData.considerType);
  }
  