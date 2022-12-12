function drawGDPmap() {

    const svg = d3.select("svg")
        .attr("class", "choropleth"),
        width = svg.attr("width"),
        height = svg.attr("height"),


        path = d3.geoPath(),
        data = d3.map(),
        worldmap = "world.geojson",
        globalData = "newData.csv";
    let centered, world;

    const projection = d3.geoRobinson()
        .scale(130)
        .translate([width / 2, height / 2]);

    const colorScale = d3.scaleThreshold()
        .domain([0, 1000, 5000, 10000, 20000, 40000, 60000, 80000, 100000, 120000, 150000])
        .range(d3.schemeBuGn[7]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.queue()
        .defer(d3.json, worldmap)
        .defer(d3.csv, globalData, function (d) {
            data.set(d.code, +d.gdp);
        })
        .await(ready);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", click);

    function ready(error, topo) {

        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
                .style("stroke", "transparent");
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black");
            tooltip.style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition().duration(400)
                .style("opacity", 1)
                .text(d.properties.name + ': ' + Math.round(d.total));
        }

        let mouseLeave = function () {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "transparent");
            tooltip.transition().duration(300)
                .style("opacity", 0);
        }

        world = svg.append("g")
            .attr("class", "world");
        world.selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath().projection(projection))
            .attr("data-name", function (d) {
                return d.properties.name
            })
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })
            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .attr("id", function (d) {
                return d.id
            })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("click", click);

        const x = d3.scaleLinear()
            .domain([2.6, 75.1])
            .rangeRound([600, 860]);

        const legend = svg.append("g")
            .attr("id", "legend");

        const legend_entry = legend.selectAll("g.legend")
            .data(colorScale.range().map(function (d) {
                d = colorScale.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter().append("g")
            .attr("class", "legend_entry");

        const ls_w = 20,
            ls_h = 20;

        legend_entry.append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - 2 * ls_h;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d) {
                return colorScale(d[0]);
            })
            .style("opacity", 0.8);

        legend_entry.append("text")
            .attr("x", 50)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - ls_h - 6;
            })
            .text(function (d, i) {
                if (i === 0) return "< " + d[1];
                if (d[1] < d[0]) return d[0];
                return d[0] + " - " + d[1];
            });

        legend.append("text").attr("x", 15).attr("y", 390).text("GDP");
    }

    function click(d) {

        var x, y, k;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = -(centroid[0] * 6);
            y = (centroid[1] * 6);
            k = 3;
            centered = d;
            drawStackedBarCountrySpecific(d.properties.name)
            drawBarGraphCountrySpecific(d.properties.name)

        } else {
            x = 0;
            y = 0;
            k = 1;
            centered = null;
            drawStackedBarGraph()
            drawBarGraph()
        }

        world.selectAll("path")
            .classed("active", centered && function (d) { return d === centered; });

        world.transition()
            .duration(750)
            .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")");
    }
}

function drawPopulationMap() {
    const svg = d3.select("svg")
        .attr("class", "choropleth3"),
        width = svg.attr("width"),
        height = svg.attr("height"),


        path = d3.geoPath(),
        data = d3.map(),
        worldmap = "world.geojson",
        globalData = "newData.csv";

    let centered, world;

    const projection = d3.geoRobinson()
        .scale(130)
        .translate([width / 2, height / 2]);

    const colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemePuBu[7]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.queue()
        .defer(d3.json, worldmap)
        .defer(d3.csv, globalData, function (d) {
            data.set(d.code, +d.population);
        })
        .await(ready);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", click);

    function ready(error, topo) {

        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
                .style("stroke", "transparent");
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black");
            tooltip.style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition().duration(400)
                .style("opacity", 1)
                .text(d.properties.name + ': ' + Math.round((d.total / 1000000) * 10) / 10 + ' mio.');
        }

        let mouseLeave = function () {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "transparent");
            tooltip.transition().duration(300)
                .style("opacity", 0);
        }

        world = svg.append("g")
            .attr("class", "world");
        world.selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath().projection(projection))
            .attr("data-name", function (d) {
                return d.properties.name
            })
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })
            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .attr("id", function (d) {
                return d.id
            })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("click", click);

        const x = d3.scaleLinear()
            .domain([2.6, 75.1])
            .rangeRound([600, 860]);

        const legend = svg.append("g")
            .attr("id", "legend");

        const legend_entry = legend.selectAll("g.legend")
            .data(colorScale.range().map(function (d) {
                d = colorScale.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter().append("g")
            .attr("class", "legend_entry");

        const ls_w = 20,
            ls_h = 20;

        legend_entry.append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - 2 * ls_h;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d) {
                return colorScale(d[0]);
            })
            .style("opacity", 0.8);

        legend_entry.append("text")
            .attr("x", 50)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - ls_h - 6;
            })
            .text(function (d, i) {
                if (i === 0) return "< " + d[1] / 1000000 + " m";
                if (d[1] < d[0]) return d[0] / 1000000 + " m +";
                return d[0] / 1000000 + " m - " + d[1] / 1000000 + " m";
            });

        legend.append("text").attr("x", 15).attr("y", 390).text("Population");
    }

    function click(d) {
        var x, y, k;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = -(centroid[0] * 6);
            y = (centroid[1] * 6);
            k = 3;
            centered = d;
            drawStackedBarCountrySpecific(d.properties.name)
            drawBarGraphCountrySpecific(d.properties.name)
        } else {
            x = 0;
            y = 0;
            k = 1;
            centered = null;
            drawStackedBarGraph()
            drawBarGraph()
        }

        world.selectAll("path")
            .classed("active", centered && function (d) { return d === centered; });

        world.transition()
            .duration(750)
            .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")");
    }
}

