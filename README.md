# MO(v)EIT
A road network for Late Antique Egypt by PAThs

MO(v)EIT is an open-access, collaborative road network that links the archaeological sites published in the [Archaeological Atlas of Coptic Literature](https://atlas.paths-erc.eu) by [PAThs](http://paths.uniroma1.it).

Since the Atlas is being updated continually, so is this graph; therefore frequent changes in the next months/years might occur, as new sites are added to the Atlas.

Changes are triggered also by the adding of new connecetions between already known sites, due to advancement in studies or deeper analysis of the available sources. This document will try to keep record of these changes.

## How does it work
The application calculates the cost of movement from one site (i.e. node of the graph) to the another. The cost is calucated in terms of distance, i.e. the longer is the distance to cover, the higher is the cost of the movement. A second element is added to thei calculation, based on the type of the road. A first proposal to differently weight paths assumes the following values for additional cost multiplier:
- coastal roads and internal valley roads: 1
- channel, rivers and sea routes: 1.5
- desert paths: 2

## Graphically view and calculate paths
The road graph is available as a [Single-page application](https://en.wikipedia.org/wiki/Single-page_application) built using open-source libraries, such as:
- [Leaflet.js](https://leafletjs.com/) as a Web mapping library,
- [GeoJSON Path Finder](https://www.liedman.net/geojson-path-finder/) as a tool for routing/path finding using GeoJSON as input.

The selection of starting and destination point for route calculations can be perfomed from drop-down menus or directly from the map, by clicking on each available point. The calculated path will be drawn on the map and a pop-up will also display information on the overall calculated distance.

## Test the graph
To test the graph (and you should test if after each update and before each deploying) a specific piece of software has been built is available. You need to have available in your system in advance [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/).

To setup the environment follow these few steps, using a shell:
- Clone the repository (if not already available in your local filesystem):  
`git clone https://github.com/paths-erc/moveit.git`
- Change directory to the newly downloaded folder:      
`cd moveit`
- Download ad install Node.js dependencies:  
`npm install`
- Run the test:  
`npm test`

The test will, recursively, try to calculate paths from each available node (i.e. site, the list of the sites will be downloaded from PAThs central database) to each other available node and this procedure might take **quite a long time** (manu hours). Errors will be printed in real time and also after the procedure finishes.

## Enhance the graph
The road graph is available in this repository as a GeoJSON file ([src/geojson/arcs.geojson](src/geojson/arcs.geojson)). It can be easily edited on a GIS software, such as [QGIS](https://www.qgis.org/) or on a web service such as [https://geojson.io/](https://geojson.io/). Arcs (connections between nodes) must be encoded as polylines and a snapping tool is indispensable to precisely link polylines with nodes (sites).

Once the editing proccess has come to an end, the updated file must be saved at the same location, i.e. src/geojson/arcs.geojson.

Before pubblication, testing the newly created graph is strongly encouraged (se above). 

Finally, data are ready to be built and deployed. A local preview of the application can be run locally by typing: `npm run serve` and the final build can be run by typing `npm run pack`. `node_modules` and `src` folders are necessary only for development and you do not need to upload them on the production server.

## Structure of the graph
Each connection between two points of the graph – i.e. each arc – is represented by a polyline. Each feature is associated by the following information:
- `name`: name of the road or of the channel, if known
- `source`: source of the information, it might be *PAThs*, *DARE* or *Satellite*
- `operator`: name of the person who digitized the feature
- `date`: digitization date
- `type`: type of the feature. It might be a *channel*, a *coast* road, a *desert* path, a *river* connection, a *sea* connection or *null*.


## Future development
Other elements can be added to the calculation of the cost, such as the slope analysis and the presence of objective difficulties in the itinerary, such as water streams. These ‘penalities’ might be weighted as positive costs, while the presence of bridges might be considered as a negative cost. Obstacles and facilities might be added by a variety of sources, such as historical carthografy or literary and archaeological sources.

Finally, some development will be done in the next weeks towards a higher degree of abstraction of the entire application, making it possible to use it with another road-graph. Some work is being done in documenting the graph production steps, in order to facilitate the resuse of this code for other contextes.
