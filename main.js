var toggled, interval, date, reset;
var players = Array();
var interval;
var col = ["0","2","4","5","7","9","A","C","D","F"];
col.reverse();
var a = col.length-1;
var b = a;
bytter = 0;
var snd = new Audio("sound/bell.mp3"); // buffers automatically when created
var togg;

window.addEventListener("load", function(){
	document.getElementById("thing").addEventListener("click", function(){
		togg = !togg;
		if(togg){
			document.getElementById("display-area").style.cssText = "visibility:hidden;";
		}else document.getElementById("display-area").style.cssText = "visibility:visible;";
	});
});

function addDeltaker(form){
	name = form.name.value;
	if(name != "" && name != " " && name != "  " && name != "   "){
		players.push(capitaliseFirstLetter(name));
		if(!interval && players.length >= 2){
			dateNow = new Date();
			newTimer();
			interval = window.setInterval(update_time, 1);
		}
		document.getElementById("players").innerHTML = "Players:<br>"+players.join(", ");
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
	if(minutes < 0){
		newTimer();
		rng = Math.floor(Math.random() * players.length);
		document.getElementById("previous").innerHTML = "Your turn to drink "+players[rng]+"!";
		snd.play();
		setTimeout(function(){
			document.getElementById("previous").innerHTML = "Previous drinker: "+players[rng];
		}, 10000)
	}
	document.getElementById("display-area").innerHTML = pad(minutes, 2)+":"+pad(seconds, 2)+"."+pad(milli, 3);
}

function newTimer(){
	dateNow = new Date();
	fDate = new Date(dateNow.getYear()+1900, dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes()+10, dateNow.getSeconds(), dateNow.getMilliseconds());
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