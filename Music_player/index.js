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
let currentSongIndex=0;
let lastKeyTime=0;
const doublePressDelay=300;
let updateProgressInterval;



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

function stopSong(){
    song.pause();
    song.currentTime=0;
    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");
    clearInterval(updateProgressInterval);
}

controlIconContainer.addEventListener('click',function(){
    if(controlIcon.classList.contains("fa-pause")){
       stopSong();
    }else{
       playSong();
    }
})


progress.onchange=function(){
    song.play();
    song.currentTime=progress.value;
}

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

document.querySelector('.backward-container').addEventListener('click',()=> {
    currentSongIndex=(currentSongIndex-1+songs.length) % songs.length
    loadSong(currentSongIndex);
    playSong();
})

document.querySelector('.forward-container').addEventListener('click',()=>{
    currentSongIndex=(currentSongIndex +1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
})


document.querySelector(".circle-left").addEventListener('click',()=>{
    if(volumeControlContainer.style.display ==="none"){
        volumeControlContainer.style.display="block";
    }else{
        volumeControlContainer.style.display="none";
    }
})

volumeControl.addEventListener('input',()=>{
    song.volume=volumeControl.value;
})

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
    }

    volumeControl.value = song.volume;
})


menuIcon.addEventListener('click',()=>{
    songModal.style.display='block';
    songList.innerText='';
    songs.forEach((song,index)=>{
        const songRow=document.createElement('li');
        songRow.textContent=song.title;
        songRow.addEventListener('click',()=>{
            currentSongIndex=index;
            loadSong(currentSongIndex);
            songModal.style.display='none';
            playSong();
        })
        songList.appendChild(songRow)
    })
})

closeModal.addEventListener('click',()=>{
    songModal.style.display='none';
})

document.addEventListener('click',(event)=>{
    if (event.target === songModal){
        songModal.style.display="none";
    }
})


song.addEventListener('ended',()=>{
    currentSongIndex+=1

    if(currentSongIndex>=songs.length){
        stopSong();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }else{
        loadSong(currentSongIndex);
        playSong();
    }
})

loadSong(currentSongIndex);