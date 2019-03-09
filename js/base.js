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

    start_sim(playerList);

    event.preventDefault();
  });
});

function start_sim(playerList){
  var number_of_sims = 10;
  var total_runs_scored = 0;
  var sim_result = 0;
  for (i = 0; i < number_of_sims; i++) {
     total_runs_scored += processLineup(playerList);
     //total_runs_scored = 5;
  }
  sim_result = total_runs_scored/number_of_sims;
  console.log('runs_result='+sim_result);
}

function get_next_batter(previous_batter_num, total_batters){
  var next_batter = previous_batter_num + 1;
  if(next_batter>total_batters) {
    next_batter = 1;
  }
  return next_batter;
}

function processLineup(playerList) {
   var batter_num = 1;
   var outcome;
   var occupied_bases;
   var total_runs = 0;
   var outs = 0;
   var runs = 0;
   var total_innings = 9;
   var current_inning = 0;
   var OBA = 0;
   var cnt = 0;
   var at_bat_result = [];
   var current_state = "0";
   var total_batters = 9;

  for (i = 0; i < total_innings; i++) {
    outs = 0;
    cnt = 0;
    while (outs < 3) {
       previous_batter_num = batter_num;
       batter_num = get_next_batter(previous_batter_num, total_batters);
       arr_num = batter_num - 1; //Arrays start at 0
       //Temp hack
       player = playerList[arr_num]["name"];
       OBA = playerList[arr_num]["oba"];
       cnt++;
       if(cnt>40) { outs = 3; }
       //end Temp hack
       //console.log("XX oba="+OBA+"|outs="+outs+"|inning="+i+"|runs="+total_runs+"cnt="+cnt);
       outcome = get_batter_outcome(player, OBA);
       at_bat_result = process_outcome(outcome, current_state, outs);
       total_runs += at_bat_result['runs_scored'];
       outs = at_bat_result['outs'];
       occupied_bases = at_bat_result['new_state'];
       current_state = occupied_bases;
     }
   }
   return total_runs;
}
function process_outcome(outcome, current_state, outs) {
  var ret = new Object();
    if(outcome=="OUT") {
      ret['new_state'] = current_state;
      ret['outs'] = outs + 1;
      ret['runs_scored'] = 0;
    }
    if(outcome=="1B") {
      if(current_state=="0") {
        ret['new_state'] = "1";
        ret['outs'] = outs;
        ret['runs_scored'] = 0;
      }
      if(current_state=="1") {
        ret['new_state'] = "12";
        ret['outs'] = outs;
        ret['runs_scored'] = 0;
      }
      if(current_state=="12") {
        ret['new_state'] = "12";
        ret['outs'] = outs;
        ret['runs_scored'] = 1;
      }
      if(current_state=="123") {
        ret['new_state'] = "12";
        ret['outs'] = outs;
        ret['runs_scored'] = 2;
      }
    }
   return ret;
}
function get_batter_outcome(player, OBA){
    var rchance = Math.floor(Math.random() * 1000);
    //console.log("rchance="+rchance+"|OBA="+OBA);
    if(rchance <= (OBA*1000)) {
      var ret = "1B";
      //console.log('HIT!!');
    } else {
      var ret = "OUT";
    }
  return ret;
}
