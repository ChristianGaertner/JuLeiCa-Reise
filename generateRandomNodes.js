/* THIS IS A NODE.JS PROGRAM */
var fs = require('fs');


function generateDummyNodes (chapter, start, limit) {
	var nodes = [];
	for (var i = start; i <= limit; i++) {
		nodes.push(
			generate(
				i,
				generateChoices(limit)
			)
		);
	}

	for (var i = nodes.length - 1; i >= 0; i--) {
		write(chapter, nodes[i]);
	}
}


function generate (id, choices) {
	return {
		"id": id,
		"choices": choices,
		"DUMMY_DATA": "REPLACE_WITH_REAL_DATA"
	}
}

function generateChoices(limit) {
	var x = random(0, 3);
	var choices = [];
	for (var i = 0; i <= x; i++) {
		choices.push({
			"text": "REPLACE_WITH_REAL_DATA",
			"next": random(1, limit)
		});
	}

	return choices;
}

function write(chapter, data) {
	fs.writeFile('data/c' + chapter + '/' + data.id + '.json', JSON.stringify(data, null, 4), function (err) {
		if (err) {
			console.log(chapter, data.id, err);
		}
	});
}


function random (min, max) {
	return Math.random() * (max - min) + min;
}


generateDummyNodes(1, 34, 70);