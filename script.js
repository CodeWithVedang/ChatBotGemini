const API_KEY = "AIzaSyCIQ8ueVkFNRNYbC6zMSJIkTVne49FMbuw"; // Replace with your actual Gemini AI API key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("User", message, "user-message");
    userInput.value = "";

    appendMessage("Bot", "Thinking...", "bot-message", true);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: { text: message } }),
        });

        const data = await response.json();
        document.querySelector(".loading")?.remove();
        
        const botMessage = data?.candidates?.[0]?.output || "Sorry, I couldn't process that.";
        appendMessage("Bot", botMessage, "bot-message");
    } catch (error) {
        document.querySelector(".loading")?.remove();
        appendMessage("Bot", "Oops! Something went wrong.", "bot-message");
    }
}

function appendMessage(sender, text, className, isLoading = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", className);
    if (isLoading) msgDiv.classList.add("loading");

    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
