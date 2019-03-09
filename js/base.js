$(document).ready(function() {
  $( "form" ).submit(function( event ) {

    var playerList = [];
    $("form .player-name").each(function(index){
      var player = {};
      player["position"] = index+1;
      player["name"] = $(this).val(); // This is the jquery object of the input, do what you will
      player["oba"] = $(".player-oba:eq(" + index + ")").val();
      playerList.push(player);
    });

    processLineup(playerList);

    event.preventDefault();
  });
});


function processLineup(playerList) {
  alert('made it here');
  alert(playerList.length);
  
}
