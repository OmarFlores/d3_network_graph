/*
Declare as a global variable graph plot(s).
*/
var graphJS;

Shiny.addCustomMessageHandler("jsonlist", function(message){
  
  Array.prototype.sortBy = function (propertyName, sortDirection) {

    var sortArguments = arguments;
    this.sort(function (objA, objB) {

        var result = 0;
        for (var argIndex = 0; argIndex < sortArguments.length && result === 0; argIndex += 2) {

            var propertyName = sortArguments[argIndex];
            result = (objA[propertyName] < objB[propertyName]) ? -1 : (objA[propertyName] > objB[propertyName]) ? 1 : 0;

            //Reverse if sort order is false (DESC)
            result *= !sortArguments[argIndex + 1] ? 1 : -1;
        }
        return result;
    });
  }
  
  var nodes_unfiltred = message.map(function(row) {
    return {"id":row.Source,"group":1};
  }).concat(message.map(function(row) {
    return {"id":row.Target,"group":1};
  }));
  
  var unique_nodes = uniqBy(nodes_unfiltred,JSON.stringify);
  var data = {};

  data.nodes = unique_nodes;
  data.links = message.map(function(row){
    return {"source":row.Source, "target": row.Target, "value": 1};
  });

  data.links.sortBy("source",true,"target",true);
  
  var queue = new SenderQueue();
  var callback = function(d) {
                    queue.send("d3Graph-jsvalue", d.id);
                    d3.select(this).attr("fill","red");
              };
  
  graphJS = d3.graph('svgD3Graph');
  graphJS.resizeSVG(dimension);
  graphJS.clear();
  graphJS.initialize(data);
  graphJS.radius(8);
  graphJS.arrowSize(10);
  graphJS.highlightLinkColor("#77017F");
  graphJS.arrowColor("#000000");
  graphJS.nodeColor("#C2A400");
  //graphJS.nodeClickCallBack(callback);
  graphJS.render();
  graphJS.enableZoom(true);
  graphJS.enableZoomByClick(true);
  
  
  function uniqBy(a, key) {
      var seen = {};
      return a.filter(function(item) {
          var k = key(item);
          return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      });
  }
});

/*
Callback to find a node selected from selectInput controller and zoom in to it.
*/
Shiny.addCustomMessageHandler("findnode", function(message){
  if(message !== "" && message !== " " && message !== null)
    graphJS.zoomNodeById(message);
});

/*
Callback to reset zoom of the graph.
*/
Shiny.addCustomMessageHandler("resetGraph", function(message){
  graphJS.restoreZoom();
});

/*
Callback to stop simulation of the graph.
*/
Shiny.addCustomMessageHandler("stopGraphSim", function(message){
  graphJS.stopSimulation();
});

/*
Callback to restart simulation of the graph.
*/
Shiny.addCustomMessageHandler("startGraphSim", function(message){
  graphJS.startSimulation();
});

  function SenderQueue() {
    this.readyToSend = true;
    this.queue = [];
    this.timer = null;
  }

  SenderQueue.prototype.send = function(name, value) {
    var self = this;
    function go() {
      self.timer = null;
      if (self.queue.length) {
        var msg = self.queue.shift();
        Shiny.onInputChange(msg.name, msg.value);
        self.timer = setTimeout(go, 0);
      } else {
        self.readyToSend = true;
      }
    }
    if (this.readyToSend) {
      this.readyToSend = false;
      Shiny.onInputChange(name, value);
      this.timer = setTimeout(go, 0);
    } else {
      this.queue.push({name: name, value: value});
      if (!this.timer) {
        this.timer = setTimeout(go, 0);
      }
    }
  };