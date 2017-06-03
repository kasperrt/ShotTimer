var toggled;
var interval;
var date;
var reset;
var players = Array();
var players_all = Array();
var interval;
var snd = new Audio("sound/bell.mp3"); // buffers automatically when created
var sanic = new Audio("sound/sanic.mp3");
var togg;
var times = 0;
var show = true;
var fair_game = true;
var previous_drinker = "";
var sound_on = true;
var zoffWindow;
var id = "";
var drawings = {};
var player_names = [];
var deltager_identifiers = {};
var current_deltager_id = 0;
var socket = io("https://etys.no:3000");

socket.on("joined", function(obj){
	addDeltaker({name: {value: obj._name}, drawing: obj._drawing});
});

socket.on("id", function(_id){
	id = encodeURI("?" + _id);
	document.getElementById("qr_container").innerHTML = "<img src='https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=http://etys.no/m/" + id + "&choe=UTF-8&chld=L%7C1' alt='qr' />";
	document.getElementById("qr_container").style.opacity = 1;
	$("#link_join").text("Join link: https://etys.no/m/" + id);
});
socket.emit("host");

window.addEventListener("load", function(){
	sanic.volume = 0.2;
	$(".button-collapse").sideNav({
		menuWidth: 300, // Default is 300
	});
	$("#thing").on("click", function() {
		/*togg = !togg;
		if(togg){
			document.getElementById("display-area").style.cssText = "visibility:hidden;";
		}else document.getElementById("display-area").style.cssText = "visibility:visible;";*/
	});

	$("#check-count").on("change", function() {
		show = this.checked;
		val = show ? "visible" : "hidden";
		/*document.getElementById("display-area").style.cssText = "visibility:"+val+";"; */
	});

	$("#fair-game").on("change", function() {
		fair_game = !fair_game;
	});

	$("#sound").on("change", function() {
		sound_on = !sound_on;
	});

	$("#zofform").on("submit", function(e) {
		e.preventDefault();

		var channel    = $("#zoffchannel").val();
		$("#zoffchannel").val("");
		if(channel == ""){
			$("#iframe_container").html("");
		} else {
			//zoffWindow     = window.open("http://zoff.no/embed.html#" + channel + "&71C387&autoplay", "", "width=600, height=400");
			$("#iframe_container").html("<iframe id='iframe' src='https://zoff.me/_embed#" + channel + "&71C387&autoplay&videoonly' onload='postMessageZoff()'></iframe>");
			zoffWindow = document.getElementById('iframe').contentWindow;
			$("#zofform").toggleClass("hide");
			$(".stop_zoff").toggleClass("hide");
		}
		/*document.getElementById("qr_container").style.display = "block";
		document.getElementById("zofform_container").style.display = "none";
		document.getElementById("zofform").style.display = "none";*/
		document.getElementById("inp").focus();
	});

	$(".stop_zoff").on("click", function(e) {
		e.preventDefault();
		$("#iframe_container").html("");
		$(".stop_zoff").toggleClass("hide");
		$("#zofform").toggleClass("hide");
		if(!$(".now_playing").hasClass("hide")) {
			$(".now_playing").addClass("hide");
		}
		delete zoffWindow;
	});



	/*document.getElementById("qr_container").addEventListener("click", function(){
		document.getElementById("qr_container").style.display = "none";
		document.getElementById("zofform_container").style.display = "flex";
		document.getElementById("zofform").style.display = "block";
		document.getElementById("zoffchannel").focus();
	});*/

	document.getElementById("playerform").addEventListener("submit", function(e){
		e.preventDefault();

		addDeltaker(this);
	});

	window.addEventListener("message", receiveMessage, false);
});

function postMessageZoff() {
	zoffWindow.postMessage("parent", "https://zoff.me");
}

//Dynamic listener

function receiveMessage(event) {
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
	if(event.data.title) {
	  $("#now_playing_title").text(event.data.title);
		$(".now_playing").removeClass("hide");
	}
  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}

$(document).on('click', '#toast-container', function(){
	window.location.href = 'https://etys.no';
    $(this).fadeOut(function(){
	    $(this).remove();
	});
});

function addDeltaker(form){
	name = form.name.value;
	if(name != "" && name != " " && name != "  " && name != "   "){
		if(form.drawing) {
			drawings[current_deltager_id] = form.drawing;
		}
		if(fair_game) {
			players_all.push(current_deltager_id);
			players.push(current_deltager_id);
			players.push(current_deltager_id);
			players.push(current_deltager_id);
			/*players_all.push(capitaliseFirstLetter(name));
			players.push(capitaliseFirstLetter(name));
			players.push(capitaliseFirstLetter(name));
			players.push(capitaliseFirstLetter(name));*/
		} else {
			//players.push(capitaliseFirstLetter(name));
			players.push(current_deltager_id);
		}
		player_names.push(capitaliseFirstLetter(name));
		deltager_identifiers[current_deltager_id] = capitaliseFirstLetter(name);
		if(!interval && ((players.length >= 1 && !fair_game) || (players_all.length >= 1 && fair_game))){
			dateNow = new Date();
			newTimer();
			interval = window.setInterval(update_time, 1);
			document.getElementById("fairgame-div").style.display = "none";
		}
		document.getElementById("players").innerHTML = "Players:<br>"+player_names.join(", ");
		document.getElementById("players").style.paddingBottom = "9.5px";
		document.getElementById("players").style.paddingTop = "9.5px";
		current_deltager_id += 1;
		form.name.value = "";
	} else alert("Please enter a name..");
}

