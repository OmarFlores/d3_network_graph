var graphJS;

//Handler function which catch the message from Shiny R trigger function and draw the d3_network_graph
Shiny.addCustomMessageHandler("drawGraph", function(message){
  var json_object = JSON.parse(message);
  
  if(json_object !== null){
    graphJS = d3.graph('svgD3Graph');
    //graphJS.resizeSVG(dimension);
    graphJS.clear();
    graphJS.initialize(json_object);
    graphJS.radius(8);
    graphJS.arrowSize(10);
    graphJS.highlightLinkColor("#77017F");
    graphJS.arrowColor("#000000");
    graphJS.nodeColor("#C2A400");
    //graphJS.nodeClickCallBack(callback);
    graphJS.render();
    graphJS.enableZoom(true);
    graphJS.enableZoomByClick(true);
  }
  
});




