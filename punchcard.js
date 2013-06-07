//$(function() {
$.get("./data/u01.processed", function(data){
	var lines = data.split('\n');
	var dates = [];
	for (var i in lines) {
		var line = lines[i].replace(';', ' ')
		//console.log(line)
		//console.log(new Date(line))
		dates.push(new Date(line));
	}
	//console.log(dates)

	var firstDate = new Date(2013, 03, 22);
	var currDate = new Date(2013, 03, 22);

	var rect_size = 10;
	var rect_margin = 5;
	var day_margin = 40;
	var paper = Raphael("canvas", 900, 600);
	var cols = 4;
	var rows = 24 / cols;
	var day_width = (cols * rect_size) + (cols*rect_margin) + day_margin;

	var days_in_row = 7;
	var y_margin = 0;
	var one_hour = 3600000;
	var max  = 0;
	var rects = [];

	for (var d = 0; d <= 14; d++) {
		currDate.setTime( firstDate.getTime() + d * 86400000 );

		for (var c = 0; c < rows; c++) {
			for (var r = 0; r < cols; r++) {

				/* in this hour, how many people have submitted stuff? */
				var startHour = currDate.getTime();
				var endHour = currDate.getTime() + one_hour;
				var cnt = 0
				for (var i in dates) {
					if (dates[i].getTime() >= startHour && dates[i].getTime() <= endHour) {
						//console.log(startHour)
						//console.log(dates[i])
						//console.log("!")
						//return
						cnt++;
					}
				}

				if (cnt > max) max = cnt;

				var rect = paper.rect(
					((d%days_in_row)*day_width) + (c * rect_margin) + (c * rect_size) 
					, (r * rect_margin) + (r * rect_size) + y_margin
					, rect_size
					, rect_size
				);
				rect.attr("fill", "#0f0");
				//rect.attr("fill", "#" + parseInt(cnt, 16) + "00");
				//rect.attr("fill", "#0" + (d%9) + "" + (d%9));

				rects.push({
					"rect": rect
					, "cnt": cnt
				})

				/* add one hour */
				currDate.setTime( currDate.getTime() + one_hour);

			}
		}

		if ((d === 13 || d === 6) && d > 0) 
			y_margin += (rows * rect_size) + (rows*rect_margin) + 40;
	}
	console.log("max: " + max)

	// 255 = f * max
	var f = 255 / max;
	for (var r in rects) {
		var foo = rects[r];
		//if (foo.cnt > 0) console.log(foo.cnt)
		if (foo.cnt === 0) 
			foo.rect.attr("fill", "#fff")
		else {
			//console.log(100 + f * foo.cnt)
			var col = rgbToHex(Math.ceil(100 + f * foo.cnt), 0, 0) 
			//console.log(col)
			foo.rect.attr("fill", col)
			//return;
		}
	}

}, dataType = 'text');

function componentToHex(c) {
    var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
	    return "#" + componentToHex(r) + componentToHex(g) +
	    componentToHex(b);
	    }
