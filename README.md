# MO(v)EIT
A road network for Late Antique Egypt by PAThs

MO(v)EIT is an open-access, collaborative road networks that links the archaeological sites published in the [Archaeological Atlas of Coptic Literature](https://atlas.paths-erc.eu) by [PAThs](http://paths.uniroma1.it).

Since the Atlas is being updated continually, so is this graph; therefore frequent changes in the next months/years might occur, as new sites are added to the Atlas.

Changes are triggered also by the adding of new connecetions between already known sites, due to advancement in studies or deeper analysis of the available sources. This document will try to keep record of these changes.

## How does it work
The application calculates the cost of movement from one site (node) to the another. The cost is calucated in terms of distance, i.e. the longer is the distance to cover, the higher is the cost of the movement. A second element is added to the calculation of the cost, i.e. the type of the road. A first proposal to differently weight paths assumes the following values for additional cost:
- coastal roads and internal valley roads: 0
- channel, rivers and sea routes: 1
- desert paths: 2

## Graphically view and calculate paths
The road graph is available as a [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) built using open-source libraries, such as:
- [Leaflet.js](https://leafletjs.com/) as a Web mapping library,
- [GeoJSON Path Finder](https://www.liedman.net/geojson-path-finder/) as a tool for routing/path finding using GeoJSON as input.

Selection of tarting and destination point for route calculations can be perfomed from drop-down menus or dutectly from the map, by clicking on each available point. The calculated path will be drawn on the map anc a pop-up will also display information on the overall calculated distance.

## Programmatically calculate paths

## Test the graph
To test the graph, and you should test if after each update and before deploying, a specific test is available. You need to set up a development environment, based on [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/), that must be available.

To setup the environment follow these few steps, using a shell: 
- Clone the repository (if not already available in your local filesystem):  
`git clone https://github.com/paths-erc/moveit.git`
- Change directory to the newly downloaded folder:      
`cd moveit`
- Download node dependencies:  
`npm install`
- Run the test:  
`npm test`

The test will, recursively, try to calculate paths from each available site (the list of the sites will be downloaded from PAThs central database) to each available site and this procedure might take **quite a long time**. Errors will be printed in real time and also after the procedure finishes.

## Enhance the graph
The road graph is available in this repository as a GeoJSON file ([src/geojson/arcs.geojson](src/geojson/arcs.geojson)). It can be easily edited on a GIS software, such as [QGIS](https://www.qgis.org/) or on a web service such as [https://geojson.io/](https://geojson.io/). Arcs (connections between points) must be encoded as polylines and a snapping tool is indispensable to precisely link polylines with point (sites).

After the editing proccess has come to an end, the updated file must be placed at the same location, i.e. src/geojson/arcs.geojson.

Before pubblication, testing the newly created graph is strongly encouraged. The test can be easily run on the shell by typing: `npm run test`. It can take quite a long time (many hours) to test possible connections between hundreds of places.

Finally, data are ready to be built and deployed. A local preview of the application can be run locally by typing: `npm run serve` and the final build can be run by typing `npm run pack`.

## Structure of the graph
Each connection between two points of the graph – i.e. each arc – is represented by a polyline. Each feature is associated by the following information:
- `name`: name of the road or of the channel, if known
- `source`: source of the information, it might be PAThs, DARE or Satellite
- `operator`: name of the person who digitized the feature
- `date`: digitization date
- `type`: type of the feature. It might be a *channel*, a *coast* road, a *desert* path, a *river* connection, a *sea* connection or *null*.


## Future development
At present, only the linear distance is used to calculate the cost of each path, while other elements such as the slope or the general physical conditions of the paths are also extremely important. For this reason a future planned enhancement is the consideration of at least the typology of each path (see attribute `type` above) in the calculation of the cost. Finally, DEM derived information can be used as well to better differentiate different paths
