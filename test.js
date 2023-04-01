const map = document.getElementById("map");

fetch("india.svg")
  .then((response) => response.text())
  .then((data) => {
    map.innerHTML = data;
    const states = map.querySelectorAll(".state");
    states.forEach((state) => {
      state.addEventListener("click", () => {
        console.log(state.getAttribute("data-state"));
      });
    });
  });

  var width = 960,
    height = 600;

var projection = d3.geo.mercator()
    .center([82, 23])
    .scale(1000);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("india.json", function(error, india) {
  if (error) return console.error(error);

  svg.selectAll(".state")
      .data(topojson.feature(india, india.objects.states).features)
    .enter().append("path")
      .attr("class", "state")
      .attr("d", path)
      .on("click", clicked);
});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 3;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  svg.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  svg.transition()
      .duration(750)
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
}
