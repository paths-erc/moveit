const L = require('leaflet');
const calcPath = require('./calcPath');

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
            <a href="#" class="from" data-coords="${feature.geometry.coordinates.join(' ')}">Directions from here</a>
            |
            <a href="#" class="to" data-coords="${feature.geometry.coordinates.join(' ')}">Directions to here</a>
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
        from.options[from.options.length] = new Option(e.properties.name, e.geometry.coordinates.join(' '), false, (e.properties.name === data.fromPlace))
        to.options[to.options.length] = new Option(e.properties.name, e.geometry.coordinates.join(' '), false, (e.properties.name === data.toPlace))
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

const hashToCoords = () => {
    let hashUrl = window.location.hash;

    if (hashUrl === ''){
        return false;
    }
    hashUrl = hashUrl.substring(1);

    const parts = hashUrl.split('/');

    return {
        fromPlace : decodeURIComponent(parts[0]),
        toPlace   : decodeURIComponent(parts[1]),
        fromCoord : parts[2].split(','),
        toCoord   : parts[3].split(','),
    };
}


const calcAndShow = (fromCoord, toCoord) => {
    const path = calcPath(fromCoord, toCoord);
    if (!path){
        alert(`Cannot calculate path from ${from.options[from.selectedIndex].text} to ${to.options[to.selectedIndex].text}`);
        return;
    }

    if (typeof geoJsonLayer !== 'undefined'){
        map.removeLayer(geoJsonLayer);
    }

    geoJsonLayer = L.geoJSON(path).addTo(map);
    map.fitBounds(geoJsonLayer.getBounds());
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
    
        coordsToHash(from.options[from.selectedIndex].text, to.options[to.selectedIndex].text, fromCoord, toCoord);
    
        calcAndShow(fromCoord, toCoord);
    }
});

const data = hashToCoords();

if ( data && data.fromCoord && data.toCoord ){
    calcAndShow(data.fromCoord, data.toCoord);
}