function drawDeathsMap() {
    const svg = d3.select("svg")
        .attr("class", "choropleth2"),
        width = svg.attr("width"),
        height = svg.attr("height"),


        path = d3.geoPath(),
        data = d3.map(),
        worldmap = "world.geojson",
        globalData = "newData.csv";

    let centered, world;

    const projection = d3.geoRobinson()
        .scale(130)
        .translate([width / 2, height / 2]);

    const colorScale = d3.scaleThreshold()
        .domain([0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000])
        .range(d3.schemeOrRd[7]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.queue()
        .defer(d3.json, worldmap)
        .defer(d3.csv, globalData, function (d) {
            data.set(d.code, +d.deaths);
        })
        .await(ready);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", click);

    function ready(error, topo) {

        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
                .style("stroke", "transparent");
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black");
            tooltip.style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition().duration(400)
                .style("opacity", 1)
                .text(d.properties.name + ': ' + Math.round(d.total));
        }

        let mouseLeave = function () {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "transparent");
            tooltip.transition().duration(300)
                .style("opacity", 0);
        }

        world = svg.append("g")
            .attr("class", "world");
        world.selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath().projection(projection))
            .attr("data-name", function (d) {
                return d.properties.name
            })
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })
            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .attr("id", function (d) {
                return d.id
            })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("click", click);

        const x = d3.scaleLinear()
            .domain([2.6, 75.1])
            .rangeRound([600, 860]);

        const legend = svg.append("g")
            .attr("id", "legend");

        const legend_entry = legend.selectAll("g.legend")
            .data(colorScale.range().map(function (d) {
                d = colorScale.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter().append("g")
            .attr("class", "legend_entry");

        const ls_w = 20,
            ls_h = 20;

        legend_entry.append("rect")
            .attr("x", 20)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - 2 * ls_h;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d) {
                return colorScale(d[0]);
            })
            .style("opacity", 0.8);

        legend_entry.append("text")
            .attr("x", 50)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - ls_h - 6;
            })
            .text(function (d, i) {
                if (i === 0) return "< " + d[1];
                if (d[1] < d[0]) return d[0];
                return d[0] + " - " + d[1];
            });

        legend.append("text").attr("x", 15).attr("y", 280).text("Death Count");
    }

    function click(d) {
        var x, y, k;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = -(centroid[0] * 6);
            y = (centroid[1] * 6);
            k = 3;
            centered = d;
            drawStackedBarCountrySpecific(d.properties.name)
            drawBarGraphCountrySpecific(d.properties.name)
        } else {
            x = 0;
            y = 0;
            k = 1;
            centered = null;
            drawStackedBarGraph()
            drawBarGraph()
        }

        world.selectAll("path")
            .classed("active", centered && function (d) { return d === centered; });

        world.transition()
            .duration(750)
            .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")");
    }
}

