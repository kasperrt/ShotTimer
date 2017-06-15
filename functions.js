(function($) {
  $.fn.outerHTML = function() {
    return $(this).clone().wrap('<div></div>').parent().html();
  }
})(jQuery);

function redraw(clickX, clickY, clickDrag, color, fulldraw, lineWidth){
  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = color;
  context.lineJoin = "round";
  context.lineWidth = lineWidth;

  if(!fulldraw)
  {
    context.beginPath();
    if(clickDrag[clickDrag.length-1]){
      context.moveTo(clickX[clickDrag.length-2], clickY[clickDrag.length-2]);
     }else{
       context.moveTo(clickX[clickDrag.length-1]-1, clickY[clickDrag.length-1]);
     }
     context.lineTo(clickX[clickDrag.length-1], clickY[clickDrag.length-1]);
     context.closePath();
     context.stroke();
  }else
  {
    for(var i=0; i < clickX.length; i++) {
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
       }else{
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.stroke();
    }
  }
  /*
  */
}

function predicate() {
	var fields = [],
	n_fields = arguments.length,
	field, name, cmp;

	var default_cmp = function (a, b) {
		if (a === b) return 0;
		return a < b ? -1 : 1;
	},
	getCmpFunc = function (primer, reverse) {
		var dfc = default_cmp,
		// closer in scope
		cmp = default_cmp;
		if (primer) {
			cmp = function (a, b) {
				return dfc(primer(a), primer(b));
			};
		}
		if (reverse) {
			return function (a, b) {
				return -1 * cmp(a, b);
			};
		}
		return cmp;
	};

	// preprocess sorting options
	for (var i = 0; i < n_fields; i++) {
		field = arguments[i];
		if (typeof field === 'string') {
			name = field;
			cmp = default_cmp;
		} else {
			name = field.name;
			cmp = getCmpFunc(field.primer, field.reverse);
		}
		fields.push({
			name: name,
			cmp: cmp
		});
	}

	// final comparison function
	return function (A, B) {
		var name, result;
		for (var i = 0; i < n_fields; i++) {
			result = 0;
			field = fields[i];
			name = field.name;

			result = field.cmp(A[name], B[name]);
			if (result !== 0) break;
		}
		return result;
	};
}

function update_scoreboard(scoreboard) {
  $(".scoreboard").empty();
  $.each(scoreboard, function(key, value) {
    var html = $(value.html);
    var score = value.score;
    html.find(".score").text(score);
		var canvas = html.find("canvas").attr("id");

    $(".scoreboard").append(html);
		if(canvas != undefined) {
			var id = canvas.split("-")[1];
			context = document.getElementById("canvas-" + id).getContext("2d");
			redraw(drawings[id][0], drawings[id][1], drawings[id][2], drawings[id][5], true, 50);
		}
  });
}

function rnd(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pad(t, num){
	if(num == 2) out = t < 10 ? "0"+t : t;
	else if(num == 3) out = t < 10 ? "00"+t : t < 100 ? "0"+t : t;
	return out;
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
