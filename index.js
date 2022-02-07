const prompts = require("prompts");
const chalk = require("chalk");
const wordsJSON = require("./words.json");

let puzzle = "";

const wordlePrompt = {
  type: "text",
  name: "word",
  message: "Enter a 5 word...",
  validate: value => value.length != 5 ? 'Word must be 5 letters' : true
};

async function check(guess) {
  let puzzleCopy = puzzle;
  const colors = Array(guess.length).fill(chalk.white.bgGrey);
  // loop through guess and mark green if fully correct
  for (let i = 0; i < guess.length; i++) {
    // check if the letter at the specified index in the guess word exactly
    // matches the letter at the specified index in the puzzle
    if (guess[i] === puzzleCopy[i]) {
      colors[i] = chalk.white.bgGreen;
      // remove letter from answer, so it's not scored again
      puzzleCopy = puzzleCopy.replace(guess[i], " ");
    }
  }
  // loop through guess and mark yellow if partially correct
  for (let i = 0; i < guess.length; i++) {
    // check if the letter at the specified index in the guess word is at least
    // contained in the puzzle at some other position
    if (guess[i] !== puzzleCopy[i] && puzzleCopy.includes(guess[i])) {
      colors[i] = chalk.white.bgYellow;
      // remove letter from answer, so it's not scored again
      puzzleCopy = puzzleCopy.replace(guess[i], " ");
    }
  }
  // loop over each letter and use its color to print it
  for (let i = 0; i < guess.length; i++) {
    process.stdout.write(colors[i].bold(` ${guess[i]} \t`));
  }
}

async function play(tries) {
  // the user gets 5 tries to solve the puzzle not including the first guess
  if (tries < 6) {
    // ask the player for a guess word
    const response = await prompts(wordlePrompt);
    const guess = response.word.toUpperCase();
    // if the word matches, they win!
    if (guess == puzzle) {
      console.log("WINNER!");
    } else {
      check(guess);
      // this forces std out to print out the results for the last guess
      process.stdout.write("\n");
      // repeat the game and increment the number of tries
      play(++tries);
    }
  } else {
    console.log(`INCORRECT: The word was ${puzzle}`);
  }
}

async function main() {
  // get a random word
  randomNumber = Math.floor(Math.random(wordsJSON.length) * wordsJSON.length);
  puzzle = wordsJSON[randomNumber].toUpperCase();

  // start the game
  await play(0);
}

main();
