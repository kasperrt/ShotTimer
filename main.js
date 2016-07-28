var toggled, interval, date, reset;
var players = Array();
var players_all = Array();
var interval;
var col = ["0","2","4","5","7","9","A","C","D","F"];
col.reverse();
var a = col.length-1;
var b = a;
bytter = 0;
var snd = new Audio("sound/bell.mp3"); // buffers automatically when created
var togg;
var times = 0;
var show = true;
var fair_game = true;
var previous_drinker = "";
var sound_on = true;
var zoffWindow;


//responsiveVoice.setDefaultVoice("US English Male");

window.addEventListener("load", function(){

	document.getElementById("thing").addEventListener("click", function(){
		/*togg = !togg;
		if(togg){
			document.getElementById("display-area").style.cssText = "visibility:hidden;";
		}else document.getElementById("display-area").style.cssText = "visibility:visible;";*/
	});

	document.getElementById("check-count").addEventListener("change", function(){
		show = this.checked;
		val = show ? "visible" : "hidden";
		/*document.getElementById("display-area").style.cssText = "visibility:"+val+";"; */
	});

	document.getElementById("fair-game").addEventListener("change", function(){
		fair_game = !fair_game;
	});

	document.getElementById("sound").addEventListener("change", function(){
		sound_on = !sound_on;
	});

	document.getElementById("zofform").addEventListener("submit", function(e){
		e.preventDefault();

		var channel    = document.getElementById("zoffchannel").value;
		zoffWindow     = window.open("http://zoff.no/embed.html#" + channel + "&autoplay", "", "width=600, height=300");
	});

	document.getElementById("playerform").addEventListener("submit", function(e){
		e.preventDefault();

		addDeltaker(this);
	});

	if(!isSecure()) {
		Materialize.toast("Click this if you want microphone and visualizer!", 5000);
	}

});

//Dynamic listener

$(document).on('click', '#toast-container', function(){
	window.location.href = 'https://etys.no';
    $(this).fadeOut(function(){
	    $(this).remove();
	});
});

function isSecure(){
   return window.location.protocol == 'https:';
}

function addDeltaker(form){
	name = form.name.value;
	if(name != "" && name != " " && name != "  " && name != "   "){
		if(fair_game) {
			players_all.push(capitaliseFirstLetter(name));
			players.push(capitaliseFirstLetter(name));
			players.push(capitaliseFirstLetter(name));
			players.push(capitaliseFirstLetter(name));
		} else {
			players.push(capitaliseFirstLetter(name));
		}
		if(!interval && ((players.length >= 2 && !fair_game) || (players_all.length >= 2 && fair_game))){
			dateNow = new Date();
			newTimer();
			interval = window.setInterval(update_time, 1);
			document.getElementById("fairgame-div").style.display = "none";
		}
		if(fair_game){
			document.getElementById("players").innerHTML = "Players:<br>"+players_all.join(", ");
		} else {
			document.getElementById("players").innerHTML = "Players:<br>"+players.join(", ");
		}
		document.getElementById("players").style.paddingBottom = "9.5px";
		document.getElementById("players").style.paddingTop = "9.5px";
		form.name.value = "";
	}else alert("Please enter a name..");
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
		document.getElementById("previous").innerHTML = "Your turn to drink "+players[rng]+"!";
		previous_drinker = players[rng];
		lowerVolume();
		responsiveVoice.speak("Your turn to drink " + players[rng], "US English Male", {onend: endtalk});
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
	if(sound_on) snd.play();
    flash=0;
    setTimeout("lightning()",1);
	setTimeout(function(){
		document.getElementById("previous").innerHTML = "Previous drinker: "+previous_drinker;
        flash=7;
        if(sound_on) snd.pause();
        document.getElementById("bgimage").style.backgroundColor='white';
	}, 10000);
}

function lowerVolume(){
	if(zoffWindow !== undefined) zoffWindow.postMessage("lower", "https://zoff.no");
}

function resetVolume() {
	if(zoffWindow !== undefined) zoffWindow.postMessage("reset", "https://zoff.no");
}

function newTimer(){
	dateNow = new Date();
	fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes()+Math.floor(Math.random()*6)+1, dateNow.getSeconds(), dateNow.getMilliseconds());
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
    if(flash==1){document.getElementById("bgimage").style.backgroundColor='red'; setTimeout("lightning()",85);}
    if(flash==2){document.getElementById("bgimage").style.backgroundColor='blue'; setTimeout("lightning()",80);}
    if(flash==3){document.getElementById("bgimage").style.backgroundColor='purple'; setTimeout("lightning()",75);}
    if(flash==4){document.getElementById("bgimage").style.backgroundColor='yellow'; setTimeout("lightning()",75);}
    if(flash==5){document.getElementById("bgimage").style.backgroundColor='green'; setTimeout("lightning()",75);}
    if(flash==6){flash=0; setTimeout("lightning()",1);}
}


window.onload = function () {

	//Shamelessly stolen from http://codepen.io/zapplebee/pen/gbNbZE

    "use strict";
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementsByTagName('mask')[0];
    var h = document.getElementsByTagName('h1')[0];
    var path;
    var report = 0;
    
    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        visualizer.setAttribute('viewBox', '0 0 255 100');
      
				//Through the frequencyArray has a length longer than 255, there seems to be no
        //significant data after this point. Not worth visualizing.
        for (var i = 0 ; i < 255; i++) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke-dasharray', '4,1');
            mask.appendChild(path);
        }
        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
          	var adjustedLength;
            for (var i = 0 ; i < 255; i++) {
              	adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
            }

        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        console.log(error);
        document.getElementsByTagName("svg")[0].style.display = "none";
    }

    /*window.navigator = window.navigator || {};
    navigator.mediaDevices.getUserMedia =  navigator.mediaDevices.getUserMedia       ||
                              navigator.mediaDevices.webkitGetUserMedia ||
                              navigator.mediaDevices.mozGetUserMedia    ||
                              null;*/
   	navigator.webkitGetUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};