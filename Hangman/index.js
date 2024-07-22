const hangmanImage=document.querySelector(".hangman-box img")
const keyboardDiv=document.querySelector(".keyboard");
const wordDisplay=document.querySelector(".word-display");
const guessesText=document.querySelector(".guesses-text b");
const gameModal=document.querySelector(".game-modal");
const playAgainBtn=document.querySelector(".play-again")



let currentWord,correctLetters=[], wrongGuessCount=0;
const maxGuesses=6;

const resetGame=()=>{
    correctLetters=[];
    wrongGuessCount=0;
    hangmanImage.src=`images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText=`${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn=>btn.disabled=false);
    wordDisplay.innerHTML=currentWord.split("").map(()=> `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");

}


const getRandomWord=()=>{
    const { word, hint }=wordList[Math.floor(Math.random() * wordList.length)];
    currentWord=word;
    document.querySelector(".hint-text b").innerText=hint;
    resetGame();
    wordDisplay.innerHTML=word.split("")
                              .map(()=>`<li class="letter"></li>`)
                              .join("");
}
const gameOver=(isVictory)=>{
    setTimeout(() => {
        const modalText= isVictory ? `You found the word` : `The correct word was:`;
        gameModal.querySelector("img").src= `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText=`${isVictory ? 'Congrats!' : 'Game Over'}`;
        gameModal.querySelector("p").innerHTML=`${modalText} <b> ${currentWord}</b> `
        gameModal.classList.add("show");
    }, 300);
}
const initGame=(button, clickedLetter)=>{
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach((letter,index)=>{
            if(letter === clickedLetter){
                correctLetters.push(letter)
                wordDisplay.querySelectorAll('li')[index].innerText=letter;
                wordDisplay.querySelectorAll('li')[index].classList.add("guessed");
            }
        })
    }else{
        wrongGuessCount++;
        hangmanImage.src=`images/hangman-${wrongGuessCount}.svg`
    }
    button.disabled=true;
    guessesText.innerText=`${wrongGuessCount} / ${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

//Create  keyboard buttons dinamycally
for ( let i=97;i<=122; i++){
    const button= document.createElement("button");
    button.innerText=String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click",event=>initGame(event.target, String.fromCharCode(i)))
}

getRandomWord();

playAgainBtn.addEventListener("click",getRandomWord())