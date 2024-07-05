import songs from "./songs.js";

const progress=document.getElementById("progress");
const song=document.getElementById("song");
const controlIcon=document.getElementById("controlIcon");
const controlIconContainer=document.getElementById("controlIconContainer");
const volumeControlContainer=document.getElementById("volume-control-container");
const volumeControl=document.getElementById("volume-control");
let currentSongIndex=0;
let lastKeyTime=0;
const doublePressDelay=300;

controlIconContainer.addEventListener('click',function(){
    if(controlIcon.classList.contains("fa-pause")){
        song.pause();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }else{
        song.play();
        if(song.play()){
            setInterval(()=>{
                progress.value=song.currentTime;
            },1000)
        }
        controlIcon.classList.add("fa-pause");
        controlIcon.classList.remove("fa-play");
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
    song.play();
})

document.querySelector('.forward-container').addEventListener('click',()=>{
    currentSongIndex=(currentSongIndex +1) % songs.length;
    loadSong(currentSongIndex);
    song.play();
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

document.addEventListener('keydown',(event)=>{
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
        }
        lastKeyTime=currentTime;
        song.play();
    }else if( key === "ArrowLeft"){
        let currentTime= new Date().getTime();
        if(currentTime-lastKeyTime<doublePressDelay){
            currentSongIndex=(currentSongIndex-1+songs.length) % songs.length;
            loadSong(currentSongIndex);
        }
        lastKeyTime=currentTime;
        song.play();
    }

    volumeControl.value = song.volume;
})


loadSong(currentSongIndex);