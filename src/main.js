const L = require('leaflet');
const geojson  = require('./geojson/arcs.json');
const calcPath = require('./calcPath');
const hashToCoords = require('./hashToCoords');

const hashData = hashToCoords();



var map = L.map('map').setView([30.0594885,31.2584644], 8);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);
L.tileLayer('https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png').addTo(map);

const from = document.getElementById('from');
const to = document.getElementById('to');
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

const coordsToHash = function (fromPlace, toPlace, fromCoord, toCoord){
    window.location.hash = `${encodeURIComponent(fromPlace)}/${encodeURIComponent(toPlace)}/${fromCoord.join(',')}/${toCoord.join(',')}`;
}

const directions = (fromTo, coords) => {
    document.querySelector(`#${fromTo} [value="${coords}"]`).selected = true;
    return false;
}

const calcAndShow = (fromCoord, toCoord, fromLabel, toLabel) => {
    try {
        const path = calcPath(geojson, fromCoord, toCoord);
        if (typeof geoJsonLayer !== 'undefined'){
            map.removeLayer(geoJsonLayer);
        }
        geoJsonLayer = L.geoJSON(path.geojson).addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
        geoJsonLayer.bindPopup(`Distance from <strong>${fromLabel}</strong> to <strong>${toLabel}</strong>: <strong>${path.distance}</strong> km`).openPopup();
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
    
        coordsToHash(fromLabel, toLabel, fromCoord, toCoord);
    
        calcAndShow(fromCoord, toCoord, fromLabel, toLabel);
    }
});


if ( hashData && hashData.fromCoord && hashData.toCoord ){
    calcAndShow(hashData.fromCoord, hashData.toCoord, hashData.fromLabel, hashData.toLabel);
}
