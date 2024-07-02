
const progress=document.getElementById("progress");
const song=document.getElementById("song");
const controlIcon=document.getElementById("controlIcon");
const controlIconContainer=document.getElementById("controlIconContainer")
song.onloadedmetadata=function(){
    progress.max=song.ondurationchange;
    progress.value=song.currentTime;
}

controlIconContainer.addEventListener('click',function(){
    if(controlIcon.classList.contains("fa-pause")){
        song.pause();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }else{
        song.play();
        controlIcon.classList.add("fa-pause");
        controlIcon.classList.remove("fa-play");
    }
})

if(song.play()){
    setInterval(()=>{
        progress.value=song.currentTime;
    },500)
}

progress.onchange=function(){
    song.play();
    song.currentTime=progress.value;
}
