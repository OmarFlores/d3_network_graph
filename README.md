# d3_network_graph
Implementation of [D3.js](https://d3js.org/) Library to build a Direct Force network graph.

Main characteristics of this implemenetation:
------------------

*  Curved links.
*  Bidirectional arrows.
*  Zoom IN/OUT.
*  Mouse over functionality to highlight node connections.

What is contained in this project:
------------------

1. src folder contains main implementation:
   *  /js/d3.graph.plugin.v1.2.js -> Re-implements d3 graph library to override methods and attributes.
   *  /js/d3.v4.min.js -> [D3.js](https://d3js.org/) core library.
   *  /css/style.css -> styles for nodes and links
2. examples folder contains examples of implementation in JS/HTML and Shiny R:
   *  /JavaScript -> example of d3_network_graph using JS and displaying it on a simple HTML pages.
   *  /R -> example of d3_network_graph on a simple R project.


Realeased under <a href="https://opensource.org/licenses/GPL-3.0">GNU General Public License
