(function () {
  var score_limit = 10,
    scores = [0, 0],
    server = 0,
    won = false,
    el_scores = [document.querySelector('#score-1'), document.querySelector('#score-2')],
    el_scores_serv = [document.querySelector('#score-1-serving'), document.querySelector('#score-2-serving')];

  function change_score(player, delta) {
    var _player = player - 1,
      total_score = 0;

    won = false;

    if (scores[_player] < 1 && delta < 0) {
      scores[_player] = 0;
    } else {
      scores[_player] += delta;
    }

    el_scores[0].innerText = scores[0];
    el_scores[1].innerText = scores[1];

    if (server == 0) {
      draw_server_buttons();
      return;
    }

    total_score = scores[0] + scores[1];
    if (scores[0] < score_limit || scores[1] < score_limit) {
      // determine normal winner
      if (scores[0] > score_limit && scores[1] < score_limit) {
        won = true;
        draw_winner(1);
      } else if (scores[1] > score_limit && scores[0] < score_limit) {
        won = true;
        draw_winner(2);
      }

      // determine server
      if (!won) {
        draw_server(Math.floor(total_score / 2) % 2 == (server - 1) ? 1 : 2);
      }
    } else {
      // determine winner when above score limit (2 points ahead)
      if (scores[0] - scores[1] > 1) {
        won = true;
        draw_winner(1);
      } else if (scores[1] - scores[0] > 1) {
        won = true;
        draw_winner(2);
      }

      // determine server (when above score limit, 1 serve each)
      if (!won) {
        console.log('server..',total_score % 2,server - 1);
        draw_server(total_score % 2 == (server - 1) ? 1 : 2);
      }
    }
  }

  function draw_winner(winner) {
    el_scores_serv[0].innerText = (winner == 1 ? 'Winner' : 'Loser');
    el_scores_serv[0].classList.add(winner == 1 ? 'winner' : 'loser');

    el_scores_serv[1].innerText = (winner == 2 ? 'Winner' : 'Loser');
    el_scores_serv[1].classList.add(winner == 2 ? 'winner' : 'loser');
  }

  function draw_server(server) {
    el_scores_serv[0].classList.remove('winner');
    el_scores_serv[0].classList.remove('loser');
    el_scores_serv[0].innerText = (server == 1 ? 'Serving' : '');

    el_scores_serv[1].classList.remove('winner');
    el_scores_serv[1].classList.remove('loser');
    el_scores_serv[1].innerText = (server == 2 ? 'Serving' : '');
  }

  function draw_server_buttons() {
    var btn1 = document.createElement('button');
    btn1.classList.add('block');
    btn1.innerText = 'Select Server';
    bind(btn1, 'click', function () {
      server = 1;
      change_score(1, 0); // re-init
    });
    el_scores_serv[0].innerHTML = '';
    el_scores_serv[0].appendChild(btn1);

    var btn2 = document.createElement('button');
    btn2.classList.add('block');
    btn2.innerText = 'Select Server';
    bind(btn2, 'click', function () {
      server = 2;
      change_score(1, 0); // re-init
    });
    el_scores_serv[1].innerHTML = '';
    el_scores_serv[1].appendChild(btn2);
  }

  function bind(element, event, handler) {
    element.addEventListener(event, handler);
  }

  bind(document.querySelector('#score-1-up'), 'click', function () {
    if (server == 0 || won) {
      return;
    }
    change_score(1, 1);
  });

  bind(document.querySelector('#score-1-down'), 'click', function () {
    if (server == 0) { // must allow going back incase win was wrong
      return;
    }
    change_score(1, -1);
  });

  bind(document.querySelector('#score-2-up'), 'click', function () {
    if (server == 0 || won) {
      return;
    }
    change_score(2, 1);
  });

  bind(document.querySelector('#score-2-down'), 'click', function () {
    if (server == 0) { // must allow going back incase win was wrong
      return;
    }
    change_score(2, -1);
  });

  bind(document.querySelector('#reset-score'), 'click', function () {
    scores = [0, 0];
    server = 0;
    change_score(1, 0); // re-init
  });

  bind(document.querySelector('#score-limit'), 'change', function () {
    score_limit = this.value;
  });

  change_score(1, 0); // init the board
})();
