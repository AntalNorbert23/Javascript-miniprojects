import apikey from apikey.js

const generateForm=document.querySelector(".generate-form");
const imageGallery=document.querySelector(".image-gallery");

let isImageGenerating=false;


const updateImageCard=(imgDataArray)=>{
    imgDataArray.forEach((imgObject,index)=>{
        const imgCard=imageGallery.querySelectorAll(".img-card")[index];
        const imgElement=imgCard.querySelector("img");
        const downloadBtn=imgCard.querySelector("download-btn");

        const aiGeneratedImg=`data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src=aiGeneratedImg;


        imgElement.onload=()=>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`)
        }
    })  
}


const generateAiImages=async (userPrompt,userImgQuantity)=>{
    try{
        const response= await fetch("https://api.openai.com/v1/images/generations",{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${apikey}`
                },
                body:JSON.stringify({
                    prompt:userPrompt,
                    n:parseInt(userImgQuantity),
                    size:"512x512",
                    response_format:"b64_json"
                })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.")
        const { data }=await response.json();

        updateImageCard([...data])
    }catch(error){
        alert(error.message);
    }finally{
        isImageGenerating=false;
    }
}


const handleFormSubmission=(event)=>{
    event.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating=true;

    const userPrompt=event.srcElement[0].value;
    const userImgQuantity=event.srcElement[1].value;

    const imgCardMarkup=Array.from({length:userImgQuantity},()=>{
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    }).join("");

    imageGallery.innerHTML=imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity );
}

generateForm.addEventListener("submit",handleFormSubmission)