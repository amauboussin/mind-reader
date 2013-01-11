
//tracking variables
var submitted_guesses = 0;
var this_five_wins = 0;
var round_n = 1;

var game_active = true; 
var threshold = 50; //playing to this number of wins
var min_buffer_size = 1; //must be at least one
var max_buffer_size = 8;


var computer_wins = 0;
var player_wins = 0;
    
var history = "";


$("#reset-button").on("click", function(){
    reset_game()
}) 

$("#zero-button").on("click", function(){
    submitGuess(0);
}) 

$("#one-button").on("click", function(){
    submitGuess(1);
}) 

// event listener that gets 0 (left arrow) or 1 (right arrow)
document.addEventListener('keydown', function(event) {
    if (game_active){
        if(event.keyCode == 37 || event.keyCode == 48) {
            submitGuess(0);
        }
        else if(event.keyCode == 39 || event.keyCode == 49) {
            submitGuess(1);
        }
    }
});

/** Function to count the occurrences of substring in a string;
 * by Vitim.us on stack overflow
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
function occurrences(string, subString, allowOverlapping){

    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}


//function that determines how many votes a pattern of length x is worth
function get_votes(n){
    //parabolic function
    //return -.4*Math.pow((x-3),2)+5;
    //gaussian function
    e = 2.71828
    power = -(  Math.pow((n-4.0),2.0) / (2.0*Math.pow(2.0,2.0)) )
    return Math.pow(e,power);
}

function submitGuess (guess){


    var votes_0 = 0;
    var votes_1 = 0;
    
    for (n=min_buffer_size-1; n<max_buffer_size; n++)
    {
        //get the last n characters that occurred
        var last_n = ""
        if (n!=0){
            last_n = history.slice(history.length-n, history.length);
        }

        //count occurences of each pattern
        var zero = occurrences(history, last_n+"0", true);
        var one = occurrences(history, last_n+"1", true);

        if (zero > one){
            votes_0+=zero/(zero+one)*get_votes(n);}
        if (one>zero){
            votes_1+=one/(zero+one)*get_votes(n);}
    }
    var prediction;
    if (votes_0 > votes_1){
        prediction = 0;}
    else if (votes_1 > votes_0){
        prediction = 1;}
    else {
        prediction = Math.floor(Math.random()*2);}


    //now that the prediction is all set, time to look at the guess and see if the program was right

    //update progress bar and counts for winner
    if (prediction==guess){
        computer_wins++;
        this_five_wins++;
        document.getElementById('c-progress').innerHTML = "<div class=\"bar\" style=\"width: "+computer_wins*100/threshold+"%;\"></div>";
    }
    else {
        player_wins++;
        document.getElementById('p-progress').innerHTML = "<div class=\"bar\" style=\"width: "+player_wins*100/threshold+"%;\"></div>";
    }

    history += guess.toString(); //add to the history


    if (submitted_guesses != 0 &&  submitted_guesses % 5 == 0)
    {
        _gaq.push(['_trackEvent', 'Mind Reader Results', 'Round '+round_n, (history.slice(-5)), this_five_wins]);
        this_five_wins = 0;
        round_n++;
        
    }

    submitted_guesses ++; 

    //check if anyone won

    if (computer_wins == threshold)
        gameover(true);
    if (player_wins == threshold)
        gameover(false);
}
//game over
function gameover(computer_won){

    $('#game-results').removeAttr("style");

    if (computer_won){
        $('#game-results').attr("class", "span6 alert alert-error");
        $('#results-message').html("<h3>You lost "+player_wins+" to "+computer_wins+"!</h3>");
    }

    else{
        $('#game-results').attr("class", "span6 alert alert-success");
        $('#results-message').html("<h3>You won "+player_wins+" to "+computer_wins+"!</h3>");

    }

    game_active = false;
}

function reset_game(){

    $('#game-results').attr("style", "display: none;")

    computer_wins = 0;
    player_wins = 0;    
    history = "";
    game_active = true;

    round_n = 0;
    submitted_guesses = 0;
    this_five_wins = 0;

    document.getElementById('c-progress').innerHTML = "<div class=\"bar\" style=\"width: 0%;\"></div>";
    document.getElementById('p-progress').innerHTML = "<div class=\"bar\" style=\"width: 0%;\"></div>";

}
