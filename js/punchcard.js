/* Code works. However, you should note: It has grown
into a different visualization than I wanted at first.
Some stuff is still ugly or redundant. */

var Color = net.brehaut.Color;
var slots = [];
var max_slots = [];
var submissions_total = 0;
var one_hour = 3600000;
var max  = 0;

$(function() {
	for (var i = 0; i < 14 * 24; i++) {
		slots[i] = {
			circle: undefined
			, cnt: 0
			, dates: []
		};
	}

	var x_offset = 40;
	var y_offset = 40;

	var circle_margin = 50;
	var days_in_row = 15;
	var paper = Raphael("canvas", 1400, 1000);
	var cols = 1; 
	var rows = 24;
	var day_width = cols * circle_margin;
	var y_margin = 0;
	var circles = [];

	/* x-axis */
	for (var r = 0; r < 24; r++) {
		var x = r * circle_margin + x_offset - 2;
		paper.text(x, 15, r + "-" + (r+1))
	}
	paper.text(15 + x_offset + (24 * circle_margin), 15, "Time")

	/* y-axis */
	var arr = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
	for (var c = 0; c < 14; c++) {
		var y = c * 50 + x_offset + 0;
		paper.text(0, y, arr[(c+1) % 7]);
	}

	for (var d = 0; d < 14; d++) {
		for (var c = 0; c < cols; c++) {
			for (var r = 0; r < rows; r++) {
				var slot = d * 24 + (c*rows) + r;

				/* 8:00 AM is deadline */
				if (slot > 13 * 24 + 7)
					continue;

				var circle = paper.circle(
					 x_offset + (r * circle_margin) + y_margin
					 , y_offset + ((d % days_in_row) * day_width) + (c * circle_margin) 
					 , 0
				);

				circle.attr("fill", "#0f0");
				slots[slot].circle = circle;
			}
		}
	}

	$.get("./data/grn12-13/u06.processed", function(data){
		var firstDate = new Date(2013, 0, 22);
		var currDate = new Date(2013, 0, 22);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/grn12-13/u05.processed", function(data){
		var firstDate = new Date(2013, 0, 8);
		var currDate = new Date(2013, 0, 8);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/grn12-13/u04.processed", function(data){
		var firstDate = new Date(2012, 11, 25);
		var currDate = new Date(2012, 11, 25);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/grn12-13/u03.processed", function(data){
		var firstDate = new Date(2012, 11, 4);
		var currDate = new Date(2012, 11, 4);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/grn12-13/u02.processed", function(data){
		var firstDate = new Date(2012, 10, 13);
		var currDate = new Date(2012, 10, 13);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/grn12-13/u01.processed", function(data){
		var firstDate = new Date(2012, 9, 30);
		var currDate = new Date(2012, 9, 30);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/muc13/u01.processed", function(data){
		var firstDate = new Date(2013, 03, 23);
		var currDate = new Date(2013, 03, 23);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/muc13/u03.processed", function(data){
		var currDate = new Date(2013, 4, 21);
		var firstDate = new Date(2013, 4, 21);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');

	$.get("./data/muc13/u01.processed", function(data){
		var currDate = new Date(2013, 4, 21);
		var firstDate = new Date(2013, 4, 21);

		process(currDate, firstDate, data);
		check();
	}, dataType = 'text');
});

/* check() gets called each time data for an assignment was processed.
once each assignment is processed stuff is drawn. */
var barrier_points = 0;
function check() {
	if (barrier_points === 8) {
		console.log("max submissions: " + max + " of total " 
				+ submissions_total + " are in slots " + max_slots.join(", "));
		console.log((submissions_total / max) + " % of all students submitted here");
		draw();
	}
	barrier_points++;
}

function draw() {
	for (var s = 0; s < 14 * 24; s++) {
		var slot = slots[s];
		if (slot == undefined || slot.circle == undefined) 
			continue;

		if (slot.cnt === 0 ) {
			slot.circle.attr("fill", "#fff");
			slot.circle.attr("stroke", "#fff");
		} else {
			var alpha = 0.2 + (1.0 / max) * slot.cnt;
			var col = Color("#7D9AAA").setAlpha(alpha);
			slot.circle.attr("fill", col);

			/* the area of a circle represents how many submissions 
			were made in this hour? therefore the radius is calculated 
			using 'a = pi * (r*r)'. */
			var r = Math.sqrt(slot.cnt / Math.PI)
			r *= 4.4; /* scale circle into visible area */

			var min_r = 0.4;
			if (r < min_r && slot.cnt > 0) r = min_r;

			slot.circle.attr("r", r);
			slot.circle.attr("stroke", "#888")

			/* the lighter the color of the circle, the darker the stroke */
			var stroke_col = Color("#7D9AAA").darkenByAmount(r * 0.014);
			slot.circle.attr("stroke", stroke_col);
		}
	}
}

function process(currDate, firstDate, data) {
		var dates = [];

		var lines = data.split('\n');
		for (var i in lines) {
			var line = lines[i].replace(';', ' ');
			if (line.trim().length > 0) {
				dates.push(new Date(line));
			}
		}

		for (var slot = 0; slot < 14 * 24; slot++) {
			currDate.setTime( firstDate.getTime() + (slot * one_hour));

			/* in this hour, how many people have submitted stuff? */
			var startHour = currDate.getTime();
			var endHour = currDate.getTime()  + one_hour;
			var cnt = 0;

			for (var i in dates) {
				if (dates[i].getTime() >= startHour && dates[i].getTime() <= endHour) 
					cnt++;
			}
			slots[slot].cnt += cnt;
			submissions_total += cnt;

			if (slots[slot].cnt > max) {
				max = slots[slot].cnt;
				max_slots = [];
			}

			if (slots[slot].cnt == max) 
				max_slots.push(slot);
		}
}
