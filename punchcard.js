var slots = [];
var max_slots = [];
var one_hour = 3600000;
var max  = 0;
var viz = 1;

$(function() {
	for (var i = 0; i < 14 * 24; i++) {
		slots[i] = {
			rect: undefined
			, cnt: 0
			, dates: []
		};
	}

	if (viz == 1) {
		var rect_size = 15;
		var rect_margin = 5;
		var day_margin = 20;
		var days_in_row = 7;
	} else {
		var rect_size = 13;
		var rect_margin = 3;
		var day_margin = 0;
		var days_in_row = 15;
	}
	var paper = Raphael("canvas", 1280, 600);
	var cols = 6;
	var rows = 24 / cols;
	var day_width = (cols * rect_size) + (cols*rect_margin) + day_margin;

	var y_margin = 0;
	var rects = [];

	for (var d = 0; d < 14; d++) {
		for (var c = 0; c < cols; c++) {
			for (var r = 0; r < rows; r++) {
				var slot = d * 24 + (c*rows) + r;
				//console.log(slot)

				if (slot > 13 * 24 + 7) // 8 is deadline 
					continue;

				var rect = paper.rect(
					((d%days_in_row)*day_width) + (c * rect_margin) + (c * rect_size) 
					, (r * rect_margin) + (r * rect_size) + y_margin
					, rect_size
					, rect_size
				);

				rect.attr("fill", "#0f0");
				slots[slot].rect = rect;
			}
		}

		if ((d === 13 || d === 6) && d > 0) {
			if (viz == 1)
				y_margin += (rows * rect_size) + (rows*rect_margin) + 40;
		}
	}
	$.get("./data/grn12-13/u06.processed", function(data){
		var firstDate = new Date(2013, 0, 22);
		var currDate = new Date(2013, 0, 22);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');

	$.get("./data/grn12-13/u05.processed", function(data){
		var firstDate = new Date(2013, 0, 8);
		var currDate = new Date(2013, 0, 8);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');
	$.get("./data/grn12-13/u04.processed", function(data){
		var firstDate = new Date(2012, 11, 25);
		var currDate = new Date(2012, 11, 25);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');
	$.get("./data/grn12-13/u03.processed", function(data){
		var firstDate = new Date(2012, 11, 4);
		var currDate = new Date(2012, 11, 4);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');
	$.get("./data/grn12-13/u02.processed", function(data){
		var firstDate = new Date(2012, 10, 13);
		var currDate = new Date(2012, 10, 13);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');

	$.get("./data/grn12-13/u01.processed", function(data){
		var firstDate = new Date(2012, 9, 30);
		var currDate = new Date(2012, 9, 30);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');

	$.get("./data/muc13/u01.processed", function(data){
		var firstDate = new Date(2013, 03, 23);
		var currDate = new Date(2013, 03, 23);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');

	$.get("./data/muc13/u02.processed", function(data){
		var currDate = new Date(2013, 4, 8);
		var firstDate = new Date(2013, 4, 8);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');

	$.get("./data/muc13/u03.processed", function(data){
		var currDate = new Date(2013, 4, 21);
		var firstDate = new Date(2013, 4, 21);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');

	$.get("./data/muc13/u01.processed", function(data){
		var currDate = new Date(2013, 4, 21);
		var firstDate = new Date(2013, 4, 21);

		process(currDate, firstDate, data);
		check()
	}, dataType = 'text');
});

var cbs = 0;
function check() {
	if (cbs == 9)
		paint()
	cbs++
}

function paint() {
	// 255 = f * max
	var f = 255 / max;
	for (var s = 0; s < 14 * 24; s++) {
		var foo = slots[s];
		if (foo == undefined || foo.rect == undefined) {
			//console.log(s + " was undef")
			continue;
		}

		//if (foo.cnt > 0) console.log(foo.cnt)
		if (viz == 1)
			foo.rect.attr("stroke", "#000")
		else
			foo.rect.attr("stroke", "#888")

		if (foo.cnt === 0 ) 
			foo.rect.attr("fill", "#fff")
		else {
			//console.log(100 + f * foo.cnt)
			var col = rgbToHex(Math.ceil(100 + f * foo.cnt), 0, 0) 
			//console.log(col)
			//foo.rect.attr("stroke", "#7D9AAA")
			//foo.rect.attr("stroke", "#000")

			//foo.rect.attr("fill", "#7D9AAA")

			foo.rect.attr("fill", "#7D9AAA")
			foo.rect.attr("opacity", 0.2 + (1.0 / max) * foo.cnt)
			//foo.rect.attr("opacity", 0.2 + (1.0 / max) * Math.log(foo.cnt))
			//return;
		}

		if ($.inArray(s, max_slots) !== -1)
			foo.rect.attr("fill", "#f00")
			//foo.rect.attr("stroke", "#f00")

			if (s >= 310) {
				//foo.rect.attr("fill", "#f00")
				//console.log(slots[s])
				//console.log(s)
				//console.log(foo.cnt);
			}
	}
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) +
    componentToHex(b);
}

function process(currDate, firstDate, data) {
		var dates = [];

		var lines = data.split('\n');
		for (var i in lines) {
			var line = lines[i].replace(';', ' ')
			if (line.trim().length > 0) {
				dates.push(new Date(line));
				//console.log(line + " " + (new Date(line)))
			}
		}
		//console.log(data)
		//console.log(dates)

		for (var slot = 0; slot < 14 * 24; slot++) {
			currDate.setTime( firstDate.getTime() + (slot * one_hour));
			//if (slot >=  354)
				//console.log(currDate)

			// in this hour, how many people have submitted stuff? 
			var startHour = currDate.getTime() 
			var endHour = currDate.getTime()  + one_hour
			if (slot > 310) {
				//console.log(slot + ", "+ new Date(startHour))
			}
			var cnt = 0
			for (var i in dates) {
				if (dates[i].getTime() >= startHour && dates[i].getTime() <= endHour) {
					//console.log(startHour)
					//console.log(dates[i])
					//console.log("!")
					//return
					//slots[slot].push(dates[i])
					cnt++;
				}
			}
			slots[slot].cnt += cnt;
			//if (cnt > 0)
			//console.log(cnt)

			if (cnt > max) {
				max = cnt;
				max_slots = [];
			}
			if (cnt == max) 
				max_slots.push(slot);
		}
		//console.log("max: " + max)
}
