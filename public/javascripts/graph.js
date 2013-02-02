/*global $:false SbmlParser:false d3:false Sim state*/
// graph.js defines the graph class
function Graph() {
    this.initSim(state.$sbmlDoc);
    this.initAxis(arguments[0], arguments[1], arguments[2]);
    this.initSvg();
    this.plotCurves();
    // initially setting all species as visible
    var initVisibleSpecies = [];
    this.species.forEach(function (element) {
        initVisibleSpecies.push(element.name)
    });
    this.setVisibleSpecies(initVisibleSpecies);
    // saves graph to state
    this.saveGraph();
}
// initialize and run simulation
Graph.prototype.initSim = function ($sbmlDoc) {
    // get data from simulation
    this.sim = new Sim($sbmlDoc);
    this.data = this.sim.data;
    state.simData = this.data;
};
// update simulation
Graph.prototype.updateSim = function ($sbmlDoc) {
    // update simulation
    this.sim.data = this.sim.simulate($sbmlDoc);
    this.data = this.sim.data;
    state.simData = this.data;
};
// initialize axis
Graph.prototype.initAxis = function () {
    // margin, width, height
    this.margin = arguments[0],
    this.width = arguments[1] - this.margin.left - this.margin.right,
    this.height = arguments[2] - this.margin.top - this.margin.bottom,
    this.x = d3.scale.linear().range([0, this.width]),
    this.y = d3.scale.linear().range([this.height, 0]),
    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom"),
    this.yAxis = d3.svg.axis().scale(this.y).orient("left");
};
// initialize SVG
Graph.prototype.initSvg = function () {
    this.$plot = $(document.createElement('div'));
    this.svg = d3.select(this.$plot[0]).append("svg").attr("id", "simulation").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
};
// initialize curves
Graph.prototype.plotCurves = function () {
    this.color = d3.scale.category10();
    this.line = d3.svg.line().interpolate("basis").x(function (d) {
        return this.x(d.time);
    }).y(function (d) {
        return this.y(d.amount);
    });
    this.color.domain(d3.keys(this.data[0]).filter(function (key) {
        return key !== "time";
    }));
    var self = this;
    this.species = this.color.domain().map(function (name) {
        return {
            name: name,
            values: self.data.map(function (d) {
                return {
                    time: d.time,
                    amount: d[name]
                };
            })
        };
    });
    // update the domain of the x and y to match species
    this.x.domain(d3.extent(this.data, function (d) {
        return d.time;
    }));
    this.y.domain([
        d3.min(this.species, function (c) {
        return d3.min(c.values, function (v) {
            return v.amount;
        });
    }), d3.max(this.species, function (c) {
        return d3.max(c.values, function (v) {
            return v.amount;
        });
    })]);
    // place items on to the graph!
    this.svg.append("g").attr("class", "x axis").attr("id", "xAxis").attr("transform", "translate(0," + this.height + ")").call(this.xAxis);
    this.svg.append("g").attr("class", "y axis").attr("id", "yAxis").call(this.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Amount");
    this.specie = this.svg.selectAll(".specie").data(this.species).enter().append("g").attr("class", "specie");
    self = this; // update wrapper to pass into callback
    this.specie.append("path").attr("class", "line").attr("d", function (d) {
        return self.line(d.values);
    }).style("stroke", function (d) {
        return self.color(d.name);
    }).attr("id", "simLine");
    this.specie.append("text").datum(function (d) {
        return {
            name: d.name,
            value: d.values[d.values.length - 1]
        };
    }).attr("id", "simLabel").attr("transform", function (d) {
        return "translate(" + self.x(d.value.time) + "," + self.y(d.value.amount) + ")";
    }).attr("x", 3).attr("dy", ".35em").text(function (d) {
        return d.name;
    });
};
// saves Graph object to state
Graph.prototype.saveGraph = function () {
    state.graphs.push(this);
};
// simulation graph
Graph.prototype.simPlot = function ($sbmlDoc) {
    // storing the simulated species values
    state.species = species;
    state.visibleSpecies = [];
    species.forEach(function (item) {
        state.visibleSpecies.push(item.name);
    });
};
// sets which species are visible
Graph.prototype.setVisibleSpecies = function (species) {
    this.visibleSpecies = species;
}
// updates the plot
Graph.prototype.update = function () {};
// updates curves
Graph.prototype.updateCurves = function () {
    var self = this;
    // updating axis
    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
    this.yAxis = d3.svg.axis().scale(this.y).orient("left");
    this.species = this.color.domain().map(function (name) {
        return {
            name: name,
            values: self.data.map(function (d) {
                return {
                    time: d.time,
                    amount: d[name]
                };
            })
        };
    }).filter(function (element) {
        return self.visibleSpecies.indexOf(element.name) > -1;
    });
    // update the domain of the x and y to match species
    this.x.domain(d3.extent(this.data, function (d) {
        return d.time;
    }));
    this.y.domain([
        d3.min(this.species, function (c) {
        return d3.min(c.values, function (v) {
            return v.amount;
        });
    }), d3.max(this.species, function (c) {
        return d3.max(c.values, function (v) {
            return v.amount;
        });
    })]);
    // update items on graph
    self = this;
    this.svg.select(".x.axis").call(this.xAxis);
    this.svg.select(".y.axis").call(this.yAxis);
    self = this; // update wrapper to pass into callback

    this.svg.selectAll(".specie").remove()

    this.specie = this.svg.selectAll(".specie").data(this.species).enter().append("g").attr("class", "specie");
    this.specie.append("path").attr("class", "line").attr("d", function (d) {
        return self.line(d.values);
    }).style("stroke", function (d) {
        return self.color(d.name);
    }).attr("id", "simLine");
    this.specie.append("text").datum(function (d) {
        return {
            name: d.name,
            value: d.values[d.values.length - 1]
        };
    }).attr("id", "simLabel").attr("transform", function (d) {
        return "translate(" + self.x(d.value.time) + "," + self.y(d.value.amount) + ")";
    }).attr("x", 3).attr("dy", ".35em").text(function (d) {
        return d.name;
    });
};
    //    this.svg.selectAll("path#simLine").data(this.species).attr("d", function (d) {
    //        return self.line(d.values);
    //    });
    //    this.svg.selectAll("text#simLabel").data(this.species).datum(function (d) {
    //        return {
    //            name: d.name,
    //            value: d.values[d.values.length - 1]
    //        };
    //    }).attr("transform", function (d) {
    //        return "translate(" + self.x(d.value.time) + "," + self.y(d.value.amount) + ")";
    //    }).text(function (d) {
    //        return d.name;
    //    });