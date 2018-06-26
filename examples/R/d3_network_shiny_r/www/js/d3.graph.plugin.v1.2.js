(function() {
  
  /*
    Global definition for d3 graph plot.
    */
  d3.graph = function (svgTagName) {
    
    /*
    Global variables which defines SVG tag name, width and height of the main container
    */
    var svg = d3.select(document.getElementById(svgTagName)).append("svg:svg"),
        width = +d3.select(document.getElementById(svgTagName)).attr("width"),
        height = +d3.select(document.getElementById(svgTagName)).attr("height"),
        linkColor,
        highlightLinkColor,
        nodeColor,
        arrowColor,
        graph = {},
        nodes = [],
        links = [],
        nodeById = [],
        bilinks = [],
        distance,
        radius,
        nodeClickCallBack,
        arrowSize,
        simulation,
        zoom_handler,
        centered,
        isSimulationStopped;
    
    /*
    Definition of global constants
    */
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const graphClassName =  "graph_class"+ (Math.floor(Math.random() * 100));
    
    /*
    Getters and Setters for Global Variables.
    */
    
    graph.centered = function(x) {
      if (!arguments.length) return centered;
      centered = x;
      return this;
    };
    
    graph.zoom_handler = function(x) {
      if (!arguments.length) return zoom_handler;
      zoom_handler = x;
      return this;
    };
    
    graph.simulation = function(x) {
      if (!arguments.length) return simulation;
      simulation = x;
      return this;
    };
    
    graph.nodeClickCallBack = function(x) {
      if (!arguments.length) return nodeClickCallBack;
      nodeClickCallBack = x;
      graph.svg().select("g").selectAll(".node").on("click",nodeClickCallBack);
      return this;
    };
    
    graph.arrowColor = function(x) {
      if (!arguments.length) return arrowColor;
      arrowColor = x;
      return this;
    };
    
    graph.nodeColor = function(x) {
      if (!arguments.length) return nodeColor;
      nodeColor = x;
      return this;
    };
    
    graph.highlightLinkColor = function(x) {
      if (!arguments.length) return highlightLinkColor;
      highlightLinkColor = x;
      return this;
    };
    
    graph.linkColor = function(x) {
      if (!arguments.length) return linkColor;
      linkColor = x;
      return this;
    };
    
    graph.nodeById = function(x) {
      if (!arguments.length) return nodeById;
      nodeById = x;
      return this;
    };
    
    graph.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return this;
    };

    graph.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return this;
    };
    
    graph.arrowSize = function(x) {
      if (!arguments.length) return arrowSize;
      arrowSize = x;
      return this;
    };
    
    graph.distance = function(x) {
      if (!arguments.length) return distance;
      distance = x;
      return this;
    };
    
    graph.radius = function(x) {
      if (!arguments.length) return radius;
      radius = x;
      return this;
    };
    
    graph.width = function(x) {
      if (!arguments.length) return width;
      width = x;
      return this;
    };
    
    graph.height = function(x) {
      if (!arguments.length) return height;
      height = x;
      return this;
    };
    
    graph.svg = function(x) {
      if (!arguments.length) return svg;
      svg = d3.select(document.getElementById(x)).append("svg:svg");
      return this;
    };
    
    graph.resizeSVG = function(x) {
      if (!arguments.length) return null;
      d3.select(document.getElementById(svgTagName)).attr("width",x[0]);
      d3.select(document.getElementById(svgTagName)).attr("height",x[1]);
      graph.width(x[0]);
      graph.height(x[1]);
      return this;
    };
    
    graph.isSimulationStopped = function(x) {
      if (!arguments.length) return isSimulationStopped;
      isSimulationStopped = x;
      return this;
    };
    
    graph.enableZoomByClick = function(b){
      if(b) d3.select(document.getElementById(svgTagName)).select("g").selectAll(".node").on("click",clicked);
      return this;
    }
    
    /*
    Function which initialize main variables of the graph.
    jsonObject -> JSON structure with nodes and links
    */
    graph.initialize = function(jsonObject) {
      
      var nodes_renamed = jsonObject.nodes.map(function(d){ return { id: svgTagName+"_"+d.id , group:d.group} });
      var links_renamed = jsonObject.links.map(function(d){ return {"source":svgTagName+"_"+d.source, "target": svgTagName+"_"+d.target, "value": 1}; });
      graph.nodes(nodes_renamed);
      graph.links(links_renamed);
      graph.nodeById(d3.map(nodes_renamed, function(d) { return d.id; }));
      graph.distance(100);
      graph.radius(8);
      graph.arrowSize(10);
      graph.nodeColor(color(1));
      graph.highlightLinkColor("#EB9A00");
      graph.arrowColor("#888");
      graph.isSimulationStopped(false);
      return this;
    };
    
    /*
    Function that enables zoom in the plot.
    Zoom is disable by default.
    */
    graph.enableZoom = function(flag){
      
      if(flag && flag !== false){
        
        var svgObject = d3.select(document.getElementById(svgTagName));
        
        var zoom = d3.zoom().scaleExtent([0.3, 8]).on('zoom', function() {
          //return svgObject.select("g").attr("transform", d3.event.transform);
          return graph.svg().select("g").attr("transform", d3.event.transform);
        });
        
        graph.zoom_handler(zoom);
        
        /*
        graph.svg().call(graph.zoom_handler());
        graph.svg().style("cursor","move");*/
        
        //svgObject.call(graph.zoom_handler());
        //graph.zoom_handler()(svgObject);
        svgObject.transition().delay(10);
        svgObject.call(graph.zoom_handler());
        svgObject.style("cursor","move");
        graph.restoreZoom();
      }
      return this;
    };
    
    function zoom_actions(){
        var svgObject = d3.select(document.getElementById(svgTagName));
        var g = svgObject.select("g");
        var translateX = d3.event.transform.x;
        var translateY = d3.event.transform.y;
        var scale = d3.event.transform.k;
        g.attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
      }
    
    /*
    Function which clears main graph_class container that renders graph plot
    */
    graph.clear = function(){
      d3.select(document.getElementById(svgTagName)).selectAll("svg").remove();
      graph.svg(svgTagName);
      
    };
    
    
    graph.zoomNodeById = function(nodeId){
      var center, transform, nH, nW, x, y, k;
      var svgObject = d3.select(document.getElementById(svgTagName));
      
      var nodeObject =  graph.nodes().find(function(n){
        var nodeIDwithsvgTag = svgTagName+"_"+nodeId;
          if(nodeIDwithsvgTag === n.id)
            return n;
      });
      
      center = { 
        x: nodeObject.x + nodeObject.vx / 2,
        y: nodeObject.y + nodeObject.vy / 2
      };
      
      x = nodeObject.x;
      y = nodeObject.y;
      nW = nodeObject.vx;
      nH = nodeObject.vy;
      k = 4;
      
      graph.centered(nodeObject);
        
      transform = to_bounding_box(width, height, center, nW, nH,  k);
      //return graph.svg().select("g").transition().duration(750).call(graph.zoom_handler().transform, transform);
      //return  svgObject.select("g").transition().duration(750).call(graph.zoom_handler().transform, transform);
      return d3.select(document.getElementById(svgTagName)).transition().duration(750).call(
          graph.zoom_handler().transform, transform);
      };
      
      graph.stopSimulation = function(){
          graph.simulation().stop();
          graph.isSimulationStopped(true);
      };
      
      graph.startSimulation = function(){
        graph.isSimulationStopped(false);
        graph.simulation().alphaTarget(0.3).restart();
      };
      
      graph.restoreZoom = function(){
        d3.select(document.getElementById(svgTagName)).transition().duration(750).call(
          graph.zoom_handler().transform, d3.zoomIdentity);
      };
      
      function to_bounding_box(W, H, center, w, h, margin) {
        var k, kh, kw, x, y;
            k = margin;
            x = W / 2 - center.x * k;
            y = H / 2 - center.y * k;
          return d3.zoomIdentity.translate(x, y).scale(k);
      }
      
      function clicked(d) {
        
        var center, transform, nH, nW, x, y, k;
        var svgObject = d3.select(document.getElementById(svgTagName));
        
        if (d && graph.centered() !== d){
          center = {
            x: d.x + d.vx / 2,
            y: d.y + d.vy / 2
          };
          x = d.x;
          y = d.y;
          nW = d.vx;
          nH = d.vy;
          k = 4;
          graph.centered(d);
        }else{
          x = width / 2;
          y = height / 2;
          nW = width;
          nH = height;
          k = 0.8;
          center = {
            x: x,
            y: y
          };
          graph.centered(null);
        }
        transform = to_bounding_box(width, height, center, nW, nH,  k);
        //return svgObject.select("g").transition().duration(750).call(graph.zoom_handler().transform, transform);
        return d3.select(document.getElementById(svgTagName)).transition().duration(750).call(
          graph.zoom_handler().transform, transform);
      }
      
    /*
    Main function that creates graph plot and draw it in the SVG container.
    */
    graph.render = function(){
      
      var links = graph.links(),
      nodes = graph.nodes(),
      nodeById = graph.nodeById(),
      width = graph.width(),
      height = graph.height(),
      focus_node = null,
      highlight_node = null,
      highlight_color = graph.highlightLinkColor(),
      highlight_trans = 0.1,
      default_link_color = "#bbb",
      indexLinks = 0,
      tocolor = "fill",
	    towhite = "stroke"
	    blinks = [];

	    graph.clear();
	    
      links.forEach(function(link) {
        
          var s = link.source = nodeById.get(link.source),
              t = link.target = nodeById.get(link.target);
              
              linknum = 0;
                
              if (indexLinks > 0 &&
                  link.source.id === links[indexLinks-1].source.id &&
                  link.target.id === links[indexLinks-1].target.id){
                    linknum = blinks[indexLinks-1].linknum + 1;
              }else{
                linknum = 1;
              }
              
              links.push({source: s, target: t, linknum: linknum});
              blinks.push({source: s, target: t, linknum: linknum});
              indexLinks++;
            });
      
      var g = graph.svg()
              .attr("width",width)
              .attr("height",height)
              .append("svg:g")
              .attr("class", graphClassName)
              .attr("id", graphClassName);
      
      graph.simulation(d3.forceSimulation(nodes)
                      .force("link", d3.forceLink(links).id(function(d){ return d.id }).distance(graph.distance()))
                      .force("charge", d3.forceManyBody().strength(function(d) { return -300;}))
                      .force("x", d3.forceX(0))
                      .force("y", d3.forceY(0))
                      .force("center", d3.forceCenter(width/2, height/2))
                      );

      var link = g.append("g")
                      .attr("class", "links")
                      .selectAll(".link")
                      .data(blinks)
                      .enter().append("svg:path")
                      .attr("class", "link")
                      //.attr("class", "link")
                      //.attr("stroke","black")
                      .attr('marker-end','url(#arrowdirection)');
      
      graph.svg().append('svg:defs').selectAll('marker')
        .data([{ id: 'arrowdirection', opacity: 1 }, { id: 'arrowdirection-none', opacity: 0.1 }])
        .enter().append('marker')
            .attr('id', d => d.id)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", graph.arrowSize())
            .attr("markerHeight", graph.arrowSize())
            .attr("orient", "auto")
            .append("svg:path")
              .attr("d", "M0,-5L10,0L0,5")
              .attr('fill', graph.arrowColor())
              .style('opacity', d => d.opacity);
            
            
            /*
            .attr('viewBox','-0 -5 10 10')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX', 15)
            .attr('refY', 0)
            .attr('markerWidth', graph.arrowSize())
            .attr('markerHeight', graph.arrowSize())
            .attr('orient', 'auto')
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', graph.arrowColor())
            .style('opacity', d => d.opacity);*/
      
      var node = g.attr("class", "nodes") 
                  .selectAll(".node") 
                  .data(nodes.filter(function(d) { return d.id; }))
                  .enter()
                  .append("circle")
                  .attr("class", "node")
                  .attr("r",graph.radius())
                  .attr("fill", graph.nodeColor())
                  .on("mouseover", function(d) { highlight_nodes(d); })
	                .on("mouseout", function(d) {highlight_off(); })
                  .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended)
                          );
                          
      node.append("title").text(function(d) { return d.id; });
      
      graph.simulation().nodes(nodes).on("tick", ticked);
      graph.simulation().force("link").links(links);

  
   function ticked() {
     
     link.attr("d",positionLink);
     node.attr("transform", positionNode);
 
      }
      
      function positionLink(d){
        var curve=2;
        var homogeneous=3.2;
        var swipFlags = " 0 0,1 "; //Original position
        var linknum = d.linknum;
        var drx, dry, x1, x2, y1, y2;
        
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx*dx+dy*dy)*(linknum+homogeneous)/(curve*homogeneous);
        
        drx = dr;
        dry = dr;
        
        x1 = d.source.x;
        y1 = d.source.y;
        x2 = d.target.x;
        y2 = d.target.y;
        
        if ( d.source.x === d.target.x && d.source.y === d.target.y ) {
            //swipFlags = "-45,1,1"
            swipFlags = " 50,1,1"
            
            drx = 30;
            dry = 20;
            
            x2 = x2 + 1;
            y2 = y2 + 1;
          } 
        if ((linknum%2) !== 1 )  swipFlags = " 1,0 0 ";  //Mirrored Position
        
        return "M" + x1 + "," + y1 
             + "A" + drx + "," + dry 
             + swipFlags + x2 + "," + y2;
      }
      
      function positionNode(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }
      
      function clicked(d) {
        
        var center, transform, nH, nW, x, y, k;
        var svgObject = d3.select(document.getElementById(svgTagName));
        
        if (d && graph.centered() !== d){
          center = {
            x: d.x + d.vx / 2,
            y: d.y + d.vy / 2
          };
          x = d.x;
          y = d.y;
          nW = d.vx;
          nH = d.vy;
          k = 4;
          graph.centered(d);
        }else{
          x = width / 2;
          y = height / 2;
          nW = width;
          nH = height;
          k = 1;
          center = {
            x: x,
            y: y
          };
          graph.centered(null);
        }
        
        transform = to_bounding_box(width, height, center, nW, nH,  k);
        //return graph.svg().select("g").transition().duration(750).call(graph.zoom_handler().transform, transform);
        //return svgObject.select("g").transition().duration(750).call(graph.zoom_handler().transform, transform);
        return d3.select(document.getElementById(svgTagName)).transition().duration(750).call(
          graph.zoom_handler().transform, transform); 
      }
  
      function dragstarted(d) {
        if (!d3.event.active && !graph.isSimulationStopped()) graph.simulation().alphaTarget(0.3).restart();
        d.fx = d.x, d.fy = d.y;
      }
      
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      
      function dragended(d) {
        if (!d3.event.active && !graph.isSimulationStopped()) graph.simulation().alphaTarget(0);
        d.fx = null, d.fy = null;
      }
      
      function highlight_nodes(d){
      
  	   graph.svg().select("g").style("cursor","pointer");
  	    
  	    if (focus_node!==null) d = focus_node;
  	    
  	    highlight_node = d;
  
  	    if (highlight_color!="white"){
  	      node.style('stroke-opacity', function (o) {
                      const thisOpacity = isConnected(d, o) ? 1 : 0.1;
                      this.setAttribute('fill-opacity', thisOpacity);
                      return thisOpacity;
                    });
  	      link.style('stroke-opacity', o => ( (o.source === d || o.target === d) ? 1 : 0.1));
  	      link.attr('marker-end', o => ( (o.source === d || o.target === d) ? 'url(#arrowdirection)' : 'url(#arrowdirection-none)'  ));
  	    }
      }
      
      function highlight_off(){
        
        highlight_node = null;
        
	      if (focus_node===null){
	        
      		graph.svg().select("g").style("cursor","move");
      		if (highlight_color!="white"){
	          
	          node.style('stroke-opacity', function (o) {
                      const thisOpacity = 1;
                      this.setAttribute('fill-opacity', thisOpacity);
                      return thisOpacity;
                    });
  	        link.style('stroke-opacity', 1);
  	        link.attr('marker-end','url(#arrowdirection)');
      		}
      		
	      }
      }
      
      var linkedByIndex = {};
      links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = true;
      });
      
    	function isConnected(a, b) {
    	  return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
      }
      
      return this;
    };
    
    return graph;
  };

})();