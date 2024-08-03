import apikey from "./apikey.js";

const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn")

let userMessage;
const inputInitHeight=chatInput.scrollHeight


const createChatRow=(message,className)=>{
    const chatRow=document.createElement("li");
    chatRow.classList.add("chat",className);
    let chatContent =className ==="outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatRow.innerHTML=chatContent;
    chatRow.querySelector("p").textContent=message;
    return chatRow;
}

const generateResponse=(incomingChatRow)=>{
     const API_URL="https://api.openai.com/v1/chat/completions";
     const messageElement=incomingChatRow.querySelector("p");

     const requestOptions={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${apikey}`
        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:userMessage}]
        })
     }
     fetch(API_URL,requestOptions)
     .then(response=>response.json())
     .then(data=>{
        messageElement.textContent=data.choices[0].message.content;
     })
     .catch(error=>{
        console.log(error.message);
        messageElement.classList.add("error");
        messageElement.textContent="Oops! Something went wrong. Please try again.";
     })
     .finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));
}


const handleChat=()=>{
    userMessage=chatInput.value.trim();

    if (!userMessage)return;

    chatInput.value='';
    chatInput.style.height=`${inputInitHeight}px`;

    chatbox.appendChild(createChatRow(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight)

    setTimeout(() => {
        const incomingChatRow=createChatRow("Thinking...","incoming");
        chatbox.appendChild(incomingChatRow);
        chatbox.scrollTo(0,chatbox.scrollHeight)
        generateResponse(incomingChatRow);
    }, 600);
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}`;
})
chatInput.addEventListener("keyup",(event)=>{
   if(event.key === "Enter" && !event.shiftKey && window.innerWidth>800){
    event.preventDefault();
    handleChat()
   }
})
chatbotCloseBtn.addEventListener("click",()=>{
    document.body.classList.remove("show-chatbot");
})
chatbotToggler.addEventListener("click",()=>{
    document.body.classList.toggle("show-chatbot");
})
sendChatBtn.addEventListener("click",handleChat)