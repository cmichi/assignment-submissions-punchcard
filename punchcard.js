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

	var days_in_row = 7
	var y_margin = 0
	var one_hour = 3600000

	for (var d = 0; d <= 14; d++) {
		currDate.setTime( firstDate.getTime() + d * 86400000 );

		for (var c = 0; c < rows; c++) {
			for (var r = 0; r < cols; r++) {

				/* in this hour, how many people have submitted stuff? */
				var startHour = currDate.getTime();
				var endHour = currDate.getTime() + one_hour;
				for (var i in dates) {
					if (dates[i].getTime() >= startHour && dates[i].getTime() <= endHour)
					    {
						    console.log(startHour)
						console.log(dates[i])
						console.log("!")
						return
						}
				}

				var rect = paper.rect(
					((d%days_in_row)*day_width) + (c * rect_margin) + (c * rect_size) 
					, (r * rect_margin) + (r * rect_size) + y_margin
					, rect_size
					, rect_size
				);
				rect.attr("fill", "#0" + (d%9) + "" + (d%9));

				/* add one hour */
				currDate.setTime( currDate.getTime() + one_hour);

			}
		}

		if ((d === 13 || d === 6) && d > 0) 
			y_margin += (rows * rect_size) + (rows*rect_margin) + 40;
	}
}, dataType = 'text');


