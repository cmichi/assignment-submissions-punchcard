var Color = net.brehaut.Color;
var slots = [];
var max_slots = [];
var all_cnt = 0;
var one_hour = 3600000;
var max  = 0;

var x_offset = 40
var y_offset = 40;

$(function() {
	for (var i = 0; i < 14 * 24; i++) {
		slots[i] = {
			rect: undefined
			, cnt: 0
			, dates: []
		};
	}

	var rect_size = 0;
	var rect_margin = 50;
	var day_margin = 0;
	var days_in_row = 15;
	var paper = Raphael("canvas", 1400, 1000);
	var cols = 1; 
	var rows = 24;
	var day_width = (cols * rect_size) + (cols*rect_margin) + day_margin;

	var y_margin = 0;
	var rects = [];

	for (var r = 0; r < 24; r++) {
		var x = (r * rect_size) + r * rect_margin + x_offset - 2
		paper.text(x, 15, r+"-"+(r+1))
	}
	paper.text(15 + x_offset + (24*rect_size) + (24*rect_margin), 15, "Time")

	var arr = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
	for (var c = 0; c < 14; c++) {
		var y = (c * rect_size) + c * 50 + x_offset + 0 
		paper.text(0, y, arr[(c+1)%7])
	}

	for (var d = 0; d < 14; d++) {
		for (var c = 0; c < cols; c++) {
			for (var r = 0; r < rows; r++) {
				var slot = d * 24 + (c*rows) + r;

				if (slot > 13 * 24 + 7) // 8 is deadline 
					continue;

				var rect = paper.circle(
				//var rect = paper.rect(
					 x_offset + (r * rect_margin) + (r * rect_size) + y_margin
					 , y_offset + ((d%days_in_row)*day_width) + (c * rect_margin) + (c * rect_size) 
					// ((d%days_in_row)*day_width) + (c * rect_margin) + (c * rect_size) 
					// , (r * rect_margin) + (r * rect_size) + y_margin
					, rect_size
					//, rect_size
				);

				rect.attr("fill", "#0f0");
				slots[slot].rect = rect;
			}
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
	if (cbs == 9) {
		console.log("max submissions: " + max + " of total " + all_cnt
		+ " are in slots " + max_slots.join(", "));
		console.log((all_cnt/max) + " % of all students submitted here")
		paint();
	}
	cbs++
}

function paint() {
	/* 255 = f * max */
	var f = 255 / max;

	for (var s = 0; s < 14 * 24; s++) {
		var foo = slots[s];
		if (foo == undefined || foo.rect == undefined) {
			continue;
		}

		foo.rect.attr("stroke", "#888")

		if (foo.cnt === 0 ) {
			foo.rect.attr("fill", "#fff")
			foo.rect.attr("stroke", "#fff")
		} else {
			var col = rgbToHex(Math.ceil(100 + f * foo.cnt), 0, 0) 

			var v = 0.2 + (1.0 / max) * foo.cnt
			var c = Color("#7D9AAA");
			c = c.setAlpha(v)
			foo.rect.attr("fill", c)

			/* area of circles = how many submissions in this hour?  */
			var rs = (foo.cnt / Math.PI)
			rs *= 0.83;

			var min_rs = 1.0;
			if (rs < min_rs) rs = min_rs;

			foo.rect.attr("width", rs)
			foo.rect.attr("height", rs)
			foo.rect.attr("r", rs)
			foo.rect.attr("stroke", "#888")

			var sc = Color("#7D9AAA");
			sc = sc.darkenByAmount(rs * 0.014);
			foo.rect.attr("stroke", sc)

			foo.rect.attr("opacity", 1.0)
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
			}
		}

		for (var slot = 0; slot < 14 * 24; slot++) {
			currDate.setTime( firstDate.getTime() + (slot * one_hour));

			// in this hour, how many people have submitted stuff? 
			var startHour = currDate.getTime() 
			var endHour = currDate.getTime()  + one_hour
			var cnt = 0

			for (var i in dates) {
				if (dates[i].getTime() >= startHour && dates[i].getTime() <= endHour) {
					cnt++;
				}
			}
			slots[slot].cnt += cnt;
			all_cnt += cnt;

			if (slots[slot].cnt > max) {
				max = slots[slot].cnt;
				max_slots = [];
			}
			if (slots[slot].cnt == max) 
				max_slots.push(slot);
		}
}
