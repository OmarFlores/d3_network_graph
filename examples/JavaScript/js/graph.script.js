var json_data = {
  "nodes": [
    {"id": "A"},
    {"id": "B"},
    {"id": "C"},
    {"id": "D"},
    {"id": "E"},
    {"id": "F"},
    {"id": "G"}
  ],
  "links": [
    {"source": "A", "target": "B"},
    {"source": "A", "target": "C"},
    {"source": "A", "target": "E"},
    {"source": "A", "target": "F"},
    {"source": "B", "target": "A"},
    {"source": "C", "target": "G"},
    {"source": "D", "target": "G"},
    {"source": "G", "target": "E"},
    {"source": "G", "target": "C"}
  ]
}


var graphJS;
graphJS = d3.graph('svgD3Graph');
//graphJS.resizeSVG(dimension);
graphJS.clear();
graphJS.initialize(json_data);
graphJS.radius(8);
graphJS.arrowSize(10);
graphJS.highlightLinkColor("#77017F");
graphJS.arrowColor("#000000");
graphJS.nodeColor("#C2A400");
//graphJS.nodeClickCallBack(callback);
graphJS.render();
graphJS.enableZoom(true);
graphJS.enableZoomByClick(true);
