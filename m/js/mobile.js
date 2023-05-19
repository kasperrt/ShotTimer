var port = 3001
var socket = io(window.location.protocol + "//" + window.location.host + ":" + port);
var height = $(window).height()-110;
var width = $(window).width()-20;
var name = "";

window.addEventListener("load", function(){
  context = document.getElementById('canvas').getContext("2d");
  $("#canvas").attr("height", height + "px");
  $("#canvas").attr("width", width + "px");
  document.getElementById("playerform").addEventListener("submit", function(e){
		e.preventDefault();
    $(".canvas-container").removeClass("hide");
    $(".valign-wrapper").addClass("hide");
    name = this.name.value;
    $("#inp").blur();
    window.scrollTo(0, 0);
		/*socket.emit("join", {id: window.location.search.substring(1), name: this.name.value});
    document.getElementsByClassName("valign")[0].innerHTML = "<div style='text-align:center;font-size:4rem;'>You have joined the game!</span>";
    socket.disconnect();*/
		//window.location = "https://zoff.no";
	});

  $("#submit_drawing").on("click", function(e) {
    e.preventDefault();
    socket.emit("join", {id: window.location.pathname.split("/")[2], name: name, drawing: [clickX, clickY, clickDrag, height, width, color]});
    socket.disconnect();
    $(".canvas-container").remove();
    $("#playerform").remove();
    $(".valign-wrapper").removeClass("hide");
    $(".valign").append("<p class='sent-text'>Sent!</p>");
    
  });

  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var maybePreventPullToRefresh = false;
  var color = getRandomColor();
  var paint;

  $('#canvas').bind("touchstart",function(e){

    maybePreventPullToRefresh = window.pageYOffset == 0;

    var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
    var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;

    paint = true;
    addClick(mouseX, mouseY);
    main.redraw(clickX, clickY, clickDrag, color, false);
  });

  $('#canvas').bind("touchmove", function(e){
    if(paint){
      addClick(e.originalEvent.touches[0].pageX - this.offsetLeft, e.originalEvent.touches[0].pageY - this.offsetTop, true);
      main.redraw(clickX, clickY, clickDrag, color, false);
    }
    e.preventDefault();
  });

  $('#canvas').bind("touchend", function(e){
    paint = false;
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }
});


var main =
{
  redraw: function(clickX, clickY, clickDrag, color, fulldraw){
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = color;
    context.lineJoin = "round";
    context.lineWidth = 5;

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
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    rgb = [];

    for (var i = 0; i < 6; i+=2) {

			   rgb.push(parseInt(color.substring(i+1, i+3),16));
			   //fail = fail || rgb[rgb.length - 1].toString() === 'NaN';
		}

    hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return hsl;
}


function rgbToHsl(r, g, b){
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) { h = s = 0; }
	else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

  if(l>0.5)l=0.4; //make sure it isnt too light

	//return [(h*100+0.5)|0, ((s*100+0.5)|0) + '%', ((l*100+0.5)|0) + '%'];
  return "hsl("+Math.floor(h*360)+", "+Math.floor(s*100)+"%, "+Math.floor(l*100)+"%)";

}
