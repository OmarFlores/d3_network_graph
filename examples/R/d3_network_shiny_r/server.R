
# This is the server logic for a Shiny web application.
# You can find out more about building applications with Shiny here:
#
# http://shiny.rstudio.com
#

library(shiny)
library(jsonlite)

shinyServer(function(input, output,session) {
  #Definition of a JSON object in Shiny R context
  jsonObject <- '{
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
}'
  
  output$graphD3 <- reactive({
    
  })
  
  #Trigger function that sends JSON object to the JavaScript library
  observeEvent(input$startDraw,{
    output$jsonStructure <- renderText({jsonObject})
    session$sendCustomMessage(type="drawGraph",jsonObject)
  });
  
})
