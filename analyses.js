(function () {
	loadChapter(1, function (err, data) {
		var nodes = data

		var links = []


		// for each node generate all links
		for (var i = 0; i < nodes.length; i++) {
			var n = nodes[i];
			var choices = [];

			if (n.choices != null) {
				choices = n.choices;
			} else if (n.random != null) {
				choices = n.random;
			}

			// for each choice create a link
			for (var x = 0; x < choices.length; x++) {
				choice = choices[x]

				var link = {
					"source": n.id,
					"target": choice.next
				}
				links.push(link)
			}

		}

		displayGraph({
			"nodes": nodes,
			"links": links
		})
	})
})()


function displayGraph (payload) {
	var width = 960,
    	height = 500;

	var svg = d3.select("body").append("svg")
		.attr("viewBox", "0 0 " + width + " " + height);

	var force = self.force = d3.layout.force()
		.nodes(payload.nodes)
		.links(payload.links)
		.size([width, height])
		.gravity(.05)
		.distance(100)
		.charge(-100)
		.start();

	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])
	  		.enter().append("svg:marker")
		    .attr("id", String)
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 15)
		    .attr("refY", -1.5)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
  			.append("svg:path")
	    		.attr("d", "M0,-5L10,0L0,5");

	var link = svg.selectAll("line.link")
		.data(payload.links)
		.enter()
			.append("svg:line")
			.attr("class", "link")
			.attr('marker-end', "url(#end)")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

	var nodeDrag = d3.behavior.drag()
		.on("dragstart", function () {
			force.stop()
		})
		.on("drag", function (d, i) {
			d.px += d3.event.dx;
			d.py += d3.event.dy;
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			tick();
		})
		.on("dragend", function (d, i) {
			d.fixed = true;
			tick();
			force.resume();
		});

	var node = svg.selectAll('g.node')
		.data(payload.nodes)
		.enter()
			.append('svg:g')
			.attr('class', 'node')
			.call(nodeDrag);

	node.append("circle")
		.attr("class", "circle")
		.attr("r", 5);

	node.append("svg:text")
        .attr("class", "nodetext")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.id });

    force.on('tick', tick)

	function tick () {
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
	}
}
function loadChapter (id, fn) {
	
	var chapter = []

	d3.json('data/c' + id + '/chapter.json', function(err, data) {
		if (data.id != id) {
			alert('INVALID CHAPTER.JSON')
		}

		var LAST = data.last

		loadNode(id, 'intro', function (err, data) {
			chapter.push(data)
		})

		// loadNode(id, '-1', function (err, data) {
		// 	chapter[-1] = data
		// 	console.log(chapter)
		// })

		for (var i = 1; i <= LAST; i++) {
			loadNode(id, i, function (err, data, i) {
				chapter.push(data)

				if (i == LAST) {
					fn(err, chapter)
				}
			})
		}

	});
}

function loadNode (chapter, id, fn) {
	d3.json('data/c' + chapter + '/' + id + '.json', function(err, data) {
	  fn(err, data, id)
	});
}