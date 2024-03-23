const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
const chatBox = document.getElementById("c-chat-box");

const closeChatBox = () => {
    console.log("close");
    chatBox.classList.add("hidden");
};

chatBoxCloseButton.addEventListener("click", closeChatBox);
