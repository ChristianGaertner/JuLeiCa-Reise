(function () {
	
	var width = 960,
		height = 2200;

	var cluster = d3.layout.cluster()
		.size([height, width - 160]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(40,0)");


	loadChapter(1, function (err, data) {
		
	})

})()



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