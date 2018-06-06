
/* On mouse hover, lighten state color */


function init () {
    console.log( "ready!" );

var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width / 3.2, height / 3]) // translate to center of screen
    .scale([600]); // scale things down so see entire US

// Define path generator
var path = d3.geo.path() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
    .range(["rgb(213,222,217)", "rgb(69,173,168)", "rgb(84,36,55)", "rgb(217,91,67)"]);


//Create SVG element and append map to the SVG
var svg = d3.select("#mapd")
       .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 350")
   //class to make it responsive
   .classed("svg-content-responsive", true);
// Append Div for tooltip to SVG
var div = d3.select("#mapd")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load in my states data!
d3.csv("stateslived.csv", function(data) {
    color.domain([0, 1, 2, 3]); // setting the range of the input data

    // Load GeoJSON data and merge with states data
    d3.json("us-states.json", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

            // Grab State Name
            var dataState = data[i].state;

            // Grab data value 
            var dataValue = data[i].visited;

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    json.features[j].properties.visited = dataValue;

                    // Stop looking through the JSON
                    break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {

                // Get data value
                var value = d.properties.visited;

                if (value) {
                    //If value exists…
                    return color(value);
                } else {
                    //If value is undefined…
                    return "rgb(213,222,217)";
                }
            }).on("mouseover", function(d) {
              console.log(d)
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.text(d.properties.name)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                // fade out tooltip on mouse out               
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function(d) {
                    var str = 'http://networkofcare.org/splash.aspx?state=' + d.properties.name;
                    var strNoSpace = str.replace(/\s/g, '');
                    window.open(strNoSpace, '_blank');
                });


        // Map the cities I have lived in!
        d3.csv("cities-lived.csv", function(data) {

            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([d.lon, d.lat])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("r", function(d) {
                    return Math.sqrt(d.years) * 4;
                })
                .style("fill", "rgb(217,91,67)")
                .style("opacity", 0.85)

                // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
                // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.text(d.place)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                // fade out tooltip on mouse out               
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });

    });

});
}     