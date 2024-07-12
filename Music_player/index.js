import songs from "./songs.js";

const progress=document.getElementById("progress");
const song=document.getElementById("song");
const controlIcon=document.getElementById("controlIcon");
const controlIconContainer=document.getElementById("controlIconContainer");
const volumeControlContainer=document.getElementById("volume-control-container");
const volumeControl=document.getElementById("volume-control");
const menuIcon = document.getElementById("menu-icon");
const songModal = document.getElementById("songModal");
const closeModal = document.querySelector(".close");
const songList = document.getElementById("songList");
const searchResults = document.getElementById("searchResults");
const searchInput = document.getElementById("search-input");
const searchModal = document.getElementById("searchModal");
const closeSearchModal = document.querySelector(".close-search");
let currentSongIndex=0;
let lastKeyTime=0;
const doublePressDelay=300;
let updateProgressInterval;
const isLoading=false;


let isRewinding=false;
let rewindInterval;

//function to play the song 
function playSong() {
    song.play().catch(error => {
        console.log("Failed to play the song: ", error);
    });
    controlIcon.classList.add("fa-pause");
    controlIcon.classList.remove("fa-play");
    clearInterval(updateProgressInterval);
    updateProgressInterval = setInterval(() => {
        progress.value = song.currentTime;
    }, 1000);
}

//function to stop the song
function stopSong(){
    song.pause();
    song.currentTime=progress.value;
    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");
    clearInterval(updateProgressInterval);
}

//play-stop music click event listener
controlIconContainer.addEventListener('click',function(){
    if(controlIcon.classList.contains("fa-pause")){
       stopSong();
    }else{
       playSong();
    }
})

function updateProgressBar(){
    progress.value = song.currentTime;
    if (song.paused) {
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    } else {
        controlIcon.classList.add("fa-pause");
        controlIcon.classList.remove("fa-play");
    }
}

//progress value increasing
progress.onchange = function() {
    song.currentTime = progress.value;
    if (song.paused) {
        playSong();
    } else {
        updateProgressBar();
    }
};

//load the song to display it
function loadSong(index){
    const songData=songs[index];
    document.querySelector('.song-title').textContent = songData.title;
    document.querySelector('.artist').textContent = songData.artist;
    document.querySelector('.song-img').src = songData.img;
    song.src=songData.src;
    song.onloadedmetadata=()=>{
        progress.max=song.duration;
        progress.value=song.currentTime;
    }
}

//previous music button event listener
document.querySelector('.backward-container').addEventListener('click',()=> {
    currentSongIndex=(currentSongIndex-1+songs.length) % songs.length
    loadSong(currentSongIndex);
    playSong();
})

//next music event listener
document.querySelector('.forward-container').addEventListener('click',()=>{
    currentSongIndex=(currentSongIndex +1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
})

//volume controller open-close
document.querySelector(".circle-left").addEventListener('click',()=>{
    if(volumeControlContainer.style.display ==="none"){
        volumeControlContainer.style.display="block";
    }else{
        volumeControlContainer.style.display="none";
    }
})

//adjust volume event listener
volumeControl.addEventListener('input',()=>{
    song.volume=volumeControl.value;
})

//event listeners for -previous,next music and up/down music volume
document.addEventListener('keyup',(event)=>{
    let key=event.key;

    if(key === "ArrowDown"){
        song.volume=Math.max(0, song.volume - 0.1);
    }else if( key === "ArrowUp"){
        song.volume=Math.min(1, song.volume + 0.1);
    }else if ( key === "ArrowRight"){
        let currentTime=new Date().getTime();
        if(currentTime-lastKeyTime<doublePressDelay){
            currentSongIndex=(currentSongIndex+1)%songs.length;
            loadSong(currentSongIndex);
            playSong();
        }
        lastKeyTime=currentTime;
    }else if( key === "ArrowLeft"){
        let currentTime= new Date().getTime();
        if(currentTime-lastKeyTime<doublePressDelay){
            currentSongIndex=(currentSongIndex-1+songs.length) % songs.length;
            loadSong(currentSongIndex);
            playSong();
        }
        lastKeyTime=currentTime;
    }else if (event.code === "Space"){
        if (song.paused){
            playSong();
        }else{
            stopSong();
        }
       
    }

    volumeControl.value = song.volume;
})

//event listener to open the music menu 
menuIcon.addEventListener('click',()=>{
    songModal.style.display='block';
    songList.innerText='';
    //for each song create a list element and on clicked play the song by loading it
    songs.forEach((song,index)=>{
        const songRow=document.createElement('li');
        songRow.textContent=song.title;
        songRow.addEventListener('click',()=>{
            currentSongIndex=index;
            loadSong(currentSongIndex);
            songModal.style.display='none';
            playSong();
        })
        songList.appendChild(songRow);
    })
})

//clicking on the X closes the song list modal
closeModal.addEventListener('click',()=>{
    songModal.style.display='none';
})

//clicking outside of the music list closes the list modal
document.addEventListener('click',(event)=>{
    if (event.target === songModal){
        songModal.style.display="none";
    }
})

//autoplay song and auto-stop song at the end of playlist
song.addEventListener('ended',()=>{
    currentSongIndex+=1
    //auto stop
    if(currentSongIndex>=songs.length){
        stopSong();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }else{
        //autoplay
        loadSong(currentSongIndex);
        playSong();
    }
})

//function for play the searched music
function playSearchResult(result) {
    song.src = result.previewUrl;
    document.querySelector('.song-title').textContent = result.trackName;
    document.querySelector('.artist').textContent = result.artistName;
    document.querySelector('.song-img').src = result.artworkUrl100;
    searchModal.style.display = 'none';
    playSong();
}

//function to display the searched music 
function displaySearchResults(results){
    searchResults.innerText='';
    results.forEach(result=>{
        const music=document.createElement('li');
        music.textContent=result.trackName;
        music.addEventListener('click',()=>{
            playSearchResult(result);
        })
        searchResults.appendChild(music);
    })
    searchModal.style.display = 'block';
}

//fetch music data from the itunes api
async function searchMusic(query){
    const url=`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10`

    try{
        const response=await fetch(url);
        const data=await response.json();
        const results=data.results;
        displaySearchResults(results);
    }catch(error){
        console.error('Error fetching musics:', error);
    }
}

//search and fetch music on enter keydown
searchInput.addEventListener('keydown',(event)=>{
    if(event.key === 'Enter'){
        const query=searchInput.value.trim();
        if(query){
            searchMusic(query);
            searchInput.value='';
        }
    }
})

//clicking on the X closes the song list modal
closeSearchModal.addEventListener('click',()=>{
    searchModal.style.display="none";
})

//clicking outside of the music list closes the list modal
document.addEventListener('click',(event)=>{
    if(event.target === searchModal){
        searchModal.style.display='none';
    }
})

document.addEventListener('keydown',(event)=>{
    event.preventDefault()
    console.log(event.key)
    if(event.key === 'Backspace' && !isRewinding){
        isRewinding=true;
        rewindInterval=setInterval(()=>{
            song.currentTime=Math.max(0,song.currentTime-0.9);
        },100);
    }else if(event.key === 'Tab' && !isRewinding){
        isRewinding=true;
        rewindInterval=setInterval(()=>{
            song.currentTime=Math.min(song.duration,song.currentTime+0.9);
        },100);
    }  
})

document.addEventListener('keyup', (event) => {
    if ((event.key === 'Backspace' || event.key === 'Tab') && isRewinding) {
        isRewinding = false;
        clearInterval(rewindInterval);
    }
});


loadSong(currentSongIndex);