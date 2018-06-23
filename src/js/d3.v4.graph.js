//Implementation of d3.v4.min.js library to create a graph
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.graph = global.graph || {})));
}(this, (function (exports) { 
  'use strict';

var version = "1.0.0";
var queue = new SenderQueue();

var createGraph = function(selector) {
  return typeof selector === "string"
      ? new Graph3D(selector)
      : new Graph3D(selector);
};

function select_svg_conatiner(svg_id,width,height){
  var svg = d3.select(document.getElementById(svg_id)), 
  svg_width =  (width) ? width : +svg.attr("width"),
  svg_height =  (height) ? height : +svg.attr("height");
  return svg.attr('width',svg_width).attr('height',svg_height);
}

function Graph3D(svg_id,width,height){
  this._= select_svg_conatiner(svg_id,width,height);
}

function graphD3() {
  return new Graph3D('svgDivB');
}

var createContainer = function(svg_id,width,height){
  return new Graph3D(svg_id,width,height);
};

var clear_svg = function(){
  //p.exit().remove();
  this._.text(" ");
  this._.exit().remove();
};

var renderGraph = function(data) {};

var render = function(data) {
var svg = this._,
    width = +svg.attr("width"),
    height = +svg.attr("height");

var g = svg.append("g")
    .attr("class", "graph_class"+ (Math.floor(Math.random() * 100)) );

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(60).strength(0.3))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var nodes = data.nodes,
      nodeById = d3.map(nodes, function(d) { return d.id; }),
      links = data.links,
      bilinks = [];

  links.forEach(function(link) {
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  var link = g.append("g")
      .attr("class", "links")
      .selectAll(".link")
      .data(bilinks)
      .enter().append("path")
      .attr("class", "link");

  var node = g.append("g")
              .attr("class", "nodes") 
              .selectAll(".node")
              .data(nodes.filter(function(d) { return d.id; }))
              .enter()
              .append("circle")
              .attr("class", "node")
              .attr("r", 6)
              .attr("fill", function(d) { return color(d.group); })
              .on("click", function(d) {
                    d3.select(this).attr("fill","red");
                    queue.send("d3Graph-jsvalue", d.id);
              })
              .call(d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));

      node.append("title")
          .text(function(d) { return d.id; });

  simulation
      .nodes(nodes)
      .on("tick", function(){ link.attr("d", positionLink); node.attr("transform", positionNode); });

  simulation.force("link")
            .links(links);
  
  //add zoom capabilities 
    var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);
    zoom_handler(svg);
    
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x, d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x, d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null, d.fy = null;
    }
    
    function ticked() {
      link.attr("d", positionLink);
      node.attr("transform", positionNode);
    }
    
    function zoom_actions(){
    g.attr("transform", d3.event.transform)
    }
    
    var positionLink = function(d) {
      return "M" + d[0].x + "," + d[0].y
           + "S" + d[1].x + "," + d[1].y
           + " " + d[2].x + "," + d[2].y;
    };

    var positionNode = function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    };
};

function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}

Graph3D.prototype = graphD3.prototype = {
  constructor: Graph3D,
  createContainer : createContainer,
  render: render,
  clear: clear_svg
};

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


exports.version = version;
exports.createGraph = createGraph;
exports.render = render;
exports.createContainer = createContainer;
exports.clear = clear_svg;
exports.graphD3 = graphD3;

Object.defineProperty(exports, '__esModule', { value: true });

})));