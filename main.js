var interval;
var players = Array();
var players_all = Array();
var interval;
var snd = new Audio("sound/bell.mp3"); // buffers automatically when created
var sanic = new Audio("sound/sanic.mp3");
var title_timeout;
var intervalNumber = 0;
var show = true;
var fair_game = true;
var previous_drinker = "";
var sound_on = true;
var zoffWindow;
var id = "";
var drawings = {};
var right = true;
var show_score = true;
var deltager_identifiers = {};
var current_deltager_id = 0;
var scoreboard = [];
var socket = io.connect(window.location.protocol + "//" + window.location.hostname + ":3000", {
	secure: window.location.protocol.indexOf("https") > -1 ? true : false
});

socket.on("joined", function(obj){
	addDeltaker({name: {value: obj._name}, drawing: obj._drawing});
});

socket.on("id", function(_id){
	id = encodeURI(_id);
	document.getElementById("qr_container").innerHTML = "<img src='https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=" + window.location.protocol + "//" + window.location.host + "/m/" + id + "&choe=UTF-8&chld=L%7C1' alt='qr' />";
	document.getElementById("qr_container").style.opacity = 1;
	$("#link_join").html("Join link: " + window.location.protocol + "//" + window.location.host + "/m/<span id='join_id'>" + id + "</span>");
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

	$("#show-score").on("change", function() {
		show_score = this.checked;
		if(show_score) {
			$(".scoreboard-container").removeClass("invisible");
		} else {
			if(!$(".scoreboard-container").hasClass("invisible")) {
				$(".scoreboard-container").addClass("invisible");
			}
		}
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
			window.postMessageZoff = postMessageZoff;
			$("#iframe_container").html("<iframe id='iframe' src='https://zoff.me/api/embed/?channel=" + channel + "&color=71C387&autoplay=true&videoonly=true&control=true&localmode=false' onload='postMessageZoff()' allow='autoplay'></iframe>");
			zoffWindow = document.getElementById('iframe').contentWindow;
			//zoffWindow.onload = postMessageZoff;
			$("#zofform").toggleClass("hide");
			$(".stop_zoff").toggleClass("hide");
			$(".controller-container").toggleClass("hide");
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
		if(!$(".controller-container").hasClass("hide")) {
			$(".controller-container").addClass("hide");
			$("#controller_id").html("");
		}
		$(".durationBar").css("width", "0vw");
		delete zoffWindow;
		zoffWindow = false;
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

	$(document).on("click", ".player-remove-name", function(e) {
		e.preventDefault();
		var to_remove_id = parseInt(this.id.split("-")[1]);
		if(players.length > 1 && players_all.length > 1 && !$("#score-" + to_remove_id).hasClass("remove-left")) {
			var next_element = $("#score-" + to_remove_id).next();
			next_element.animate({
		    marginTop: '-22px',
		  }, 400, "linear", function() {
		  });
			players = removeAll(players, to_remove_id);
			players_all = removeAll(players_all, to_remove_id);
			$("#score-" + to_remove_id).addClass("remove-left");
			delete deltager_identifiers[to_remove_id];
			delete drawings[to_remove_id];
			var scoreboard_id = scoreboard.find(function(scores) {
				if(scores !== undefined) return scores.id === to_remove_id;
				else return false;
			});
			scoreboard.splice(scoreboard.indexOf(scoreboard_id), 1);
			setTimeout(function() {
				next_element.css("margin-top", "0px");
				$("#score-" + to_remove_id).remove();
			}, 500);
		} else if(!$("#score-" + to_remove_id).hasClass("remove-left")){
	    $(".toast").remove();
			Materialize.toast("You can't delete a player when that player is the only possible next drinker..!", 3000);
		}
	});

	window.addEventListener("message", receiveMessage, false);
});

function removeAll(array, elem) {
	var filtered = array.filter(function(element) {
			return element !== elem;
	}); // filtered contains no occurrences of hello
	return filtered;
}

function postMessageZoff() {
	zoffWindow.postMessage("parent", "https://zoff.me");
	setTimeout(function(){
		zoffWindow.postMessage("get_info", "https://zoff.me");
	}, 1000);
}

//Dynamic listener

function receiveMessage(event) {
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
	if(event.data.type == "np") {
	  $("#now_playing_title").text(event.data.title);
		$(".now_playing").removeClass("hide");
		if(event.data.title == "" || event.data.title == undefined) {
			clearTimeout(title_timeout);
			title_timeout = setTimeout(function() {
				console.log("trying again");
				zoffWindow.postMessage("get_info", "https://zoff.me");
			}, 1000);
		}
	} else if(event.data.type == "duration") {
		$(".durationBar").css("width", event.data.percent + 1 + "vw");
	} else if(event.data.type == "nextVideo") {
		$("#next_title").text(event.data.title);
		$(".now_playing").removeClass("hide");
	} else if(event.data.type == "controller") {
		$(".controller-container").removeClass("hide");
        if(event.data.id == null) return;
		$("#controller_id").html(event.data.id.toUpperCase());
	}
  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}

$(document).on('click', '#toast-container', function(){
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
		//if(fair_game) {
			players_all.push(current_deltager_id);
			players.push(current_deltager_id);
			players.push(current_deltager_id);
			players.push(current_deltager_id);
		/*} else {
			players.push(current_deltager_id);
		}*/
		deltager_identifiers[current_deltager_id] = capitaliseFirstLetter(name);
		if(!interval && players_all.length > 0){
			$(".scoreboard").empty();
			dateNow = new Date();
			newTimer();
			interval = window.setInterval(update_time, 1);
		}

		var drawing_add = "";
		if(form.drawing) {
			drawing_add = "<canvas id='canvas-" + current_deltager_id + "' class='player-icon' height=\"" + drawings[current_deltager_id][3] + "\" width=\"" + drawings[current_deltager_id][4] + "\"></canvas>";
		}
		$(".scoreboard").append('<li id="score-' + current_deltager_id + '" title="Click to remove the player" class="score-element player-remove-name">' + drawing_add + '<span class="name">' + capitaliseFirstLetter(name) + '</span><span class="score">0</span></li>');
		if(form.drawing) {
			context = document.getElementById("canvas-" + current_deltager_id).getContext("2d");
			redraw(drawings[current_deltager_id][0], drawings[current_deltager_id][1], drawings[current_deltager_id][2], drawings[current_deltager_id][5], true, 50);
		}
		scoreboard[current_deltager_id] = {};
		scoreboard[current_deltager_id].id = current_deltager_id;
		scoreboard[current_deltager_id].score = 0;
		scoreboard[current_deltager_id].html = '<li id="score-' + current_deltager_id + '" title="Click to remove the player" class="score-element player-remove-name">' + drawing_add + '<span class="name">' + capitaliseFirstLetter(name) + '</span><span class="score">0</span></li>';
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
		rng = fair_game ? rnd(players) : rnd(players_all);
		previous_drinker = deltager_identifiers[rng];
		document.getElementById("previous").innerHTML = "Your turn to drink "+previous_drinker+"!";
		lowerVolume();
		responsiveVoice.speak("Your turn to drink " + previous_drinker, "US English Male", {onend: endtalk});
		$("#canvas").remove();
		if(drawings[rng]) {
			$("#container").append("<canvas id='canvas' style='-webkit-animation: animation-" + (right ? "right" : "left") + " " + (intervalNumber * 60) + "s linear infinite;animation: animation-" + (right ? "right" : "left") + " " + (intervalNumber * 60) + "s linear infinite;' height=\"" + drawings[players[rng]][3] + "\" width=\"" + drawings[players[rng]][4] + "\"></canvas>");
			right = !right;
			context = document.getElementById("canvas").getContext("2d");
			redraw(drawings[rng][0], drawings[rng][1], drawings[rng][2], drawings[rng][5], true, 5);
		}

		scoreboard.find(function(scores) {
			return scores.id === rng;
		}).score += 1;


		scoreboard.sort(predicate({name: 'score', reverse: true}))
		update_scoreboard(scoreboard);
		if(fair_game){
			var index = players.indexOf(rng);
			players.splice(index, 1);
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
	var sanicRandom = Math.floor((Math.random() * 1000) + 1);
	if(sound_on) {
		if(sanicRandom == 137) {
			sanic.play();
		} else {
			snd.play();
		}
	}
    flash=0;
    setTimeout(lightning,1);
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
	if(zoffWindow !== undefined && zoffWindow) zoffWindow.postMessage("lower", "https://zoff.me");
}

function resetVolume() {
	if(zoffWindow !== undefined && zoffWindow) zoffWindow.postMessage("reset", "https://zoff.me");
}

function newTimer(){
	dateNow = new Date();
	$(".scoreboard-container").removeClass("hide");
	if($("#interval").prop("checked")) {
		intervalNumber = parseInt($("#intervalnumber").val());
		if(intervalNumber <= 0) intervalNumber = 1;
		fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes()+intervalNumber, dateNow.getSeconds(), dateNow.getMilliseconds());
	} else {
		intervalNumber = Math.floor(Math.random()*6)+1;
		fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes()+intervalNumber, dateNow.getSeconds(), dateNow.getMilliseconds());
		//fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds() + 15, dateNow.getMilliseconds());
	}//fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds() + 10, dateNow.getMilliseconds());
}

var flash=0
function lightning()
{
    flash=flash+1;
    if(flash==1){document.getElementById("container").style.backgroundColor='red'; setTimeout(lightning,85);}
    if(flash==2){document.getElementById("container").style.backgroundColor='blue'; setTimeout(lightning,80);}
    if(flash==3){document.getElementById("container").style.backgroundColor='purple'; setTimeout(lightning,75);}
    if(flash==4){document.getElementById("container").style.backgroundColor='yellow'; setTimeout(lightning,75);}
    if(flash==5){document.getElementById("container").style.backgroundColor='green'; setTimeout(lightning,75);}
    if(flash==6){flash=0; setTimeout(lightning,1);}
}

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
