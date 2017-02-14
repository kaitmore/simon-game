$(document).ready(function() {

  var game = {
    round: 0,
    count: 0,
    turn: false,
    colors: ['#red', '#green', '#blue', '#yellow'],
    sequence: [],
    sound: {
      blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    },
    strict: false
  };

  function clearGame() {
    game.sequence = [];
    game.round = 0;
    game.count = 0;
    game.turn = false;
    setTimeout(function() {
      $('.info').html('<span id ="start">start</span>');
    }, 2000);
  }

  function generateSequence() {
    var random = Math.floor((Math.random() * 4));
    var nextColor = game.colors[random];
    game.sequence.push(nextColor);
  }

  function computerGo() {
    var intervalID = setInterval(function() {
      var id = $(game.sequence[game.count]);
      var color = game.sequence[game.count].slice(1);
      var highlight = color + "Highlight";
      var sound = game.sound[color];
      sound.play();
      id.removeClass(color).addClass(highlight);
      setTimeout(function() {
        id.removeClass(highlight).addClass(color);
      }, 500);
      //If the current round count equals the round, 
        //that means the round is complete
      if (game.count == game.round) {
        console.log("end of computer round");
        game.count = 0;
        game.turn = true;
        $('.info').css("color","#000").animate({fontSize: "42px"}, function(){ $('.info').animate({fontSize: "28px"}) });
        clearInterval(intervalID);
      } else {
        //Else, increment the count and keep going
        ++game.count;
      }
    }, 1000);

  }

 
  $('.color').click(function() {
    //If game turn is true, then highlight and play sounds on click
    if (game.turn) {
      var circle = $(this);
      var id = this.id;
      var highlight = id + "Highlight";
      circle.removeClass(id).addClass(highlight);
      var sound = game.sound[id];
      sound.play();
      setTimeout(function() {
        circle.removeClass(highlight).addClass(id);
      }, 500);
      //Check that each click matches the computer's sequence
      if ("#" + id != (game.sequence[game.count])) {
        //If it doesn't, and we're in strict mode, Game Over
        if (game.strict) {
          console.log("Game over!");
          $('.info').html("<span id ='no'>Game over</span>");
          clearGame();
          return;
        //Else if we're not in strict mode, reset the count, set person turn 
          //to false, don't increment the round, and call the 
          //computer function which will repeat the current round
        } else {
          game.count = 0;
          game.turn = false;
          console.log("Try again");
          $('.info').html("<span id ='no'>Try again</span>");
          setTimeout(function() {
            $('.info').text(game.round + 1).css("color","#F93B47");
            computerGo();
          }, 1000);
          return;
        }
      }
      //If the count is equal to the round, the person has gotten to the 
       //end of the round without a mistake
      if (game.count == game.round) {
        console.log("End of person round.");
       //If the round is 19, the game is won
        if (game.round === 19) {
          console.log("You win! Game over.");
          $('.info').html("Win!");
          setTimeout(function() {
          clearGame();
             }, 2000);
          return;
        }
        game.count = 0;
        ++game.round;
        game.turn = false;
        generateSequence();
        setTimeout(function() {
          $('.info').html(game.round + 1).css("color","#F93B47");
          computerGo();

        }, 1000);
        console.log(game.sequence);
        //Else if it's not the end of the round, increment count
      } else {
        ++game.count;
      }
    }
  }); // EO playerMove

  $('.info').on('click', '#start', function() {
    generateSequence();
    computerGo();
    $('.info').html(game.round + 1).css("color","#F93B47");
  });
  
  $('#strictmode').click(function() {
    if (!game.strict) {
      game.strict = true;
    } else {
      game.strict = false;
    }
  });

}); //end of document