function update_time(){
	curr = new Date();
	seconds = (Math.floor((fDate-curr)/1000) - Math.floor(((fDate-curr)/1000)/60) * 60);
	minutes = Math.floor(((fDate-curr)/1000)/60), 2;
	milli = fDate-curr-(seconds*1000)-(minutes*60*1000);
    if((minutes == 0 && seconds < 10) || show){
        document.getElementById("display-area").style.cssText = "visibility:visible;";
    }else if(minutes > 0){
        document.getElementById("display-area").style.cssText = "visibility:hidden;";
    }
	if(minutes < 0){
		newTimer();
		rng = Math.floor(Math.random() * players.length);
		document.getElementById("previous").innerHTML = "Your turn to drink "+deltager_identifiers[players[rng]]+"!";
		previous_drinker = deltager_identifiers[players[rng]];
		lowerVolume();
		responsiveVoice.speak("Your turn to drink " + deltager_identifiers[players[rng]], "US English Male", {onend: endtalk});
		$("#canvas").remove();
		if(drawings[players[rng]]) {
			$("#qr_container").append("<canvas id='canvas' height=\"" + drawings[players[rng]][3] + "\" width=\"" + drawings[players[rng]][4] + "\"></canvas>");
			context = document.getElementById("canvas").getContext("2d");
			main.redraw(drawings[players[rng]][0], drawings[players[rng]][1], drawings[players[rng]][2], drawings[players[rng]][5], true);
		}
		if(fair_game){
			players.splice(rng, 1);
			if(players.length == 0) {
				for(x in players_all) {
					players.push(players_all[x]);
					players.push(players_all[x]);
					players.push(players_all[x]);
				}
			}
		}
	}
	document.getElementById("display-area").innerHTML = pad(minutes, 2)+":"+pad(seconds, 2)+"."+pad(milli, 3);
}

function endtalk(){
	responsiveVoice.cancel();
	resetVolume();
	var sanicRandom = Math.floor((Math.random() * 10000) + 1);
	if(sound_on) {
		if(sanicRandom == 137) {
			sanic.play();
		} else {
			snd.play();
		}
	}
    flash=0;
    setTimeout("lightning()",1);
		setTimeout(function(){
		document.getElementById("previous").innerHTML = "Previous drinker: "+previous_drinker;
		//$("#canvas").remove();
        flash=7;
        if(sound_on) {
					if(sanicRandom == 137) {
						sanic.pause();
						sanic.currentTime = 0;
					} else {
						snd.pause();
						snd.currentTime = 0;
					}
				}
        document.getElementById("container").style.background = "rgba(255,255,255,0.95)"
	}, 10000);
}

function lowerVolume(){
	if(zoffWindow !== undefined) zoffWindow.postMessage("lower", "https://zoff.me");
}

function resetVolume() {
	if(zoffWindow !== undefined) zoffWindow.postMessage("reset", "https://zoff.me");
}

function newTimer(){
	dateNow = new Date();
	if($("#interval").prop("checked")) {
		var intervalNumber = parseInt($("#intervalnumber").val());
		if(intervalNumber <= 0) intervalNumber = 1;
		fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes()+intervalNumber, dateNow.getSeconds(), dateNow.getMilliseconds());
	} else {
		fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes()+Math.floor(Math.random()*6)+1, dateNow.getSeconds(), dateNow.getMilliseconds());
	}//fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds() + 10, dateNow.getMilliseconds());
}

function pad(t, num){
	if(num == 2) out = t < 10 ? "0"+t : t;
	else if(num == 3) out = t < 10 ? "00"+t : t < 100 ? "0"+t : t;
	return out;
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


var flash=0
function lightning()
{
    flash=flash+1;
    if(flash==1){document.getElementById("container").style.backgroundColor='red'; setTimeout("lightning()",85);}
    if(flash==2){document.getElementById("container").style.backgroundColor='blue'; setTimeout("lightning()",80);}
    if(flash==3){document.getElementById("container").style.backgroundColor='purple'; setTimeout("lightning()",75);}
    if(flash==4){document.getElementById("container").style.backgroundColor='yellow'; setTimeout("lightning()",75);}
    if(flash==5){document.getElementById("container").style.backgroundColor='green'; setTimeout("lightning()",75);}
    if(flash==6){flash=0; setTimeout("lightning()",1);}
}


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
