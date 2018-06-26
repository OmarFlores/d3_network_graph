
# This is the user-interface definition of a Shiny web application.
# You can find out more about building applications with Shiny here:
#
# http://shiny.rstudio.com
#

library(shiny)

shinyUI(fluidPage(

  # Application title
  titlePanel("D3 graph network with Shiny R"),
  hr(),
  # Sidebar with a slider input for number of bins
  sidebarLayout(
    sidebarPanel(
      actionButton("startDraw",label = "Draw Network Graph"),
      textOutput("jsonStructure")
    ),

    # Show a plot of the generated distribution
    mainPanel(
      fluidRow(
        tags$head(tags$script(src="js/d3.v4.min.js"),
                  tags$link(rel = "stylesheet", type = "text/css", href = "css/style.css"),
                  tags$script('
                              var dimension = [0, 0];
                              $(document).on("shiny:connected", function(e) {
                              dimension[0] = window.innerWidth;
                              dimension[1] = window.innerHeight;
                              Shiny.onInputChange("d3NetworkGraph-dimension", dimension);
                              });
                              ')),
        tags$script(src="js/d3.graph.plugin.v1.2.js")
        ,tags$script(src="js/graph.script.js")
                  ),
      fluidRow(  ),
      fluidRow(
        column(8,
               tags$div({HTML("<svg id='svgD3Graph' width='800' height='600'></svg>")})
               #,uiOutput("graphD3"))
               #,column(4,uiOutput("graphD3CallbackUI")
        )
      )
    )
  )
)

)