function drawStackedBarCountrySpecific(country) {
    d3.select("#stackBar svg").remove();
    d3.select("#stackBar div").remove();

    var margin = { top: 10, right: 30, bottom: 20, left: 70 },
        width = 580 - margin.left - margin.right,
        height = 310 - margin.top - margin.bottom;

    d3.csv("childDeaths.csv", function (data) {

        const svg = d3.select("#stackBar")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        if (data.filter(d => d.Entity == country).length > 0) {
            data = data.filter(d => d.Entity == country)
        }
        else {
            drawStackedBarGraph()
            return
        }
        console.log(data)
        var subgroups = ['Streptococcus_pneumonia', 'Streptococcus_non_pneumonia_non_meningitis', 'Streptococcus_meningitis']

        var groups = d3.map(data, function (d) { return (d.Year) }).keys()
        var deathCount = []
        for (i in groups) {
            deathcategory1 = d3.sum(
                data.filter(d => d.Year === groups[i]),
                d => d.Streptococcus_pneumonia
            )
            deathcategory2 = d3.sum(
                data.filter(d => d.Year === groups[i]),
                d => d.Streptococcus_non_pneumonia_non_meningitis
            )
            deathcategory3 = d3.sum(
                data.filter(d => d.Year === groups[i]),
                d => d.Streptococcus_meningitis
            )
            var count = deathcategory1 + deathcategory2 + deathcategory3
            deathCount.push(count)
        }
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        var y = d3.scaleLinear()
            .domain([0, d3.max(deathCount) * 1.3])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#F81F06', '#0666F9', '#65D562'])

        var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return color(d.key); })
            .selectAll("rect")
            .attr("class", "bars")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("class", "bars")
            .attr("x", function (d) { return x(d.data.Year); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 25)
            .text("Years");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - 75)
            .text("Number of deaths")

        var legend = svg.append("g")
            .attr("id", "legendBars")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(subgroups.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 25 + ")"; })

        legend.append("rect")
            .attr("x", width + 10)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color)
            .attr("stroke", "grey")

        legend.append("text")
            .attr("x", width)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });
        var legenTitle = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
        legenTitle.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .text("Type of disease")
    })
}

function drawStackedBarGraph() {
    d3.select("#stackBar svg").remove();
    d3.select("#stackBar div").remove();

    var margin = { top: 10, right: 30, bottom: 20, left: 70 },
        width = 580 - margin.left - margin.right,
        height = 310 - margin.top - margin.bottom;

    d3.csv("stackedBarGraph.csv", function (data) {

        const svg = d3.select("#stackBar")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        let bar_tooltip = d3
            .select("#bar")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        var subgroups = data.columns.slice(1)
        console.log(subgroups)
        var groups = d3.map(data, function (d) { return (d.Year) }).keys()

        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        var y = d3.scaleLinear()
            .domain([0, 1300000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#F81F06', '#0666F9', '#65D562'])

        var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return color(d.key); })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.Year); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 25)
            .text("Years");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - 75)
            .text("Number of deaths")

        var legend = svg.append("g")
            .attr("id", "legendBars")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(subgroups.slice(1).reverse())
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 25 + ")"; });

        legend.append("rect")
            .attr("x", width + 10)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color)
            .attr("stroke", "grey")

        legend.append("text")
            .attr("x", width)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });

    })
}

function drawBarGraph() {
    d3.select("#barChart svg").remove();
    d3.select("#barChart div").remove();

    var margin = { top: 10, right: 30, bottom: 26, left: 100 },
        width = 580 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    d3.csv("barGraphPop.csv", function (data) {

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) { return d.Year; }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        var y = d3.scaleLinear()
            .domain([0, 15000000000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.Year); })
            .attr("y", function (d) { return y(d.population); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.population); })
            .attr("fill", "#4FB58E")

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 100)
            .text("Years");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - 100)
            .text("Population")
    })

}

function drawBarGraphCountrySpecific(country) {
    d3.select("#barChart svg").remove();
    d3.select("#barChart div").remove();

    var margin = { top: 10, right: 30, bottom: 26, left: 100 },
        width = 580 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;


    d3.csv("newData.csv", function (data) {

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        if (data.filter(d => d.Entity == country).length > 0) {
            data = data.filter(d => d.Entity == country)
        }
        else {
            drawBarGraph()
            return
        }
        var groups = d3.map(data, function (d) { return (d.Year) }).keys()
        console.log(groups)
        var population = []
        for (i in groups) {
            count = d3.sum(
                data.filter(d => d.Year === groups[i]),
                d => d.population
            )
            population.push(count)
        }

        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) { return d.Year; }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        var y = d3.scaleLinear()
            .domain([0, d3.max(population) * 1.2])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.Year); })
            .attr("y", function (d) { return y(d.population); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.population); })
            .attr("fill", "#4FB58E")

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 100)
            .text("Years");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - 100)
            .text("Population")
    })
}
