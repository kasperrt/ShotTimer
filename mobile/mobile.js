var socket = io("http://etys.no:3000");

window.addEventListener("load", function(){
  document.getElementById("playerform").addEventListener("submit", function(e){
		e.preventDefault();

		socket.emit("join", {id: window.location.search.substring(1), name: this.name.value})
		window.location = "https://zoff.no";
	});	
});