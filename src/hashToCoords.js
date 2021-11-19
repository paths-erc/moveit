const hashToCoords = () => {
    let hashUrl = window.location.hash;

    if (hashUrl === ''){
        return false;
    }
    hashUrl = hashUrl.substring(1);

    const parts = hashUrl.split('/');

    return {
        fromLabel : decodeURIComponent(parts[0]),
        toLabel   : decodeURIComponent(parts[1]),
        fromCoord : parts[2].split(','),
        toCoord   : parts[3].split(','),
        considerType:decodeURIComponent(parts[4]) === 'considerType',
    };
}
module.exports = hashToCoords;