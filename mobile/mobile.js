var socket = io("http://etys.no:3000");

window.addEventListener("load", function(){
  document.getElementById("playerform").addEventListener("submit", function(e){
		e.preventDefault();

		socket.emit("join", {id: window.location.search.substring(1), name: this.name.value});
    document.getElementsByClassName("valign")[0].innerHTML = "<div style='text-align:center;font-size:4rem;'>You have joined the game!</span>";
    socket.disconnect();
		//window.location = "https://zoff.no";
	});
});
