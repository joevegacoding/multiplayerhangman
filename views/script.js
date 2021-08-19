
const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const popMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById('final-message-reveal-word');
const figureParts = document.querySelectorAll('.figure-part');

const player0El = document.querySelector('.player--0')
const player1El = document.querySelector('.player--1')


//Selecting elements
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const lastScore1 = document.getElementById('last-score1')
const lastScore2 = document.getElementById('last-score2')

const winningMessage = 'Congratulations! You got a point! 😃';

score0El.textContent = 0;
score1El.textContent = 0;

const scores = [0, 0];
let currentScore = 0;
let activePlayer = 0;

const getWords = function() {
	fetch('http://localhost:3001/getwords')
	.then((response) => response.json())
	.then((data) => {
		let words = data
				const res = words.map(e => e.word);
				console.log(res);
				return res
		
	})
}

function getPoints() {
	// var results = [];
	fetch('http://localhost:5000/get_score')
	.then((response) => response.json())
	.then((data) => {
		// let lastScore1 = data[0].score_player1;
		// let lastScore2 = data[0].score_player2;
	
		// results.push(lastScore1, lastScore2);

document.getElementById('last-score1').innerHTML = `Total Score: ${data[0].total_player1}`;
document.getElementById('last-score2').innerHTML = `Total Score: ${data[0].total_player2}`;
// console.log( data[0].total_player1);
		// console.log(data[0].score_player2);

	})
	// return results;
}




var fetchedWords = getWords();

var words = ['gorilla', 'hippopotamus', 'rhinoceros', 'lion', 'cheetah', 'giraffe', 'porcupine', 'elephant', 'hippopotamus'];
console.log(words);
let selectedWord = words[Math.floor(Math.random() * words.length)];
let playable = true;

const correctLetters = [];
const wrongLetters = [];

// Shows hidden word.
function displayWord() {
	wordEl.innerHTML = `
    ${selectedWord
			.split('')
			.map(
				letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
			)
			.join('')}
  `;
 
	const innerWord = wordEl.innerText.replace(/[ \n]/g, '');

	if (innerWord === selectedWord) {

		popMessage.innerText = winningMessage;
		finalMessageRevealWord.innerText = '';
		popup.style.display = 'flex';

		playable = false;
	}
}

// Updates the wrong letters.
function updateWrongLettersEl() {
	// Display wrong letters
	wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p style="color:red; font-size:25px; font-weight: bold;">Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

	// Displays figure parts.
	figureParts.forEach((part, index) => {
		const errors = wrongLetters.length;

		if (index < errors) {
			part.style.display = 'block';
		} else {
			part.style.display = 'none';
		}
	});

	// Check if lost
	if (wrongLetters.length === figureParts.length) {
		popMessage.innerText = 'Unfortunately you lost. 😕';

		finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    
		popup.style.display = 'flex';

		playable = false;
		
	}
}

// Shows notification.
function showNotification() {
	notification.classList.add('show');

	setTimeout(() => {
		notification.classList.remove('show');
	}, 2000);
}

// The keydown pressed logic.
window.addEventListener('keydown', e => {
	if (playable) {
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			const letter = e.key.toLowerCase();

			if (selectedWord.includes(letter)) {
				if (!correctLetters.includes(letter)) {
					correctLetters.push(letter);

					displayWord();
				} else {
					showNotification();
				}
			} else {
				if (!wrongLetters.includes(letter)) {
					wrongLetters.push(letter);

					updateWrongLettersEl();
				} else {
					showNotification();
				}
			}
		}
	}
});

function toggleActivePlayer(){
	activePlayer = activePlayer === 0 ? 1 : 0;
	player0El.classList.toggle('player--active');
	player1El.classList.toggle('player--active');
}

// Logic that keeps the game going / restarts the game.
playAgainBtn.addEventListener('click', () => {
	playable = true;

	//  Empty arrays
	correctLetters.splice(0);
	wrongLetters.splice(0);

	selectedWord = words[Math.floor(Math.random() * words.length)];

	displayWord();
	updateWrongLettersEl();

	popup.style.display = 'none';

	if (popMessage.innerText === winningMessage) {

		if (scores[activePlayer] === 2) {
			// Ends the current play/game
			document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
			document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
      		document.querySelector(`.player--${activePlayer}`).textContent = ` Player ${activePlayer + 1} Won ! 🏆`;
			playable = false
			
      
		} else {
		
		currentScore += 1;
		document.getElementById(`score--${activePlayer}`).textContent = currentScore;
		
		scores[activePlayer] += currentScore;
		document.getElementById(`current--${activePlayer}`).textContent = scores[activePlayer];

		currentScore = 0;
		toggleActivePlayer()
	}
			toggleActivePlayer()
	} else if (popMessage.innerText === 'Unfortunately you lost. 😕') {
		
		toggleActivePlayer()

	}


});

displayWord();

// The logic below is responsible for fetching the words from the database.

// const fetchJSON = async function get() {
// 	try {
// 		const res = await fetch('http://localhost:3001/getwords');
// 		const json = await res.json();
// 		console.log('json', json);
// 	} catch (err) {
// 		console.error('err', err);
// 	}
// }
// const url = 'http://localhost:3001/getwords';
// let fetchedWords = [];
// const getWords = () => {
// 	axios.get(url).then((response) => {
// 		var wordsArray = []
// 		// setAnimalList(response.data);
// 		let words = response.data
// 		const res = words.map(e => e.word);
// 		console.log(res);
	
// 	  })
// 	}
getWords();
getPoints()
     