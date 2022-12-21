const playerX = { name: "PlayerX", score: 0 };
const playerO = { name: "PlayerO", score: 0 };
let drawScore = 0;

// check if game is not setup
if (!sessionStorage.playerX_data && !sessionStorage.playerO_data) {
    document.getElementById("game-setup-container").classList.remove('hidden');
}
else {
    document.getElementById("game").classList.remove('hidden');
    if (sessionStorage.playerX_data) {
        playerX.name = JSON.parse(sessionStorage.playerX_data).name;
        playerX.score = JSON.parse(sessionStorage.playerX_data).score;
    }
    if (sessionStorage.playerO_data) {
        playerO.name = JSON.parse(sessionStorage.playerO_data).name;
        playerO.score = JSON.parse(sessionStorage.playerO_data).score;
    }
    if (sessionStorage.draw_score) {
        drawScore = JSON.parse(sessionStorage.draw_score);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateTurnText(playerX);
    updateNameTexts();
    updateScoreTexts();
});

const game = {
    xTurn: true,
    oState: [],
    xState: [],
    finished: false,
    winningStates: [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        ['0', '4', '8'],
        ['2', '4', '6']
    ]
};

function startGame() {
    playerX.name = document.getElementsByName("playerX-name")[0].value
    playerO.name = document.getElementsByName("playerO-name")[0].value;
    sessionStorage.playerX_data = JSON.stringify(playerX);
    sessionStorage.playerO_data = JSON.stringify(playerO);
    document.getElementById("game").classList.remove('hidden');
    document.getElementById("game-setup-container").classList.add('hidden');
    updateTurnText(playerX);
    updateNameTexts();
}

document.addEventListener('click', event => {
    const target = event.target
    const isCell = target.classList.contains('grid-cell')
    const isDisabled = target.classList.contains('disabled')

    if (isCell && !isDisabled) {
        const cellValue = target.dataset.value;

        if (game.xTurn === true) {
            game.xState.push(cellValue);
            updateTurnText(playerO);
        } else {
            game.oState.push(cellValue);
            updateTurnText(playerX);
        }

        target.classList.add('disabled');
        target.classList.add(game.xTurn ? 'x' : 'o');
        target.querySelector("img").setAttribute("src", game.xTurn ?
            "images/X.svg" : "images/O.svg");

        game.xTurn = !game.xTurn;

        game.winningStates.forEach(winningState => {
            const xWins = winningState.every(state => game.xState.includes(state));
            const oWins = winningState.every(state => game.oState.includes(state));

            if (xWins || oWins) {
                document.querySelectorAll('.grid-cell').forEach(cell => cell.classList.add('disabled'));
                document.getElementById("reset-btn-div").querySelector('input').classList.add('disabled');
                document.querySelector('.game-over').classList.add('visible');
                document.querySelector('.game-over-text').textContent = xWins ?
                    playerX.name + ' wins!' : playerO.name + ' wins!';

                if (xWins) {
                    playerX.score += 1;
                    sessionStorage.playerX_data = JSON.stringify(playerX);
                }
                else {
                    playerO.score += 1;
                    sessionStorage.playerO_data = JSON.stringify(playerO);
                }

                game.finished = true;
                disableButton("reset-btn");
                setTimeout(function () { startNextRound() }, 2500);
            }
        });

        if (!document.querySelectorAll('.grid-cell:not(.disabled)').length && !game.finished) {
            document.querySelector('.game-over').classList.add('visible');
            document.querySelector('.game-over-text').textContent = 'Draw!';

            drawScore += 1;
            sessionStorage.draw_score = drawScore;

            game.finished = true;
            disableButton("reset-btn");
            setTimeout(function () { startNextRound() }, 2500);
        }
    }

});

function startNextRound() {
    document.querySelector('.game-over').classList.remove('visible');
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o');
        cell.querySelector('img').removeAttribute("src");
    })
    enableButton("reset-btn");
    updateScoreTexts();

    game.finished = false;
    game.xState = [];
    game.oState = [];
}


function resetScores() {
    playerO.score = 0;
    playerX.score = 0;
    drawScore = 0
    sessionStorage.draw_score = drawScore;
    sessionStorage.playerO_data = JSON.stringify(playerO);
    sessionStorage.playerX_data = JSON.stringify(playerX);
    updateScoreTexts();
}

function disableButton(buttonId) {
    document.getElementById(buttonId).classList.add('disabled');
    document.getElementById(buttonId).setAttribute("disabled", "");
}

function enableButton(buttonId) {
    document.getElementById(buttonId).classList.remove('disabled');
    document.getElementById(buttonId).removeAttribute("disabled");
}


function updateScoreTexts() {
    document.getElementById("draw-info").querySelector('.player-score').textContent = drawScore;
    document.getElementById("playerX-info").querySelector('.player-score').textContent = playerX.score;
    document.getElementById("playerO-info").querySelector('.player-score').textContent = playerO.score;
}

function updateNameTexts() {
    document.getElementById("playerX-info").querySelector('.player-name').textContent = playerX.name;
    document.getElementById("playerO-info").querySelector('.player-name').textContent = playerO.name;
}

function updateTurnText(player) {
    document.getElementById("turn").textContent = player.name + '\'s turn';
}


