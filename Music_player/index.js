import songs from "./songs.js";

const progress=document.getElementById("progress");
const song=document.getElementById("song");
const controlIcon=document.getElementById("controlIcon");
const controlIconContainer=document.getElementById("controlIconContainer")
let currentSongIndex=0;


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


loadSong(currentSongIndex);