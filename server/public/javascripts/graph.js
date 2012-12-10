/*global $:false SbmlParser:false d3:false state:false Sim*/

// graph.js defines the graph class

function Graph() {}

// simulation graph
Graph.prototype.simPlot = function($sbmlDoc) {
    // get data from simulation
    var sim = new Sim();
    var data = sim.simulate($sbmlDoc);


    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");

    var line = d3.svg.line().interpolate("basis").x(function(d) {
        return x(d.time);
    }).y(function(d) {
        return y(d.amount);
    });

    var $plot = $(document.createElement('div'));
    var svg = d3.select($plot[0]).append("svg").attr("id", "simulation").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "time";
    }));


    var species = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    time: d.time,
                    amount: +d[name]
                };
            })
        };
    });

    x.domain(d3.extent(data, function(d) {
        return d.time;
    }));

    y.domain([
    d3.min(species, function(c) {
        return d3.min(c.values, function(v) {
            return v.amount;
        });
    }),
    d3.max(species, function(c) {
        return d3.max(c.values, function(v) {
            return v.amount;
        });
    })]);

    svg.append("g").attr("class", "x axis").attr("id", "xAxis").attr("transform", "translate(0," + height + ")").call(xAxis);

    svg.append("g").attr("class", "y axis").attr("id", "yAxis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Amount");

    var specie = svg.selectAll(".specie").data(species).enter().append("g").attr("class", "specie");

    specie.append("path").attr("class", "line").attr("d", function(d) {
        return line(d.values);
    }).style("stroke", function(d) {
        return color(d.name);
    }).attr("id", "simLine");

    specie.append("text").datum(function(d) {
        return {
            name: d.name,
            value: d.values[d.values.length - 1]
        };
    }).attr("id", "simLabel").attr("transform", function(d) {
        return "translate(" + x(d.value.time) + "," + y(d.value.amount) + ")";
    }).attr("x", 3).attr("dy", ".35em").text(function(d) {
        return d.name;
    });
    return $plot;
};

// updates the simulation plot
Graph.prototype.updateSimPlot = function($plot, $sbmlDoc) {
    // get data from simulation
    var sim = new Sim();
    var data = sim.simulate($sbmlDoc);

    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");

    var line = d3.svg.line().interpolate("basis").x(function(d) {
        return x(d.time);
    }).y(function(d) {
        return y(d.amount);
    });

    var svg = d3.select($plot[0]);

    color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "time";
    }));


    var species = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    time: d.time,
                    amount: +d[name]
                };
            })
        };
    });

    x.domain(d3.extent(data, function(d) {
        return d.time;
    }));

    y.domain([
    d3.min(species, function(c) {
        return d3.min(c.values, function(v) {
            return v.amount;
        });
    }),
    d3.max(species, function(c) {
        return d3.max(c.values, function(v) {
            return v.amount;
        });
    })]);

    svg.select(".x.axis").call(xAxis);

    svg.select(".y.axis").call(yAxis);

    svg.selectAll("path#simLine").data(species).attr("d", function(d) {
        return line(d.values);
    });

    svg.selectAll("text#simLabel").data(species).datum(function(d) {
        return {
            name: d.name,
            value: d.values[d.values.length - 1]
        };
    }).attr("transform", function(d) {
        return "translate(" + x(d.value.time) + "," + y(d.value.amount) + ")";
    }).text(function(d) {
        return d.name;
    });
};