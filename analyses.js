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

		console.log(nodes)
		console.log(links)
		
		displayGraph({
			"nodes": nodes,
			"links": links
		})
	})
})()


function displayGraph (payload) {
	var width = 960,
    	height = 500;

	for (var i = 0; i < payload.nodes.length; i++) {
		if (payload.nodes[i]) {} else {
			alert("shit")
		}
	};

	var force = d3.layout.force()
		.nodes(payload.nodes)
		.links(payload.links)
		.size([width, height])
		.charge(-30)
		.linkDistance(20);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	svg.append("rect")
		.attr("width", width)
		.attr("height", height);

	var link = svg.selectAll(".link")
		.data(payload.links)
		.enter()
			.append("line")
			.attr("class", "link");

	var node = svg.selectAll(".node")
		.data(payload.nodes)
		.enter()
			.append("circle")
			.attr("class", "node")
			.attr("r", 5)
			.style("fill", function(d) { return "red"; })
			.call(force.drag);

	force.start();
}

function loadChapter (id, fn) {
	
	var chapter = []

	d3.json('/data/c' + id + '/chapter.json', function(err, data) {
		if (data.id != id) {
			alert('INVALID CHAPTER.JSON')
		}

		var LAST = data.last

		loadNode(id, 'intro', function (err, data) {
			chapter.push(data)
		})

		loadNode(id, '-1', function (err, data) {
			chapter[-1] = data
		})

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
	d3.json('/data/c' + chapter + '/' + id + '.json', function(err, data) {
	  fn(err, data, id)
	});
}