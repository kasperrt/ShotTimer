var socket = io("https://etys.no:3000");
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
    window.location = "https://zoff.me";
  });

  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var maybePreventPullToRefresh = false;
  var color = getRandomColor();
  var drawing = false;
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
    return color;
}
